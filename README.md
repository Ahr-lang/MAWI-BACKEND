# MAWI-BACKEND

Backend de autenticación- **pg**: Cliente PostgreSQL.

## Estructura de Carpetas y Archivosstruido con Node.js, Express, Sequelize (ORM), Passport y JWT. Soporta 4 tenants (agromo, biomo, robo, back) con bases de datos PostgreSQL separadas

## Arquitectura por Capas (Tiers)

El proyecto sigue una arquitectura en capas para separar responsabilidades y facilitar mantenimiento y escalabilidad:

### 1) Presentación / API (HTTP)

- **`src/api/routes/`**: Define endpoints y métodos HTTP; no contiene lógica de negocio.
- **`src/api/controllers/`**: Maneja requests/responses HTTP (status, params, body) y llama a servicios.
- **`src/api/middlewares/`**: Funcionalidades transversales (auth, validación, tenant, errores, logging).
- **`src/api/docs/`**: Documentación Swagger/OpenAPI generada o helpers para docs.

### 2) Aplicación / Negocio (Services)

- **`src/services/`**: Contiene reglas de negocio y orquestación de casos de uso; NO queries directas a DB. Si algún dominio crece, puedes crear subcarpetas por dominio dentro de services/.

### 3) Datos / Persistencia

- **`src/db/repositories/`**: Acceso a datos por dominio (consultas, inserts, updates). Subcarpetas por tenant: `agromo/`, `back/`, `biomo/`, `robo/` → cada una expone funciones como `findById`, `create`, etc. para lógica específica si es necesaria.
- **`src/db/models/`**: Modelos/esquemas si usas ORM (Sequelize/Prisma/Mongoose).
- **`src/db/migrations/`**: Scripts versionados para crear/alterar tablas en DB.
- **`src/db/seeders/`**: Datos iniciales o de prueba para poblar DBs.

### 4) Configuración e Infra

- **`src/config/`**: Configuraciones del sistema (env, swagger, constants).
- **`docker/`**: Imágenes y configuraciones Docker (infra local).

### Flujo de una Request

route → llama a controller → llama a service → usa repository → DB → regresa respuesta.

### Reglas Rápidas por Capa

- **Routes**: Solo URLs y wiring → nada de lógica.
- **Controllers**: HTTP puro (status/headers/body parsing).
- **Services**: Lógica de negocio, validaciones de caso de uso.
- **Repositories**: Solo SQL/ORM; sin reglas de negocio.
- **Models**: Esquemas/definiciones de DB.
- **Middlewares**: Auth, validación, logging, errores; reutilizables.

### Tecnologías

- **Node.js + Express**: Servidor web.
- **Sequelize**: ORM para PostgreSQL.
- **Passport + JWT**: Autenticación.
- **Swagger**: Documentación de API.
- **pg**: Cliente PostgreSQL.

## Estructura de Carpetas y Archivos

### Raíz del Proyecto

- **`package.json`**: Dependencias, scripts y metadata del proyecto.
- **`server.js`**: Punto de entrada. Configura Express, middlewares, rutas y servidor.
- **`docker-compose.yml`**: Configuración para Docker (contenedores para app y DBs).
- **`Dockerfile`**: Imagen Docker para la app (usa Node.js Alpine).
- **`.env`**: Variables de entorno (DB creds, JWT secret, etc.). **No commitear en Git**.
- **`docker/`**: Carpeta para configuraciones Docker adicionales (infra local).
- **`README.md`**: Este archivo.

### `src/` (Código Fuente)

Carpeta principal del código.

#### `src/db/` (Base de Datos)

Maneja conexiones, modelos y acceso a datos.

- **`index.js`**: Configura pools de PostgreSQL y instancias de Sequelize por tenant. Exporta `getPool()`, `getSequelize()`, `connectDB()`.
- **`models/`**: Modelos de Sequelize.
  - **`user.model.js`**: Modelo para tabla `users` (id, username, password_hash, lastActiveAt, createdAt, updatedAt).
- **`repositories/`**: Capa de acceso a datos.
  - **`user.repository.js`**: Queries compartidas para usuarios (find, create, authenticate).
  - **`agromo/`**: Repositorios específicos para tenant "agromo" (vacío por ahora).
  - **`back/`**: Repositorios específicos para tenant "back" (vacío por ahora).
  - **`biomo/`**: Repositorios específicos para tenant "biomo" (vacío por ahora).
  - **`robo/`**: Repositorios específicos para tenant "robo" (vacío por ahora).
