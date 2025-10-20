import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

import './telemetry/tracing';
import { httpRequestDuration, formSubmissions, userRegistrations, loginAttempts, onlineUsers, userSessions, initializeMetrics, register } from './telemetry/metrics';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger';
import passport from './services/auth.service';
import userRoutes from './api/routes/user.routes';
import formRoutes from './api/routes/form.routes';
import adminRoutes from './api/routes/admin.routes';
import adminActivityRoutes from './api/routes/admin.activity.routes';
import metricsRoutes from './api/routes/metrics.routes';
import { connectDB } from './db/index';
import { attachTraceIds, deprecatedRoute } from './api/middlewares/otelContext';
import { MetricsUpdaterService } from './services/metrics.service';

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

    // Start periodic metrics updates for gauge metrics
    // MetricsUpdaterService.startPeriodicUpdates(); // Temporarily disabled due to missing tables

    /* ----------------------------- MIDDLEWARES ---------------------------- */
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());

    // 🟣 Inserta el middleware de OpenTelemetry (añade traceId/spanId)
    app.use(attachTraceIds);

    // 🟣 HTTP Request Metrics Middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = (req.route?.path || req.path).replace(/\/:[^/]+/g, '/:param');
        httpRequestDuration
          .labels(req.method, route, res.statusCode.toString())
          .observe(duration);
      });
      next();
    });

    /* ----------------------------- PROMETHEUS METRICS ----------------------------- */
    // Initialize metrics collection (CPU, memory, etc.)
    initializeMetrics();

    // Start periodic updates for gauge metrics (forms per tenant)
    // Note: This will be initialized after DB connection below

    // Expose metrics endpoint
    app.get('/metrics', async (_req: Request, res: Response) => {
      try {
        const metrics = await register.metrics();
        res.set('Content-Type', register.contentType);
        res.end(metrics);
      } catch (ex) {
        res.status(500).end(ex);
      }
    });

    /* ----------------------------- API ROUTES ----------------------------- */
    app.use('/api', userRoutes);
    app.use('/api', formRoutes);
    app.use('/api', adminRoutes);
  app.use('/api', adminActivityRoutes);
  app.use('/api', metricsRoutes);

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
        `http://localhost:${PORT}`;
      const ui = base + '/api-docs';

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
