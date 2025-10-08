import { Request, Response, NextFunction } from 'express';
import redisService from '../services/redis.service';
import logger from '../shared/logger';

const BACKPRESSURE_THRESHOLD = 100; // Example threshold

export const backpressureMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const queue = req.path.split('/')[2]; // e.g., /api/v1/biomo -> biomo
  const length = await redisService.getQueueLength(queue);
  if (length > BACKPRESSURE_THRESHOLD) {
    logger.warn('Backpressure triggered', { queue, length, event: 'backpressure', status: 'queued' });
    res.status(202).json({ message: 'Request queued due to high load' });
    return;
  }
  next();
};