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
import adminRoutes from './api/routes/admin.routes';
import adminActivityRoutes from './api/routes/admin.activity.routes';
import { connectDB } from './db/index';
import { attachTraceIds, deprecatedRoute } from './api/middlewares/otelContext';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

const app = express();
const PORT = Number(process.env.PORT || 3000);

/* -------------------------------------------------------------------------- */
/*                              PROMETHEUS METRICS                           */
/* -------------------------------------------------------------------------- */

// Custom metrics
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const formSubmissions = new Counter({
  name: 'form_submissions_total',
  help: 'Total number of form submissions',
  labelNames: ['form_type', 'tenant'],
});

const userRegistrations = new Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations',
});

const loginAttempts = new Counter({
  name: 'login_attempts_total',
  help: 'Total number of login attempts',
  labelNames: ['success'],
});

const onlineUsers = new Gauge({
  name: 'online_users_current',
  help: 'Current number of online users',
});

const userSessions = new Counter({
  name: 'user_sessions_total',
  help: 'Total number of user sessions',
  labelNames: ['action'], // 'login', 'logout'
});

// Export metrics for use in other modules
export { formSubmissions, userRegistrations, loginAttempts, onlineUsers, userSessions };

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
    // Collect default metrics (CPU, memory, etc.)
    collectDefaultMetrics();

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
