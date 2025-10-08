import { Router } from 'express';
import redisService from '../services/redis.service';
import { queueLengthGauge } from '../shared/metrics';
import logger from '../shared/logger';

const router = Router();

// Registrar gauge para queue length
queueLengthGauge.addCallback(async (result) => {
  const biomo = await redisService.getQueueLength('biomo');
  const agromo = await redisService.getQueueLength('agromo');
  const robot = await redisService.getQueueLength('robot');
  result.observe(biomo, { queue: 'biomo' });
  result.observe(agromo, { queue: 'agromo' });
  result.observe(robot, { queue: 'robot' });
});

router.get('/redis/metrics', async (req, res) => {
  try {
    const queueLengths = {
      biomo: await redisService.getQueueLength('biomo'),
      agromo: await redisService.getQueueLength('agromo'),
      robot: await redisService.getQueueLength('robot'),
    };
    const cacheHits = await redisService.getMetric('cache_hits');
    const cacheMisses = await redisService.getMetric('cache_misses');
    const enqueues = await redisService.getMetric('enqueues');
    const dequeues = await redisService.getMetric('dequeues');

    const metrics = {
      queues: queueLengths,
      cache: { hits: cacheHits, misses: cacheMisses },
      operations: { enqueues, dequeues },
    };

    logger.info('Metrics requested', { event: 'metrics', status: 'success' });
    res.json(metrics);

    // Alertas básicas
    if (queueLengths.biomo > 1000) logger.warn('Queue saturation', { queue: 'biomo', length: queueLengths.biomo, event: 'alert', status: 'saturation' });
    if (cacheMisses > cacheHits * 2) logger.warn('Cache failing', { hits: cacheHits, misses: cacheMisses, event: 'alert', status: 'cache_fail' });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to get metrics', { error: err.message, event: 'metrics', status: 'failed' });
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

export default router;