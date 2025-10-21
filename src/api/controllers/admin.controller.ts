// src/api/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import UserService from '../../services/user.service';
import FormService from '../../services/form.service';

// Helper function for detailed admin error logging and response
function handleAdminError(
  err: any,
  span: any,
  operation: string,
  req: any,
  res: Response,
  context?: Record<string, any>
) {
  // Log detailed error information
  const errorDetails = {
    operation,
    tenant: req.tenant,
    adminUser: req.user?.username,
    adminUserId: req.user?.id,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
    context,
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code,
      sql: err.sql, // For database errors
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    },
    timestamp: new Date().toISOString()
  };

  console.error(`[AdminError:${operation}]`, JSON.stringify(errorDetails, null, 2));

  // Set span error
  span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
  span?.recordException(err);
  span?.addEvent(`Error in ${operation}`);

  // Return detailed error for admin users (in development/debugging)
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorResponse = isDevelopment ? {
    error: "Server error",
    operation,
    details: {
      message: err.message,
      code: err.code,
      timestamp: new Date().toISOString()
    }
  } : { error: "Server error" };

  return res.status(500).json(errorResponse);
}

// Función para obtener todos los usuarios de un tenant (solo para usuarios backend)
async function getAllUsers(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.getAllUsers');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('admin.user', req.user?.username);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;

  try {
    span?.addEvent('Obteniendo lista completa de usuarios para admin');

    // Llamamos al servicio para obtener todos los usuarios con información completa
    const users = await UserService.getAllUsers(sequelize);

    span?.setAttribute('users.count', users.length);
    span?.addEvent('Lista completa de usuarios obtenida exitosamente');

    // Respondemos con los usuarios
    return res.status(200).json({
      message: users.length === 0 ? 'No se encontraron usuarios en este tenant' : 'Usuarios obtenidos exitosamente',
      tenant,
      data: users,
      count: users.length
    });
  } catch (err: any) {
    return handleAdminError(err, span, 'getAllUsers', req, res);
  }
}

// Función para obtener todos los usuarios con conteo de formularios (solo para usuarios backend)
async function getUsersWithForms(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.getUsersWithForms');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('admin.user', req.user?.username);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;

  try {
    span?.addEvent('Obteniendo usuarios con conteo de formularios para admin');

    // Llamamos al servicio para obtener todos los usuarios con conteo de formularios
    const users = await UserService.getUsersWithFormCounts(sequelize, tenant);

    span?.setAttribute('users.count', users.length);
    span?.addEvent('Usuarios con formularios obtenidos exitosamente');

    // Respondemos con los usuarios y sus conteos
    return res.status(200).json({
      message: users.length === 0 ? 'No se encontraron usuarios en este tenant' : 'Usuarios con formularios obtenidos exitosamente',
      tenant,
      data: users,
      count: users.length
    });
  } catch (err: any) {
    return handleAdminError(err, span, 'getUsersWithForms', req, res);
  }
}

// Función para obtener todos los formularios de un usuario específico (solo para usuarios backend)
async function getUserForms(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.getUserForms');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('admin.user', req.user?.username);
  span?.setAttribute('target.user.id', req.params.userId);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const userId = parseInt(req.params.userId);

  try {
    span?.addEvent('Obteniendo formularios de usuario específico para admin');

    const forms = await FormService.getAllUserForms(sequelize, tenant, userId);

    span?.setAttribute('forms.count', forms.length);
    span?.addEvent('Formularios de usuario obtenidos exitosamente');

    return res.status(200).json({
      message: forms.length === 0 ? 'No se encontraron formularios para este usuario' : 'Formularios del usuario obtenidos exitosamente',
      tenant,
      userId,
      data: forms,
      count: forms.length
    });
  } catch (err: any) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    return handleAdminError(err, span, 'getUserForms', req, res, { userId: req.params.userId });
  }
}

// Exportamos las funciones
export { getAllUsers, getUsersWithForms, getUserForms, createUserAdmin, getTopUsersByFormType, getTenantErrors, deleteUserAdmin, getStatusPageData, deleteUserById };

// Obtener usuario por email/identifier y sus formularios (admin)
export async function getUserByEmail(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.getUserByEmail');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('admin.user', req.user?.username);
  span?.setAttribute('target.identifier', req.params.email);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const identifier = req.params.email;

  try {
    span?.addEvent('Buscando usuario por identificador');

    const user = await UserService.getUserByIdentifier(sequelize, identifier);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const forms = await FormService.getAllFormsForUser(sequelize, tenant, user.id);

    return res.status(200).json({
      message: 'Usuario y actividad obtenidos',
      tenant,
      user,
      data: forms,
      count: forms.length
    });
  } catch (err: any) {
    return handleAdminError(err, span, 'getUserByEmail', req, res, { identifier: req.params.email });
  }
}

