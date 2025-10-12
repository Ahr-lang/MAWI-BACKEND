// src/middlewares/otelContext.ts
import { context, trace, SpanStatusCode } from '@opentelemetry/api';
import { Request, Response, NextFunction } from 'express';

/** Adjunta traceId/spanId al req y los expone en headers de respuesta */
export function attachTraceIds(req: Request, res: Response, next: NextFunction) {
  const span = trace.getSpan(context.active());
  const ctx = span?.spanContext();

  (req as any).traceId = ctx?.traceId;
  (req as any).spanId  = ctx?.spanId;

  if (ctx?.traceId) res.setHeader('X-Trace-Id', ctx.traceId);
  if (ctx?.spanId)  res.setHeader('X-Span-Id', ctx.spanId);

  next();
}

/** Middleware utilitario para marcar rutas obsoletas (CA4) */
export function deprecatedRoute(message = 'Endpoint deprecated') {
  return (req: Request, res: Response) => {
    const span = trace.getActiveSpan();
    span?.setAttribute('http.deprecated', true);
    span?.setStatus({ code: SpanStatusCode.ERROR, message: '410 Gone' });
    res.status(410).json({
      error: { code: 410, message },
      traceId: (req as any).traceId || null,
    });
  };
}
