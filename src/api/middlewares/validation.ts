// src/api/middlewares/validation.ts
import { Request, Response, NextFunction } from 'express';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import specs from '../../config/swagger';

// Configurar AJV con validación de todos los errores y formatos
const ajv = new Ajv({
  allErrors: true,
  removeAdditional: false,
  strict: false  // Permitir palabras clave desconocidas como "example"
});
addFormats(ajv);

// Cache de esquemas compilados para mejor rendimiento
const compiledSchemas: { [key: string]: any } = {};

// Función para obtener el esquema de validación para una ruta específica
function getSchemaForRoute(path: string, method: string): any {
  const swaggerPaths = specs.paths || {};

  // Primero intentar coincidencia directa
  const fullPath = path;
  if (swaggerPaths[fullPath]?.[method.toLowerCase()]?.requestBody?.content?.['application/json']?.schema) {
    return resolveSchema(swaggerPaths[fullPath][method.toLowerCase()].requestBody.content['application/json'].schema, specs);
  }

  // Intentar coincidir rutas parametrizadas
  for (const [swaggerPath, methods] of Object.entries(swaggerPaths)) {
    // Convertir ruta swagger con parámetros a expresión regular
    const regexPath = swaggerPath.replace(/\{[^}]+\}/g, '[^/]+');
    const regex = new RegExp(`^${regexPath}$`);

    if (regex.test(fullPath)) {
      const methodSpec = (methods as any)[method.toLowerCase()];
      if (methodSpec?.requestBody?.content?.['application/json']?.schema) {
        return resolveSchema(methodSpec.requestBody.content['application/json'].schema, specs);
      }
    }
  }

  return null;
}

// Función para resolver referencias de esquemas ($ref)
function resolveSchema(schema: any, specs: any): any {
  if (schema && schema.$ref) {
    const ref = schema.$ref;
    if (ref.startsWith('#/components/schemas/')) {
      const schemaName = ref.replace('#/components/schemas/', '');
      return specs.components?.schemas?.[schemaName] || schema;
    }
  }
  return schema;
}

// Middleware de validación de solicitudes
export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const span = trace.getActiveSpan();
  
  // Obtener el esquema para esta ruta
  const schema = getSchemaForRoute(req.path, req.method);

  if (!schema) {
    // No hay esquema definido para esta ruta, omitir validación
    span?.setAttribute('validation.skipped', true);
    span?.addEvent('Validación omitida - no hay esquema definido');
    return next();
  }

  span?.setAttribute('validation.schema_found', true);
  span?.setAttribute('validation.route', `${req.method} ${req.path}`);

  const schemaKey = `${req.method}${req.path}`;
  if (!compiledSchemas[schemaKey]) {
    try {
      // Agregar additionalProperties: false para detectar campos extra
      const strictSchema = { ...schema, additionalProperties: false };
      compiledSchemas[schemaKey] = ajv.compile(strictSchema);
      span?.addEvent('Esquema compilado exitosamente');
    } catch (error) {
      console.error('Error de compilación de esquema:', error);
      span?.setStatus({ code: SpanStatusCode.ERROR, message: 'Error de compilación de esquema' });
      span?.recordException(error as Error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  const validate = compiledSchemas[schemaKey];
  const valid = validate(req.body);

  if (!valid) {
    const errors = validate.errors || [];

    span?.setAttribute('validation.failed', true);
    span?.setAttribute('validation.error_count', errors.length);
    span?.addEvent('Validación fallida', {
      'validation.errors': JSON.stringify(errors)
    });

    // Verificar si es un error de tipo/estructura o fallo de integridad (propiedades extra)
    const hasTypeErrors = errors.some((error: any) =>
      error.keyword === 'type' || error.keyword === 'format' || error.keyword === 'required' || error.keyword === 'minLength' || error.keyword === 'maxLength'
    );

    const hasExtraProperties = errors.some((error: any) =>
      error.keyword === 'additionalProperties'
    );

    if (hasTypeErrors) {
      // Error de validación detallado para tipos/estructuras
      span?.setAttribute('validation.error_type', 'type_structure');
      const errorMessages = errors.map((error: any) => {
        const field = error.instancePath ? error.instancePath.substring(1) : 'root';
        return `${field}: ${error.message}`;
      });

      return res.status(422).json({
        error: 'Validation failed',
        details: errorMessages
      });
    } else if (hasExtraProperties) {
      // Fallo de integridad para campos alterados (propiedades extra)
      span?.setAttribute('validation.error_type', 'integrity_failure');
      return res.status(422).json({
        error: 'integridad_fallida'
      });
    } else {
      // Otros errores de validación
      span?.setAttribute('validation.error_type', 'other');
      return res.status(422).json({
        error: 'Validation failed',
        details: errors.map((error: any) => error.message)
      });
    }
  }

  // Validación exitosa
  span?.setAttribute('validation.success', true);
  span?.addEvent('Validación exitosa');

  next();
}