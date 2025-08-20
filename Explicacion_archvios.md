# Guía de estructura del proyecto Backend AWAQ

Este documento explica **qué contiene y para qué sirve cada carpeta y archivo** del proyecto.

---

## 📂 Raíz del proyecto

- **`package.json`**  
  Metadatos del proyecto Node.js y scripts de npm.  
  - `dev`: arranca el servidor en modo desarrollo.  
  - `build`: compila TypeScript a `dist/`.  
  - `start`: ejecuta `dist/server.js` en producción.  
  - `lint`, `test`: tareas de calidad y pruebas.  
  - Define dependencias y versiones.

- **`tsconfig.json`**  
  Configuración de TypeScript: entrada/salida, target de JS, modo estricto.

- **`.env.example`**  
  Plantilla de variables de entorno. Copiar a `.env` y completar credenciales (ej. `DATABASE_URL`).

- **`README.md`**  
  Instrucciones rápidas: instalación, endpoints base, cómo correr en dev.

- **`Makefile`**  
  Atajos de terminal (si se usa `make`): `make run`, `make build`, `make test`.

---

## 📂 `docs/` — Documentación

- **`docs/architecture/`**  
  - `c4-context.md`: diagrama de contexto (qué actores externos consumen la API).  
  - `c4-container.md`: diagrama de contenedores (backend, DB, apps clientes).  
  - `adrs/`: registros de decisiones de arquitectura.

- **`docs/operations/`**  
  - `oncall.md`: políticas de guardias/escalamiento.  
  - `sre-checklist.md`: verificación antes de release.  
  - `runbooks/`: guías paso a paso para incidentes.

- **`docs/product/`**  
  - `api-changelog.md`: registro de cambios de la API.  
  - `versioning-policy.md`: reglas de versionado y deprecación.

---

## 📂 `ops/` — Operación e infraestructura

- **`ops/docker/`**  
  - `Dockerfile`: imagen de la API en Node.  
  - `docker-compose.yml`: stack local (API + DB).

- **`ops/azure/`**  
  - `bicep/`: Infraestructura como código para Azure.  
  - `pipelines/ci_cd.yml`: pipeline CI/CD (build, test, deploy).

- **`ops/k8s/`**  
  - `base/`: manifiestos genéricos (Deployment, Service, HPA).  
  - `overlays/`: ajustes por entorno (`dev`, `staging`, `prod`).

---

## 📂 `src/` — Código fuente

### Entrada principal

- **`server.ts`**  
  Configura middlewares globales, endpoint `/health`, rutas `/api/v1` y el manejador de errores.

### API

- **`src/api/v1/`**  
  Routers para la **API v1**.  
  - `index.ts`: compone el `routerV1`.  
  - `common.router.ts`: rutas comunes (ej. `/ping`).  
  - `abt.router.ts`, `agromo.router.ts`, `robot.router.ts`: routers segmentados por apps clientes.

- **`src/api/middlewares/`**  
  - `error.middleware.ts`: middleware de manejo de errores centralizado.

### Configuración

- **`src/config/env.ts`**  
  Carga y valida variables de entorno.

### Contratos

- **`src/contracts/`**  
  - `openapi/v1.yaml`: especificación OpenAPI de la API.  
  - `examples/`: ejemplos de requests/responses.

### Base de datos

- **`src/db/`**  
  - `index.ts`: cliente/pool de la base de datos.  
  - `migrations/`: scripts de migración de esquema.

### Librerías comunes

- **`src/libs/`**  
  - `logger.ts`: logger estructurado.  
  - `http.ts`: cliente HTTP con retries/timeouts.  
  - `security.ts`: utilidades de seguridad (hash, tokens).

### Módulos de dominio

Cada módulo encapsula **Controller, Service, Repository y Model**:

- **`controller`**: maneja HTTP y llama al servicio.  
- **`service`**: contiene la lógica de negocio.  
- **`repository`**: acceso a la base de datos.  
- **`model`**: esquema de datos o definición de entidad.

Módulos actuales:

- **`users/`** → gestión de usuarios.  
- **`observations/`** → observaciones de bosque.  
- **`projects/`** → proyectos y parcelas.

---

## 📂 `tests/` — Pruebas

- **`unit/`**  
  Pruebas unitarias de servicios y librerías.

- **`integration/`**  
  Pruebas de integración: API real + DB.

- **`contract/`**  
  Pruebas contractuales contra OpenAPI y ejemplos.

---

## 🔄 Flujo recomendado de desarrollo

1. Definir/actualizar contrato en `src/contracts/openapi/v1.yaml`.  
2. Implementar router en `src/api/v1` y controlador/servicio/repositorio en `src/modules`.  
3. Agregar pruebas unitarias e integración.  
4. Validar contrato y ejecutar pruebas.  
5. Hacer build y correr con Docker Compose.  
6. Merge a la rama principal solo si todo pasa en CI/CD.

---
