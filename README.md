# 🌱 MAWI Backend – AWAQ Biotech

Este repositorio contiene el backend del sistema **MAWI**, parte del proyecto **AWAQ Biotech**, cuyo propósito es centralizar la recolección de datos ambientales y agrícolas desde múltiples aplicaciones y un robot de campo, procesarlos y exponerlos para análisis con modelos de Inteligencia Artificial (IA).  

---

## 📌 Objetivo del Proyecto

- Recibir datos de **apps móviles** (BIOMO y AGROMO) y del **robot ROBORANGER**.  
- Procesar, validar y almacenar información (incluyendo imágenes y ubicaciones).  
- Exponer datos procesados como **bundles para IA**.  
- Proveer una **app de administración** para gestión de usuarios y monitoreo del sistema.  
- Garantizar **seguridad, escalabilidad y disponibilidad** desde la nube (Azure/AWS).  

---

## 🏛️ Arquitectura General

El sistema está organizado en **capas**:

### 🔹 Capa de Presentación
- **BIOMO (App Campo):** captura datos ambientales.  
- **AGROMO (App Campo):** captura datos agrícolas.  
- **ROBORANGER (Robot):** envía fotos y observaciones desde campo.  
- **Frontend Admin (App Gestión):** monitoreo, gestión de usuarios y datos.  

### 🔹 Capa de Aplicación
- **API Gateway / Ingress:** controla acceso, autenticación, rate limits y WAF.  
- **Servicios Backend:** ingesta de datos, gestión de usuarios, observaciones, proyectos, media y sincronización.  
- **Generador de Bundles IA (ETL Batch):** prepara datasets listos para modelos de IA.  

### 🔹 Capa de Datos
- **PostgreSQL:** base de datos centralizada.  
- **Blob Storage:** almacenamiento de imágenes y media.  
- **Redis (Cache):** consultas rápidas y almacenamiento temporal.  
- **Service Bus/Queue:** manejo de eventos y mensajes asincrónicos.  

### 🔹 Capa de Infraestructura
- **Azure/AWS:** nube donde vive el sistema.  
- **IaC:** infraestructura como código (Bicep/Kubernetes).  
- **CI/CD:** pipelines de integración y despliegue.  
- **Key Vault:** gestión de secretos.  
- **Monitor:** observabilidad, métricas y alertas.  

---

## 🔄 Flujo de Datos

1. **Captura**: BIOMO, AGROMO y ROBORANGER envían datos → API Gateway.  
2. **Procesamiento**: Backend valida, transforma y almacena.  
3. **Persistencia**:  
   - Datos estructurados → PostgreSQL.  
   - Imágenes → Blob Storage.  
   - Eventos → Cola/Mensajería.  
   - Datos temporales → Redis.  
4. **Bundles IA**: servicio ETL empaqueta datos para consumo de modelos de IA.  
5. **Administración**: Frontend Admin consulta el backend para gestión y monitoreo.  

---

## 📂 Estructura del Proyecto

backend/
│── package.json # Dependencias y scripts
│── tsconfig.json # Configuración de TypeScript
│── .env.example # Variables de entorno
│── README.md # Documentación general
│── Makefile # Atajos de comandos
│
├── docs/ # Documentación técnica
│ ├── architecture/ # Diagramas (C4, ADRs)
│ ├── operations/ # Runbooks, SRE, oncall
│ └── product/ # Versionado y changelog
│
├── ops/ # Infraestructura y despliegue
│ ├── docker/ # Dockerfile y docker-compose
│ ├── azure/ # Bicep + pipelines CI/CD
│ └── k8s/ # Manifiestos Kubernetes
│
├── src/ # Código fuente
│ ├── api/ # Routers y middlewares
│ ├── config/ # Configuración de entorno
│ ├── contracts/ # OpenAPI y ejemplos
│ ├── db/ # Cliente DB y migraciones
│ ├── libs/ # Utilidades comunes (logger, http, seguridad)
│ └── modules/ # Lógica de negocio
│ ├── users/ # Usuarios
│ ├── observations/# Observaciones
│ └── projects/ # Proyectos
│
└── tests/ # Pruebas
├── unit/ # Unitarias
├── integration/ # Integración
└── contract/ # Contractuales

markdown
Copiar código

---

## ✅ Pruebas

El sistema incluye dos enfoques:

- **Pruebas Manuales**  
  - Validación de criterios de aceptación en cada Historia de Usuario.  
  - Escenarios escritos en **Gherkin** (Given/When/Then).  
  - Validación visual de mockups con el socio formador.  

- **Pruebas Automáticas**  
  - **Unitarias:** validación de funciones críticas.  
  - **Integración:** comunicación entre backend y DB.  
  - **E2E:** flujo completo desde apps hasta persistencia.  
  - **Contractuales:** validación contra OpenAPI.  
  - **Negativas:** errores comunes (sin conexión, datos inválidos).  

---

## 🚀 Flujo de Desarrollo

1. Definir/actualizar contrato en `src/contracts/openapi/v1.yaml`.  
2. Implementar router + controlador + servicio + repositorio.  
3. Crear pruebas unitarias e integración en `tests/`.  
4. Validar contrato con **Redocly** y ejecutar CI/CD.  
5. Desplegar a staging (Docker/K8s).  
6. Promover a producción solo si pasa el pipeline.  

---

## 📊 Estado del Backlog

El backlog está organizado en **épicas e historias de usuario**:  

- **Épica 1:** Gestión de Usuarios y Autenticación.  
- **Épica 2:** Monitoreo y Observabilidad del Sistema.  
- **Épica 3:** Datos Ambientales y Agrícolas.  
- **Épica 4:** Integración y Finalización de Módulos.  
- **Épica 5:** Calidad y Pruebas.  

Cada HU cuenta con criterios de aceptación, escenarios Gherkin y su plan de pruebas asociado.  

---

## 👥 Equipo Backend

- **Tech Lead**: dirección técnica, arquitectura y coordinación.  
- **Backend Dev A**: endpoints y lógica de negocio.  
- **Backend Dev B**: modelado de datos y queries.  
- **QA Automation**: estrategia de pruebas y automatización.  
- **DevOps**: infraestructura, CI/CD y observabilidad en Azure.  

---

## 📖 Licencia

Este proyecto es parte del reto académico **TC2007B – Integración de Soluciones d