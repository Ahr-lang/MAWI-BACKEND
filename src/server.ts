import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

import './telemetry/tracing';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger';
import passport from './services/auth.service';
import userRoutes from './api/routes/user.routes';
import formRoutes from './api/routes/form.routes';
import { connectDB } from './db/index';
import { attachTraceIds, deprecatedRoute } from './api/middlewares/otelContext';

const app = express();
const PORT = Number(process.env.PORT || 3000);

/* -------------------------------------------------------------------------- */
/*                              TRUST REVERSE PROXY                           */
/* -------------------------------------------------------------------------- */
app.set('trust proxy', 1);

/* -------------------------------------------------------------------------- */
/*                                MAIN SERVER                                 */
/* -------------------------------------------------------------------------- */
async function startServer() {
  try {
    await connectDB();

    /* ----------------------------- MIDDLEWARES ---------------------------- */
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());

    // 🟣 Inserta el middleware de OpenTelemetry (añade traceId/spanId)
    app.use(attachTraceIds);

    /* ----------------------------- API ROUTES ----------------------------- */
    app.use('/api', userRoutes);
    app.use('/api', formRoutes);

    // 🟣 Ejemplo de endpoint obsoleto (CA4)
    app.all('/api/v1/old-auth', deprecatedRoute('Use /api/v2/auth instead'));

    /* ----------------------------- SWAGGER DOCS --------------------------- */
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.get('/api-docs.json', (_req: Request, res: Response) => res.json(specs));
    app.get('/swagger.json', (_req: Request, res: Response) => res.json(specs));

    /* ------------------------------ HEALTHCHECK --------------------------- */
    app.get('/healthz', (_req, res) => res.json({ ok: true }));

    /* ----------------------------- 404 HANDLER ---------------------------- */
    app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

    /* ----------------------------- ERROR HANDLER -------------------------- */
    app.use(
      (err: any, req: Request, res: Response, _next: NextFunction) => {
        const status = err?.status || 500;
        const message = err?.message || 'Internal Server Error';

        res.status(status).json({
          error: { code: status, message },
          traceId: req.traceId || null,
        });
      }
    );

    /* ----------------------------- START SERVER --------------------------- */
    app.listen(PORT, '0.0.0.0', () => {
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
