// Importamos swagger-jsdoc para generar la documentación Swagger
const swaggerJsdoc = require("swagger-jsdoc");

// Definimos las opciones de configuración para Swagger
const options = {
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
    servers: [
      {
        // URL del servidor de desarrollo
        url: "http://localhost:3000/api",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        // Esquema de seguridad para autenticación Bearer (JWT)
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Esquema para credenciales de usuario (login/register)
        UserCredentials: {
          type: "object",
          required: ["username", "password"], // Campos obligatorios
          properties: {
            username: { type: "string", example: "enrique" },
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
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                username: { type: "string", example: "enrique" },
                tenant: { type: "string", example: "a" },
              },
            },
          },
        },
      },
    },
  },
  // Archivos donde buscar anotaciones Swagger (rutas, controladores, docs)
  apis: ["../api/routes/*.js", "../api/controllers/*.js", "../api/docs/*.js"],
};

// Generamos las especificaciones Swagger
const specs = swaggerJsdoc(options);
// Exportamos las especificaciones
module.exports = specs;
