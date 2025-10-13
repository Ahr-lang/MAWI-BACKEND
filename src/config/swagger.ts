// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

/* ----------------------------- Rutas (fijas) ----------------------------- */

const extraPaths = {
};

/* ---------------------- Normalización de URL del servidor ------------------------ */

// Valores deseados de ejemplo:
//   SWAGGER_SERVER_URL = "https://api.ecoranger.org"
//   Valor por defecto local = "http://localhost:3000"
const rawBase =
  "http://localhost:3000"; // Force localhost for development

// Normalizar: quitar barras finales
const trimmed = rawBase.replace(/\/+$/, "");
const API_BASE = trimmed; // NO añadimos "/api"

/* ----------------------------- Configuración de Swagger ---------------------------- */

const options: any = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Autenticación",
      version: "1.0.0",
      description:
        "Documentación de la API de autenticación con Node.js, Express, Passport y JWT.",
    },
    // Keep servers list minimal & de-duped to avoid UI confusion.
    servers: [
      { url: API_BASE, description: "Configured base" },
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