// Crear usuario en un tenant específico (admin)
async function createUserAdmin(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.createUser');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('admin.user', req.user?.username);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { username, password, user_email } = req.body || {};

  try {
    span?.addEvent('Admin creating user');

    if (!username || !password) {
      span?.addEvent('Validation failed: missing username or password');
      return res.status(400).json({ error: 'Nombre de usuario y contraseña son requeridos' });
    }

    const newUser = await UserService.registerUser(sequelize, username, password, user_email);

    span?.setAttribute('created.user.id', newUser.id);
    span?.addEvent('User created by admin');

    return res.status(201).json({ message: 'Usuario creado exitosamente', tenant, user: newUser });
  } catch (err: any) {
    if (err.message === 'Username already taken') {
      return res.status(409).json({ error: err.message });
    }
    return handleAdminError(err, span, 'createUserAdmin', req, res, { username: req.body?.username, user_email: req.body?.user_email });
  }
}

// Función para obtener el usuario con más formularios de cada tipo (solo para usuarios backend)
async function getTopUsersByFormType(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.getTopUsersByFormType');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('admin.user', req.user?.username);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;

  try {
    span?.addEvent('Obteniendo usuarios con más formularios por tipo para admin');

    // Llamamos al servicio para obtener los usuarios top por tipo de formulario
    const topUsers = await UserService.getTopUsersByFormType(sequelize, tenant);

    span?.setAttribute('form_types.count', topUsers.length);
    span?.addEvent('Usuarios top por tipo de formulario obtenidos exitosamente');

    // Respondemos con los resultados
    return res.status(200).json({
      message: topUsers.length === 0 ? 'No se encontraron formularios en este tenant' : 'Usuarios top por tipo de formulario obtenidos exitosamente',
      tenant,
      data: topUsers,
      count: topUsers.length
    });
  } catch (err: any) {
    return handleAdminError(err, span, 'getTopUsersByFormType', req, res);
  }
}

// Función para eliminar un usuario por ID (solo para usuarios backend)
async function deleteUserById(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.deleteUserById');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('admin.user', req.user?.username);
  span?.setAttribute('target.userId', req.params.userId);

  const sequelize = req.sequelize;
  const userId = parseInt(req.params.userId);
  const tenant = req.tenant as string;

  try {
    span?.addEvent('Eliminando usuario por ID');

    // Validar que el userId es un número válido
    if (isNaN(userId)) {
      span?.addEvent('Error: ID de usuario inválido');
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    // Buscar el usuario antes de eliminarlo para verificar que existe
    const User = sequelize.models.User;
    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      span?.addEvent('Usuario no encontrado');
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Eliminar el usuario
    const deletedCount = await User.destroy({
      where: { id: userId }
    });

    if (deletedCount === 0) {
      span?.addEvent('No se pudo eliminar el usuario');
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    span?.addEvent('Usuario eliminado exitosamente');

    return res.status(200).json({
      message: "Usuario eliminado exitosamente",
      userId: userId,
      tenant: tenant
    });

  } catch (err: any) {
    return handleAdminError(err, span, 'deleteUserById', req, res, { userId: req.params.userId });
  }
}

// Función para obtener errores por tenant (solo para usuarios backend)
async function getTenantErrors(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.getTenantErrors');
  span?.setAttribute('admin.user', req.user?.username);

  try {
    span?.addEvent('Obteniendo errores por tenant para admin');

    // Llamamos al servicio para obtener los errores
    const errors = await UserService.getTenantErrors();

    span?.setAttribute('errors.http.count', errors.httpErrors?.length || 0);
    span?.setAttribute('errors.app.count', errors.applicationErrors?.length || 0);
    span?.addEvent('Errores por tenant obtenidos exitosamente');

    // Respondemos con los resultados
    return res.status(200).json({
      success: true,
      message: 'Errores por tenant obtenidos exitosamente',
      data: errors,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return handleAdminError(err, span, 'getTenantErrors', req, res);
  }
}

// Función para obtener datos de página de estado (solo para usuarios backend)
async function getStatusPageData(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.getStatusPageData');
  span?.setAttribute('admin.user', req.user?.username);

  try {
    span?.addEvent('Obteniendo datos de página de estado para admin');

    // Llamamos al servicio para obtener los datos de estado
    const statusData = await UserService.getStatusPageData();

    span?.setAttribute('status.hours', statusData.data.length);
    span?.addEvent('Datos de página de estado obtenidos exitosamente');

    // Respondemos con los resultados
    return res.status(200).json({
      success: true,
      message: 'Datos de página de estado obtenidos exitosamente',
      data: statusData,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return handleAdminError(err, span, 'getStatusPageData', req, res);
  }
}

// Eliminar usuario (solo backend)
async function deleteUserAdmin(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.deleteUser');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('admin.user', req.user?.username);
  span?.setAttribute('target.user.id', req.params.userId);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const userId = parseInt(req.params.userId);

  try {
    span?.addEvent('Intentando eliminar usuario');

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const deleted = await UserService.deleteUserById(sequelize, userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Usuario no encontrado o no eliminado' });
    }

    span?.addEvent('Usuario eliminado exitosamente');
    return res.status(200).json({ message: 'Usuario eliminado correctamente', tenant, userId });
  } catch (err: any) {
    return handleAdminError(err, span, 'deleteUserAdmin', req, res, { userId: req.params.userId });
  }
}