// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

/* ----------------------------- Rutas (fijas) ----------------------------- */

const extraPaths = {
  "/api/{tenant}/users": {
    get: {
      summary: "Obtener lista de todos los usuarios del tenant",
      tags: ["Auth"],
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
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      responses: {
        200: {
          description: "Lista de usuarios obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  users: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        username: { type: "string", example: "enrique" }
                      }
                    }
                  },
                  tenant: { type: "string", example: "agromo" },
                  count: { type: "number", example: 5 }
                }
              }
            }
          }
        },
        401: { description: "Token inválido o ausente" },
        500: { description: "Error del servidor" }
      }
    }
  },
  "/api/{tenant}/forms/{formKey}/submission": {
    post: {
      summary: "Crear envío de formulario",
      tags: ["Formularios"],
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo"]
          },
          description: "Tenant del formulario"
        },
        {
          in: "path",
          name: "formKey",
          required: true,
          schema: {
            type: "string",
            enum: ["1", "2", "3", "4", "5", "6", "7", "formulario"]
          },
          description: "Tipo de formulario"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              description: "Datos del formulario",
              additionalProperties: true,
              example: {
                nombre: "Juan Pérez",
                fecha: "2025-10-14",
                observaciones: "Formulario de ejemplo"
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Formulario creado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Submission created" },
                  tenant: { type: "string", example: "biomo" },
                  formKey: { type: "string", example: "1" },
                  data: { type: "object", description: "Datos del formulario creado" }
                }
              }
            }
          }
        },
        400: { description: "Datos inválidos" },
        401: { description: "No autorizado" },
        500: { description: "Error del servidor" }
      }
    }
  },
  "/api/{tenant}/forms/{formKey}": {
    get: {
      summary: "Obtener formularios de un tipo específico del usuario",
      tags: ["Formularios"],
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo"]
          },
          description: "Tenant del formulario"
        },
        {
          in: "path",
          name: "formKey",
          required: true,
          schema: {
            type: "string",
            enum: ["1", "2", "3", "4", "5", "6", "7", "formulario"]
          },
          description: "Tipo de formulario"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      responses: {
        200: {
          description: "Formularios obtenidos exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "User forms retrieved" },
                  tenant: { type: "string", example: "biomo" },
                  formKey: { type: "string", example: "1" },
                  userId: { type: "number", example: 123 },
                  data: {
                    type: "array",
                    items: { type: "object", description: "Datos del formulario" }
                  },
                  count: { type: "number", example: 5 }
                }
              }
            }
          }
        },
        401: { description: "No autorizado" },
        500: { description: "Error del servidor" }
      }
    }
  },
  "/api/{tenant}/forms": {
    get: {
      summary: "Obtener todos los formularios del usuario",
      tags: ["Formularios"],
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo"]
          },
          description: "Tenant del formulario"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      responses: {
        200: {
          description: "Todos los formularios obtenidos exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "All user forms retrieved" },
                  tenant: { type: "string", example: "biomo" },
                  userId: { type: "number", example: 123 },
                  data: {
                    type: "array",
                    items: { type: "object", description: "Datos del formulario" }
                  },
                  count: { type: "number", example: 15 }
                }
              }
            }
          }
        },
        401: { description: "No autorizado" },
        500: { description: "Error del servidor" }
      }
    }
  },
  "/api/{tenant}/forms/{formKey}/{formId}": {
    get: {
      summary: "Obtener formulario específico por ID",
      tags: ["Formularios"],
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo"]
          },
          description: "Tenant del formulario"
        },
        {
          in: "path",
          name: "formKey",
          required: true,
          schema: {
            type: "string",
            enum: ["1", "2", "3", "4", "5", "6", "7", "formulario"]
          },
          description: "Tipo de formulario"
        },
        {
          in: "path",
          name: "formId",
          required: true,
          schema: { type: "integer" },
          description: "ID del formulario"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      responses: {
        200: {
          description: "Formulario obtenido exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Form retrieved" },
                  tenant: { type: "string", example: "biomo" },
                  formKey: { type: "string", example: "1" },
                  data: { type: "object", description: "Datos del formulario" }
                }
              }
            }
          }
        },
        404: { description: "Formulario no encontrado" },
        401: { description: "No autorizado" },
        500: { description: "Error del servidor" }
      }
    },
    put: {
      summary: "Actualizar formulario específico",
      tags: ["Formularios"],
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo"]
          },
          description: "Tenant del formulario"
        },
        {
          in: "path",
          name: "formKey",
          required: true,
          schema: {
            type: "string",
            enum: ["1", "2", "3", "4", "5", "6", "7", "formulario"]
          },
          description: "Tipo de formulario"
        },
        {
          in: "path",
          name: "formId",
          required: true,
          schema: { type: "integer" },
          description: "ID del formulario"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              description: "Datos a actualizar",
              additionalProperties: true,
              example: {
                observaciones: "Formulario actualizado",
                fecha: "2025-10-15"
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Formulario actualizado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Form updated" },
                  tenant: { type: "string", example: "biomo" },
                  formKey: { type: "string", example: "1" },
                  data: { type: "object", description: "Datos actualizados del formulario" }
                }
              }
            }
          }
        },
        404: { description: "Formulario no encontrado" },
        400: { description: "Datos inválidos" },
        401: { description: "No autorizado" },
        500: { description: "Error del servidor" }
      }
    },
    delete: {
      summary: "Eliminar formulario específico",
      tags: ["Formularios"],
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo"]
          },
          description: "Tenant del formulario"
        },
        {
          in: "path",
          name: "formKey",
          required: true,
          schema: {
            type: "string",
            enum: ["1", "2", "3", "4", "5", "6", "7", "formulario"]
          },
          description: "Tipo de formulario"
        },
        {
          in: "path",
          name: "formId",
          required: true,
          schema: { type: "integer" },
          description: "ID del formulario"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      responses: {
        200: {
          description: "Formulario eliminado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Form deleted" },
                  tenant: { type: "string", example: "biomo" },
                  formKey: { type: "string", example: "1" },
                  formId: { type: "string", example: "123" }
                }
              }
            }
          }
        },
        404: { description: "Formulario no encontrado" },
        401: { description: "No autorizado" },
        500: { description: "Error del servidor" }
      }
    }
  },
  "/api/{tenant}/admin/users": {
    get: {
      summary: "Obtener lista completa de usuarios del tenant (solo para usuarios backend)",
      tags: ["Administración"],
      description: "Endpoint administrativo que permite a usuarios del tenant 'back' ver todos los usuarios de cualquier tenant con información completa (ID, username, email).",
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo", "back"]
          },
          description: "Identificador del tenant a consultar"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      responses: {
        200: {
          description: "Lista completa de usuarios obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Usuarios obtenidos exitosamente"
                  },
                  tenant: { type: "string", example: "biomo" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", example: 1 },
                        username: { type: "string", example: "enrique" },
                        user_email: { type: "string", format: "email", example: "enrique@example.com" }
                      }
                    }
                  },
                  count: { type: "integer", example: 5 }
                }
              }
            }
          }
        },
        401: { description: "Token inválido o ausente" },
        403: { description: "Acceso denegado - solo usuarios del tenant backend" },
        500: { description: "Error del servidor" }
      }
    }
    ,
    post: {
      summary: "Crear usuario en un tenant (solo para usuarios backend)",
      tags: ["Administración"],
      description: "Endpoint administrativo que permite a usuarios del tenant 'back' crear un nuevo usuario en el tenant objetivo.",
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo", "back"]
          },
          description: "Identificador del tenant donde se creará el usuario"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
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
      responses: {
        201: {
          description: "Usuario creado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "User created successfully" },
                  tenant: { type: "string", example: "biomo" },
                  user: { $ref: "#/components/schemas/User" }
                }
              }
            }
          }
        },
        400: { description: "Datos inválidos - faltan campos requeridos" },
        401: { description: "Token inválido o ausente" },
        403: { description: "Acceso denegado - solo usuarios del tenant backend" },
        409: { description: "Username ya existe" },
        500: { description: "Error del servidor" }
      }
    }
  },
  "/api/{tenant}/admin/users/forms": {
    get: {
      summary: "Obtener usuarios con conteo de formularios (solo para usuarios backend)",
      tags: ["Administración"],
      description: "Endpoint administrativo que permite a usuarios del tenant 'back' ver todos los usuarios de cualquier tenant junto con el número total de formularios que han creado.",
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo", "back"]
          },
          description: "Identificador del tenant a consultar"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      responses: {
        200: {
          description: "Usuarios con conteo de formularios obtenidos exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Usuarios con formularios obtenidos exitosamente"
                  },
                  tenant: { type: "string", example: "agromo" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", example: 1 },
                        username: { type: "string", example: "enrique" },
                        user_email: { type: "string", format: "email", example: "enrique@example.com" },
                        forms_count: { type: "integer", example: 3 }
                      }
                    }
                  },
                  count: { type: "integer", example: 5 }
                }
              }
            }
          }
        },
        401: { description: "Token inválido o ausente" },
        403: { description: "Acceso denegado - solo usuarios del tenant backend" },
        500: { description: "Error del servidor" }
      }
    }
  },
  "/api/{tenant}/admin/users/{userId}/forms": {
    get: {
      summary: "Obtener todos los formularios de un usuario específico (solo para usuarios backend)",
      tags: ["Administración"],
      description: "Endpoint administrativo que permite a usuarios del tenant 'back' ver todos los formularios creados por un usuario específico de cualquier tenant.",
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo", "back"]
          },
          description: "Identificador del tenant a consultar"
        },
        {
          in: "path",
          name: "userId",
          required: true,
          schema: { type: "integer" },
          description: "ID del usuario cuyos formularios se quieren consultar"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      responses: {
        200: {
          description: "Formularios del usuario obtenidos exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Formularios del usuario obtenidos exitosamente"
                  },
                  tenant: { type: "string", example: "biomo" },
                  userId: { type: "integer", example: 123 },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      description: "Datos del formulario (estructura dinámica según tenant y tipo)",
                      additionalProperties: true
                    }
                  },
                  count: { type: "integer", example: 2 }
                }
              }
            }
          }
        },
        401: { description: "Token inválido o ausente" },
        403: { description: "Acceso denegado - solo usuarios del tenant backend" },
        500: { description: "Error del servidor" }
      }
    }
  },
  "/api/{tenant}/admin/users/email/{email}": {
    get: {
      summary: "Obtener actividad y formularios de un usuario por email (solo para usuarios backend)",
      tags: ["Administración"],
      description: "Endpoint administrativo que permite a usuarios del tenant 'back' buscar un usuario por su email (o identificador) en cualquier tenant y obtener todos sus formularios.",
      parameters: [
        {
          in: "path",
          name: "tenant",
          required: true,
          schema: {
            type: "string",
            enum: ["agromo", "biomo", "robo", "back"]
          },
          description: "Identificador del tenant a consultar"
        },
        {
          in: "path",
          name: "email",
          required: true,
          schema: { type: "string", format: "email" },
          description: "Email o identificador del usuario a buscar"
        }
      ],
      security: [
        {
          bearerAuth: [],
          "Tenant API Key": []
        }
      ],
      responses: {
        200: {
          description: "Actividad del usuario obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Usuario y formularios obtenidos" },
                  tenant: { type: "string", example: "biomo" },
                  user: { $ref: "#/components/schemas/User" },
                  data: {
                    type: "array",
                    description: "Lista de formularios agrupados por tipo/tabla",
                    items: { type: "object", additionalProperties: true }
                  },
                  count: { type: "integer", example: 7 }
                }
              }
            }
          }
        },
        404: { description: "Usuario no encontrado" },
        401: { description: "Token inválido o ausente" },
        403: { description: "Acceso denegado - solo usuarios del tenant backend" },
        500: { description: "Error del servidor" }
      }
    }
  },
};

