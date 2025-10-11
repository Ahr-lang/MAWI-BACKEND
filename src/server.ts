// src/server.ts
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger';
import passport from './services/auth.service';
import userRoutes from './api/routes/user.routes';
import { connectDB } from './db/index';

const app = express();
const PORT = Number(process.env.PORT || 3000);

/* -------------------------------------------------------------------------- */
/*                              TRUST REVERSE PROXY                           */
/* -------------------------------------------------------------------------- */
// Necesario cuando estás detrás de Traefik/Coolify o un proxy que maneja HTTPS.
// Esto asegura que `req.secure` y las URLs en Swagger se detecten correctamente.
app.set('trust proxy', 1);

/* -------------------------------------------------------------------------- */
/*                                MAIN SERVER                                 */
/* -------------------------------------------------------------------------- */
async function startServer() {
  try {
    await connectDB();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());

    /* ----------------------------- API ROUTES ----------------------------- */
    app.use('/api', userRoutes);

    /* ----------------------------- SWAGGER DOCS --------------------------- */
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.get('/api-docs.json', (_req: Request, res: Response) => res.json(specs));
    app.get('/swagger.json', (_req: Request, res: Response) => res.json(specs));

    /* ------------------------------ HEALTHCHECK --------------------------- */
    app.get('/healthz', (_req, res) => res.json({ ok: true }));

    /* ----------------------------- 404 HANDLER ---------------------------- */
    app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

    /* ----------------------------- START SERVER --------------------------- */
    app.listen(PORT, '0.0.0.0', () => {
      // Usamos la URL configurada o una local por defecto
      const base =
        process.env.SWAGGER_SERVER_URL?.replace(/\/+$/, '') ||
        `http://localhost:${PORT}/api`;
      const ui = base.replace(/\/api$/, '') + '/api-docs';

      console.log('───────────────────────────────────────────────');
      console.log(`✅ Auth API escuchando en el puerto ${PORT}`);
      console.log(`🌐 Base URL: ${base}`);
      console.log(`📘 Swagger UI: ${ui}`);
      console.log('───────────────────────────────────────────────');
    });
  } catch (err: any) {
    console.error('❌ Error starting server:', err.message);
    process.exit(1);
  }
}

startServer();
