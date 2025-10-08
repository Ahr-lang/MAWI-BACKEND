import { Request, Response, NextFunction } from 'express';
import redisService from '../services/redis.service';
import logger from '../shared/logger';

export const idempotencyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers['x-idempotency-key'] as string;
  if (!id) {
    logger.warn('Missing idempotency key', { event: 'idempotency', status: 'missing_key' });
    res.status(400).json({ error: 'Idempotency key required' });
    return;
  }

  const processed = await redisService.getCache(`idempotency:${id}`);
  if (processed) {
    logger.info('Idempotent request', { id, event: 'idempotency', status: 'duplicate' });
    res.status(200).json(JSON.parse(processed));
    return;
  }

  // Store response after processing
  res.on('finish', async () => {
    if (res.statusCode === 200) {
      await redisService.setCache(`idempotency:${id}`, JSON.stringify(res.locals.responseData || {}), 3600);
    }
  });

  next();
};