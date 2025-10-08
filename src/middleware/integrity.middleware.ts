import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import logger from '../shared/logger';

export const integrityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const payload = JSON.stringify(req.body);
  const checksum = req.headers['x-checksum'] as string;
  if (!checksum) {
    logger.error('Missing checksum', { event: 'integrity', status: 'missing_checksum' });
    res.status(422).json({ error: 'Integrity check failed: missing checksum' });
    return;
  }

  const computed = crypto.createHash('sha256').update(payload).digest('hex');
  if (computed !== checksum) {
    logger.error('Integrity failed', { event: 'integrity', status: 'integrity_failed' });
    res.status(422).json({ error: 'Integrity check failed' });
    return;
  }

  logger.info('Integrity ok', { event: 'integrity', status: 'integrity_ok' });
  next();
};