/* ---------------------- Normalización de URL del servidor ------------------------ */

// Valores deseados de ejemplo:
//   SWAGGER_SERVER_URL = "https://api.ecoranger.org"
//   Valor por defecto local = "http://localhost:3000"
const rawBase =
  "https://ekgcss8ww8o4ok480g08soo4.91.98.193.75.sslip.io"; // Production URL

// Normalizar: quitar barras finales
const trimmed = rawBase.replace(/\/+$/, "");
const API_BASE = trimmed; // NO añadimos "/api"

/* ----------------------------- Configuración de Swagger ---------------------------- */

const options: any = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Autenticación y Formularios",
      version: "1.0.0",
      description:
        "Documentación de la API de autenticación y formularios con Node.js, Express, Passport y JWT.",
    },
    tags: [
      {
        name: "Autenticación",
        description: "Endpoints para autenticación de usuarios",
      },
      {
        name: "Formularios",
        description: "Endpoints para gestión de formularios",
      },
      {
        name: "Administración",
        description: "Endpoints administrativos para gestión de usuarios y formularios (solo para usuarios backend)",
      },
    ],
    // Keep servers list minimal & de-duped to avoid UI confusion.
    servers: [
      { url: API_BASE, description: "Production Server" },
      { url: "http://localhost:3000", description: "Local Development" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        "Tenant API Key": {
          type: "apiKey",
          in: "header",
          name: "apikey",
          description: 'Tenant API key header (e.g. "robo-key-789")',
        },
      },
      schemas: {
        RegisterCredentials: {
          type: "object",
          required: ["username", "password", "user_email"],
          properties: {
            username: { type: "string", example: "enrique" },
            password: { type: "string", example: "ilovemessi3520" },
            user_email: { type: "string", format: "email", example: "enrique@example.com" },
          },
        },
        LoginCredentials: {
          type: "object",
          required: ["user_email", "password"],
          properties: {
            user_email: { type: "string", format: "email", example: "enrique@example.com" },
            password: { type: "string", example: "ilovemessi3520" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Inicio de sesión exitoso." },
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..." },
            token_type: { type: "string", example: "Bearer" },
            expires_in: { type: "string", example: "7d" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
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
        FormSubmission: {
          type: "object",
          description: "Dynamic form submission payload",
          additionalProperties: true,
          example: {
            field1: "value1",
            field2: 123,
            field3: true
          },
        },
      },
    },
    security: [{ "Tenant API Key": [] }],
  },
  apis: [], // filled below
};

/* ------------------------- Patrones de archivos fuente ---------------------------- */

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
options.apis = tsGlobs.concat(jsGlobs);

/* --------------------------- Construir y exportar ----------------------------- */

const specs: any = swaggerJsdoc(options);
specs.paths = { ...(specs.paths || {}), ...extraPaths };

export default specs;
