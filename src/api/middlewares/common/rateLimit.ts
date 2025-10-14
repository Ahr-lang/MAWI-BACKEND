import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// Middleware de rate limiting por tenant e IP
const tenantRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por ventana por tenant + IP
  keyGenerator: (req: any) => `${req.params.tenant || 'unknown'}:${ipKeyGenerator(req)}`,
  message: {
    error: 'Demasiadas requests para este tenant desde esta IP. Intenta más tarde.'
  },
  standardHeaders: true, // Incluye headers RateLimit
  legacyHeaders: false,
});

export default tenantRateLimit;