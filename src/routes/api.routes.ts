import { Router } from 'express';
import { backpressureMiddleware } from '../middleware/backpressure.middleware';
import { idempotencyMiddleware } from '../middleware/idempotency.middleware';
import { integrityMiddleware } from '../middleware/integrity.middleware';
import redisService from '../services/redis.service';
import wfqService from '../services/wfq.service';
import { requestCounter, cacheHitCounter, cacheMissCounter } from '../shared/metrics';
import logger from '../shared/logger';

const router = Router();

// Apply middlewares to all API routes
router.use(backpressureMiddleware);
router.use(idempotencyMiddleware);
router.use(integrityMiddleware);

// Middleware para contar requests
router.use((req, res, next) => {
  requestCounter.add(1, { method: req.method, path: req.path });
  next();
});

// Example route for biomo
router.post('/biomo/data', async (req, res) => {
  const { data } = req.body;
  try {
    // Enqueue to WFQ
    await wfqService.enqueue('biomo', JSON.stringify(data));
    await redisService.incrementMetric('enqueues');
    logger.info('Data enqueued', { module: 'biomo', event: 'enqueue', status: 'success' });
    res.locals.responseData = { message: 'Data queued' };
    res.json({ message: 'Data queued' });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to enqueue data', { module: 'biomo', error: err.message, event: 'enqueue', status: 'failed' });
    res.status(500).json({ error: 'Failed to process' });
  }
});

// Similar for agromo and robot
router.post('/agromo/data', async (req, res) => {
  const { data } = req.body;
  try {
    await wfqService.enqueue('agromo', JSON.stringify(data));
    await redisService.incrementMetric('enqueues');
    logger.info('Data enqueued', { module: 'agromo', event: 'enqueue', status: 'success' });
    res.locals.responseData = { message: 'Data queued' };
    res.json({ message: 'Data queued' });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to enqueue data', { module: 'agromo', error: err.message, event: 'enqueue', status: 'failed' });
    res.status(500).json({ error: 'Failed to process' });
  }
});

router.post('/robot/data', async (req, res) => {
  const { data } = req.body;
  try {
    await wfqService.enqueue('robot', JSON.stringify(data));
    await redisService.incrementMetric('enqueues');
    logger.info('Data enqueued', { module: 'robot', event: 'enqueue', status: 'success' });
    res.locals.responseData = { message: 'Data queued' };
    res.json({ message: 'Data queued' });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to enqueue data', { module: 'robot', error: err.message, event: 'enqueue', status: 'failed' });
    res.status(500).json({ error: 'Failed to process' });
  }
});

// Query with cache
router.get('/biomo/data/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `biomo:data:${id}`;
  let data = await redisService.getCache(cacheKey);
  if (data) {
    cacheHitCounter.add(1);
    res.locals.responseData = JSON.parse(data);
    return res.json(JSON.parse(data));
  }
  // Simulate fetch
  data = JSON.stringify({ id, value: 'fetched' });
  await redisService.setCache(cacheKey, data);
  cacheMissCounter.add(1);
  res.locals.responseData = JSON.parse(data);
  res.json(JSON.parse(data));
});

export default router;