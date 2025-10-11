// src/api/middlewares/logger.ts
import { Request, Response, NextFunction } from 'express';

export const swaggerLogger = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api-docs') || req.path.startsWith('/swagger')) {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const method = req.method;
    const url = req.originalUrl;

    console.log(`[${timestamp}] SWAGGER ACCESS: ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
  }
  next();
};