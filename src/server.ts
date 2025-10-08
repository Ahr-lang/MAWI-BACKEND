import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });
console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET);

import './shared/tracing'; // Initialize OpenTelemetry

import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger';
import passport from './services/auth.service';
import userRoutes from './api/routes/user.routes';
import healthRoutes from './routes/health.routes';
import adminRoutes from './routes/admin.routes';
import apiRoutes from './routes/api.routes';
import { connectDB } from './db/index';

const app = express();
const PORT: string | number = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(passport.initialize());

    app.use('/', healthRoutes);
    app.use('/admin', adminRoutes);
    app.use('/api/v1', apiRoutes);
    app.use('/api', userRoutes);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Expose the raw OpenAPI spec JSON so remote users can inspect it directly
  app.get('/api-docs.json', (_req: Request, res: Response) => res.json(specs));
  app.get('/swagger.json', (_req: Request, res: Response) => res.json(specs));

    app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Not found' }));

    app.listen(PORT, () => {
      const base = process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}`;
      console.log(`Auth API running on ${base}`);
    });
  } catch (error) {
    console.error('Error starting server:', (error as Error).message);
    process.exit(1);
  }
}

startServer();
