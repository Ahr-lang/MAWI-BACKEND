// src/middlewares/error-tracking.ts
import { Request, Response, NextFunction } from 'express';
import { errorTracker } from '../services/error-tracking.service';

/**
 * Middleware to track application errors
 */
export function trackApplicationError(
  error: any,
  req: Request,
  res: Response,
  operation: string,
  context?: Record<string, any>
) {
  // Extract tenant from request
  const tenant = (req as any).tenant || 'unknown';

  // Extract user info
  const userId = (req as any).user?.id?.toString();
  const userAgent = req.get('User-Agent');
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.url;

  // Track the error
  errorTracker.trackError({
    tenant,
    operation,
    errorType: 'application',
    message: error.message || 'Application error',
    stack: error.stack,
    userId,
    userAgent,
    ip,
    method,
    url,
    context: {
      ...context,
      statusCode: res.statusCode,
      originalUrl: req.originalUrl,
      params: req.params,
      query: req.query,
      body: req.method !== 'GET' ? req.body : undefined
    }
  });
}

/**
 * Middleware to track HTTP errors (5xx responses)
 */
export function trackHttpError(req: Request, res: Response, next: NextFunction) {
  // Track when response finishes
  res.on('finish', () => {
    // Only track 5xx errors
    if (res.statusCode >= 500) {
      const tenant = (req as any).tenant || 'unknown';
      const userId = (req as any).user?.id?.toString();
      const userAgent = req.get('User-Agent');
      const ip = req.ip || req.connection.remoteAddress;
      const method = req.method;
      const url = req.url;

      errorTracker.trackError({
        tenant,
        operation: `${method} ${url}`,
        errorType: 'http',
        message: `HTTP ${res.statusCode} Error`,
        statusCode: res.statusCode,
        userId,
        userAgent,
        ip,
        method,
        url,
        context: {
          statusCode: res.statusCode,
          originalUrl: req.originalUrl,
          params: req.params,
          query: req.query
        }
      });
    }
  });

  next();
}

/**
 * Express error handling middleware that tracks errors
 */
export function errorTrackingMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Track the error
  trackApplicationError(err, req, res, 'middleware_error', {
    middleware: 'error_handler',
    handled: true
  });

  // Continue with normal error handling
  next(err);
}

/**
 * Helper function to manually track errors in controllers/services
 */
export function trackError(
  error: any,
  req?: Request,
  operation?: string,
  context?: Record<string, any>
) {
  if (!req) {
    // Track without request context
    errorTracker.trackError({
      tenant: 'unknown',
      operation: operation || 'unknown',
      errorType: 'application',
      message: error.message || 'Manual error tracking',
      stack: error.stack,
      context
    });
    return;
  }

  trackApplicationError(error, req, {} as Response, operation || 'manual_tracking', context);
}