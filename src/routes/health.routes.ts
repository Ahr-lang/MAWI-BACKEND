import { Router } from 'express';
import logger from '../shared/logger';

const router = Router();

router.get('/health', (req, res) => {
  logger.info('Health check', { service: 'backend', event: 'health', status: 'ok' });
  res.status(200).json({ status: 'ok', service: 'backend' });
});

export default router;