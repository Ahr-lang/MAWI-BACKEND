// src/server.ts
import * as dotenv from 'dotenv';
dotenv.config(); // no need for path.resolve here in prod

import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger';
import passport from './services/auth.service';
import userRoutes from './api/routes/user.routes';
import { connectDB } from './db';

const app = express();
const PORT = Number(process.env.PORT || 3000);

// 1) Behind Coolify/Caddy: trust proxy so req.secure & redirects work
app.set('trust proxy', 1);

// 2) CORS – allow your public host (or keep '*' while testing)
app.use(cors({ origin: true })); // or origin: ['https://api.ecoranger.org']

async function startServer() {
  try {
    await connectDB();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());

    app.use('/api', userRoutes);

    // Swagger UI + raw specs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.get('/api-docs.json', (_req: Request, res: Response) => res.json(specs));
    app.get('/swagger.json', (_req: Request, res: Response) => res.json(specs));

    app.get('/healthz', (_req, res) => res.json({ ok: true }));
    app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

    // 3) Bind to 0.0.0.0 so the proxy can reach it
    app.listen(PORT, '0.0.0.0', () => {
      // IMPORTANT: include /api in SWAGGER_SERVER_URL so “Try it out” hits the right base
      const base = process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}/api`;
      console.log(`Auth API listening on ${PORT}. Base: ${base}`);
      console.log(`Swagger UI: ${base.replace(/\/api$/, '')}/api-docs`);
    });
  } catch (err: any) {
    console.error('Error starting server:', err.message);
    process.exit(1);
  }
}

startServer();
