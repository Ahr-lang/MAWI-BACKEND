// Importamos swagger-jsdoc para generar la documentación Swagger
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

// Definimos las opciones de configuración para Swagger
const options: any = {
  definition: {
    // Versión de OpenAPI
    openapi: "3.0.0",
    info: {
      // Título de la API
      title: "API de Autenticación",
      // Versión de la API
      version: "1.0.0",
      // Descripción de la API
      description: "Documentación de la API de autenticación con Node.js, Express, Passport y JWT.",
    },
    // Lista de servidores para mostrar en Swagger UI. We'll populate this dynamically
    // further down so we can include both source (localhost) and configured/production URLs
    servers: [],
    components: {
      securitySchemes: {
        // Esquema de seguridad para autenticación Bearer (JWT)
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        // Named API key scheme so Swagger UI shows a clear entry in "Authorize"
        "Tenant API Key": {
          type: 'apiKey',
          in: 'header',
          name: 'apikey',
          description: 'Tenant API key header (header name: "apikey"). Provide the tenant-specific API key here (for example: "robo-key-789"). This header is required by the server at runtime.'
        }
      },
      schemas: {
        // Esquema para credenciales de registro
        RegisterCredentials: {
          type: "object",
          required: ["username", "password", "user_email"],
          properties: {
            username: { type: "string", example: "enrique" },
            password: { type: "string", example: "ilovemessi3520" },
            user_email: { type: "string", format: "email", example: "enrique@example.com" },
          },
        },
        // Esquema para credenciales de login
        LoginCredentials: {
          type: "object",
          required: ["user_email", "password"],
          properties: {
            user_email: { type: "string", format: "email", example: "enrique@example.com" },
            password: { type: "string", example: "ilovemessi3520" },
          },
        },
        // Esquema para respuesta de autenticación
        AuthResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Inicio de sesión exitoso." },
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..." },
            token_type: { type: "string", example: "Bearer" },
            expires_in: { type: "string", example: "7d" },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        // Reusable User schema matching the DB columns
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "enrique" },
            user_email: { type: "string", format: "email", example: "enrique@example.com" },
            lastAccess: { type: "string", format: "date-time", example: "2025-10-07T12:34:56Z" },
            lastLogin: { type: "string", format: "date-time", example: "2025-10-07T12:00:00Z" },
            tenant: { type: "string", example: "agromo" },
          },
        },
      },
    },
    // By default show the Tenant API Key in the Swagger Authorize modal and apply it to operations.
    // This only affects the docs/UI; the server enforcement remains implemented by middleware.
    security: [
      { "Tenant API Key": [] }
    ],
  },
  // Archivos donde buscar anotaciones Swagger (rutas, controladores, docs)
  // Durante desarrollo apuntamos a los archivos TypeScript fuente para feedback rápido
  // En producción el código suele estar compilado en `dist` — incluir ambos patrones
  apis: [], // se rellena más abajo con rutas absolutas para ts/js
  // Mover las rutas definidas al interior de `definition` para que swagger-jsdoc las incluya
};

// Si quieres rutas predefinidas en el spec, añádelas dentro de definition.paths
// (las dejamos definidas aquí y las inyectamos en specs.definition abajo si existen)
const extraPaths = {
  "/api/{tenant}/users/register": {
    post: {
      tags: ["Auth"],
      summary: "Registrar un nuevo usuario",
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo", "back"]
          },
          description: "Identificador del tenant (base de datos)"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterCredentials"
            }
          }
        }
      },
      security: [
        { "Tenant API Key": [] }
      ],
      responses: {
        201: {
          description: "Usuario registrado exitosamente.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" }
            }
          }
        },
        409: {
          description: "El nombre de usuario ya existe."
        }
      }
    }
  },
  "/api/{tenant}/users/login": {
    post: {
      tags: ["Auth"],
      summary: "Iniciar sesión y obtener un token JWT",
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo", "back"]
          },
          description: "Identificador del tenant"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginCredentials"
            }
          }
        }
      },
      security: [
        { "Tenant API Key": [] }
      ],
      responses: {
        200: {
          description: "Inicio de sesión exitoso (token devuelto)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse"
              }
            }
          }
        },
        401: {
          description: "Credenciales inválidas"
        }
      }
    }
  },
  "/api/{tenant}/users/me": {
    get: {
      tags: ["Auth"],
      summary: "Obtener información del usuario autenticado",
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo", "back"]
          },
          description: "Identificador del tenant"
        }
      ],
      security: [
        { "Tenant API Key": [] },
        { bearerAuth: [] }
      ],
      responses: {
        200: {
          description: "Información del usuario autenticado.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" }
            }
          }
        },
        401: {
          description: "Token inválido o ausente."
        }
      }
    }
  },
  "/api/{tenant}/users/logout": {
    post: {
      tags: ["Auth"],
      summary: "Cerrar sesión (stateless)",
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo", "back"]
          },
          description: "Identificador del tenant"
        }
      ],
      security: [
        { "Tenant API Key": [] },
        { bearerAuth: [] }
      ],
      responses: {
        200: {
          description: "Mensaje de cierre de sesión"
        }
      }
    }
  }
};

// NOTE: we will generate specs at the end after populating `options.apis`

// --- Ensure swagger-jsdoc scans TS during dev and compiled JS during production ---
// Build absolute glob patterns covering both source (src) and compiled (dist) files.
const projectRoot = path.resolve(__dirname, "..", "..");
const tsGlobs = [
  path.join(projectRoot, "src/api/routes/*.ts"),
  path.join(projectRoot, "src/api/controllers/*.ts"),
  path.join(projectRoot, "src/api/docs/*.ts"),
];
const jsGlobs = [
  path.join(projectRoot, "dist/api/routes/*.js"),
  path.join(projectRoot, "dist/api/controllers/*.js"),
  path.join(projectRoot, "dist/api/docs/*.js"),
];

// Prefer source TS files when they exist, but include compiled JS for production builds
options.apis = tsGlobs.concat(jsGlobs);

// Re-generate specs after adjusting apis
const finalSpecs: any = swaggerJsdoc(options);
finalSpecs.paths = Object.assign({}, extraPaths, (finalSpecs.paths || {}));
// Export as default so imports (import specs from './config/swagger') continue to work
export default finalSpecs;

// Build a clear, deduplicated servers list so Swagger UI always shows local + configured/prod
const localServer = { url: "https://localhost", description: "Local / dev server" };
const configured = process.env.SWAGGER_SERVER_URL ? { url: process.env.SWAGGER_SERVER_URL, description: "Configured server (SWAGGER_SERVER_URL)" } : null;
const production = { url: "https://api.ecoranger.org", description: "Production server" };

const serversList = [localServer].concat(configured ? [configured] : []).concat([production]);
// Deduplicate by URL
const seen = new Set<string>();
const deduped = serversList.filter(s => {
  if (seen.has(s.url)) return false;
  seen.add(s.url);
  return true;
});

// Attach to exported spec so Swagger UI displays these servers (and also keep options.definition in sync)
finalSpecs.servers = deduped;
if (options && options.definition) options.definition.servers = deduped;
