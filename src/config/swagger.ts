// config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";


// Put this near the top of swagger.ts, before you call swaggerJSDoc(...)
const extraPaths = {
  "/api/{tenant}/users/register": {
    post: {
      tags: ["Auth"],
      summary: "Registrar un nuevo usuario",
      parameters: [{
        in: "path", name: "tenant", required: true,
        schema: { type: "string", enum: ["agromo","biomo","robo","back"] }
      }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterCredentials" } } }
      },
      security: [{ "Tenant API Key": [] }],
      responses: {
        201: { description: "Usuario registrado exitosamente.",
          content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
        409: { description: "El nombre de usuario ya existe." }
      }
    }
  },
  "/api/{tenant}/users/login": {
    post: {
      tags: ["Auth"],
      summary: "Iniciar sesión y obtener un token JWT",
      parameters: [{
        in: "path", name: "tenant", required: true,
        schema: { type: "string", enum: ["agromo","biomo","robo","back"] }
      }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/LoginCredentials" } } }
      },
      security: [{ "Tenant API Key": [] }],
      responses: {
        200: { description: "Inicio de sesión exitoso (token devuelto)",
          content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
        401: { description: "Credenciales inválidas" }
      }
    }
  },
  "/api/{tenant}/users/me": {
    get: {
      tags: ["Auth"], summary: "Obtener información del usuario autenticado",
      parameters: [{
        in: "path", name: "tenant", required: true,
        schema: { type: "string", enum: ["agromo","biomo","robo","back"] }
      }],
      security: [{ "Tenant API Key": [] }, { bearerAuth: [] }],
      responses: {
        200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
        401: { description: "Token inválido o ausente." }
      }
    }
  },
  "/api/{tenant}/users/logout": {
    post: {
      tags: ["Auth"], summary: "Cerrar sesión (stateless)",
      parameters: [{
        in: "path", name: "tenant", required: true,
        schema: { type: "string", enum: ["agromo","biomo","robo","back"] }
      }],
      security: [{ "Tenant API Key": [] }, { bearerAuth: [] }],
      responses: { 200: { description: "Mensaje de cierre de sesión" } }
    }
  }
};

const API_BASE =
  process.env.SWAGGER_SERVER_URL               // e.g. "https://api.ecoranger.org/api"
  || "http://localhost:3000/api";              // sane default for local dev

const options: any = {
  definition: {
    openapi: "3.0.0",
    info: { title: "API de Autenticación", version: "1.0.0",
      description: "Documentación de la API de autenticación con Node.js, Express, Passport y JWT."
    },
    servers: [
      { url: API_BASE, description: "Configured base (SWAGGER_SERVER_URL or local default)" },
      { url: "https://api.ecoranger.org/api", description: "Production" },
      { url: "http://localhost:3000/api", description: "Local" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        "Tenant API Key": { type: "apiKey", in: "header", name: "apikey",
          description: 'Tenant API key header (e.g. "robo-key-789")' }
      },
    },
    security: [{ "Tenant API Key": [] }],
  },
  apis: [], // filled below
};

// … keep your extraPaths and globs exactly as you have …

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

const specs: any = swaggerJsdoc(options);
specs.paths = { ...(specs.paths || {}), ...extraPaths };

export default specs;