- **`migrations/`**: Scripts para migrar esquemas de DB (vacío por ahora).
- **`seeders/`**: Datos iniciales para DB (vacío por ahora).

#### `src/services/` (Lógica de Negocio)

Servicios reutilizables.

- **`auth.service.js`**: Configura Passport (estrategias local y JWT). Firma tokens JWT.
- **`user.service.js`**: Lógica para registro de usuarios (validaciones, hashing).

#### `src/api/` (API REST)

Endpoints y lógica HTTP.

- **`controllers/`**: Controladores para requests.
  - **`user.controller.js`**: Maneja registro, login, logout, perfil de usuario.
- **`middlewares/`**: Middlewares Express.
  - **`tenant.js`**: Asigna DB/Sequelize basado en `:tenant`.
- **`routes/`**: Definición de rutas.
  - **`user.routes.js`**: Rutas para usuarios (register, login, etc.) con middleware de tenant.
- **`docs/`**: Documentación Swagger.
  - **`user.docs.js`**: Anotaciones Swagger para endpoints de usuario.

#### `src/config/` (Configuraciones)

- **`swagger.js`**: Configura Swagger UI y esquemas de API.

### `tests/` (Pruebas)

Carpeta para tests unitarios/integración (vacío por ahora).

### `ops/` (Operaciones)

Herramientas de deployment/ops (vacío).

### `docs/` (Documentación)

Documentos adicionales (vacío).

## Divisiones y Parametrizaciones

### Por Capas (Separation of Concerns)

- **Controladores**: Solo HTTP (parseo, respuestas). No tocan DB.
- **Servicios**: Lógica de negocio (validaciones, reglas). Llaman repositorios.
- **Repositorios**: Solo queries. Reciben `sequelize` para multi-tenancy.
- **Modelos**: Esquemas de DB. Definidos por tenant vía `defineUserModel()`.

### Multi-Tenancy

- **Parametrización**: Cada request incluye `:tenant` (a/b/c/d).
- **Asignación**: `useTenant` middleware setea `req.db` y `req.sequelize`.
- **Aislamiento**: Cada tenant tiene pool/Sequelize separado. Datos no se mezclan.
- **Escalabilidad**: Agregar tenant = nueva DB + entry en `TENANTS`.

### Autenticación

- **JWT**: Tokens firmados con `JWT_SECRET`. Expiran en `JWT_EXPIRES_IN`.
- **Passport**: Estrategia local para login, JWT para rutas protegidas.
- **Tenant en Token**: Payload incluye `tenant` para verificar consistencia.

### ORM (Sequelize)

- **Modelos**: Auto-mapean a tablas. `timestamps: true` añade `createdAt`/`updatedAt`.
- **Queries**: En repositorios (e.g., `User.findByPk()` en lugar de SQL crudo).
- **Validaciones**: En modelos (unique, allowNull) y servicios (lógica custom).

## Cómo Ejecutar

1. **Instalar dependencias**: `npm install`.
2. **Configurar .env**: Copiar `.env.example` y llenar DB creds/JWT.
3. **DB Setup**: Asegurar DBs PostgreSQL existen (agromo, biomo, etc.).
4. **Ejecutar**: `npm run dev` (desarrollo) o `npm start` (producción).
5. **API Docs**: En desarrollo: `http://localhost:3000/api-docs`. En producción: `https://api.ecoranger.org/api-docs`.

## Endpoints Principales

- `POST /api/:tenant/users/register`: Registrar usuario.
- `POST /api/:tenant/users/login`: Login y obtener JWT.
- `GET /api/:tenant/users/me`: Perfil (requiere Bearer token).
- `POST /api/:tenant/users/logout`: Logout.

## Notas

- **Seguridad**: Usa bcrypt para passwords, SSL para DB.
- **Escalabilidad**: Arquitectura modular para agregar features (e.g., más modelos/repos).
- **Futuro**: Carpetas vacías en `repositories/` para lógica específica por tenant.

Para preguntas, contactar al equipo.
