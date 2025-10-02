import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });
console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET);

import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger.js';
import passport from './services/auth.service.js';
import userRoutes from './api/routes/user.routes.js';
import { connectDB } from './db/index.js';

const app = express();
const PORT: string | number = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(passport.initialize());

    app.use('/api', userRoutes);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Not found' }));

    app.listen(PORT, () => {
      console.log(`Auth API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', (error as Error).message);
    process.exit(1);
  }
}

startServer();
