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

// If you're behind a proxy (Coolify/Traefik), let Express trust X-Forwarded-* so urls are correct
app.set('trust proxy', 1);

async function startServer() {
  try {
    await connectDB();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(passport.initialize());

    app.use('/api', userRoutes);

    // Swagger UI + raw specs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.get('/api-docs.json', (_req: Request, res: Response) => res.json(specs));
    app.get('/swagger.json', (_req: Request, res: Response) => res.json(specs));

    // Simple health check
    app.get('/healthz', (_req, res) => res.json({ ok: true }));

    app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

    // IMPORTANT: bind to 0.0.0.0 so it’s reachable from the proxy
    app.listen(PORT, '0.0.0.0', () => {
      const serverUrl = process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}/api`;
      const uiUrl = (serverUrl.replace(/\/api$/, '')) + '/api-docs';
      console.log(`Auth API running. Base: ${serverUrl} | Swagger UI: ${uiUrl}`);
    });
  } catch (err: any) {
    console.error('Error starting server:', err.message);
    process.exit(1);
  }
}

startServer();
