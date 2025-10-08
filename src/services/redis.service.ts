import { createClient, RedisClientType } from 'redis';
import logger from '../shared/logger';

class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', (err: Error) => {
      logger.error('Redis Client Error', { error: err.message, service: 'redis' });
    });
  }

  private async connect() {
    try {
      await this.client.connect();
      logger.info('Redis connected', { event: 'redis_connect', status: 'success' });
    } catch (error) {
      const err = error as Error;
      logger.error('Failed to connect to Redis', { error: err.message, event: 'redis_connect', status: 'failed' });
    }
  }

  async enqueue(queue: string, item: string, weight: number = 1): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.lPush(`${queue}:items`, JSON.stringify({ item, weight, timestamp: Date.now() }));
      logger.info('Enqueued item', { queue, item, weight, event: 'enqueue', status: 'success' });
    } catch (error) {
      const err = error as Error;
      logger.error('Failed to enqueue', { queue, item, error: err.message, event: 'enqueue', status: 'failed' });
      throw error;
    }
  }

  async dequeue(queue: string): Promise<string | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const item = await this.client.rPop(`${queue}:items`);
      if (item) {
        const parsed = JSON.parse(item);
        logger.info('Dequeued item', { queue, item: parsed.item, event: 'dequeue', status: 'success' });
        return parsed.item;
      }
      return null;
    } catch (error) {
      const err = error as Error;
      logger.error('Failed to dequeue', { queue, error: err.message, event: 'dequeue', status: 'failed' });
      throw error;
    }
  }

  async getQueueLength(queue: string): Promise<number> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      return await this.client.lLen(`${queue}:items`);
    } catch (error) {
      logger.error('Failed to get queue length', { queue, error: (error as Error).message, event: 'queue_length', status: 'failed' });
      return 0; // Return 0 if Redis fails
    }
  }

  async setCache(key: string, value: string, ttl: number = 3600): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.setEx(key, ttl, value);
      logger.info('Set cache', { key, event: 'cache_set', status: 'success' });
    } catch (error) {
      const err = error as Error;
      logger.error('Failed to set cache', { key, error: err.message, event: 'cache_set', status: 'failed' });
    }
  }

  async getCache(key: string): Promise<string | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const value = await this.client.get(key);
      if (value) {
        logger.info('Cache hit', { key, event: 'cache_hit', status: 'success' });
      } else {
        logger.info('Cache miss', { key, event: 'cache_miss', status: 'success' });
      }
      return value;
    } catch (error) {
      const err = error as Error;
      logger.error('Failed to get cache', { key, error: err.message, event: 'cache_get', status: 'failed' });
      return null;
    }
  }

  async incrementMetric(metric: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.incr(metric);
    } catch (error) {
      logger.error('Failed to increment metric', { metric, error: (error as Error).message, event: 'metric_incr', status: 'failed' });
    }
  }

  async getMetric(metric: string): Promise<number> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const value = await this.client.get(metric);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      logger.error('Failed to get metric', { metric, error: (error as Error).message, event: 'metric_get', status: 'failed' });
      return 0;
    }
  }

  async getAllMetrics(): Promise<Record<string, number>> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const keys = await this.client.keys('metric:*');
      const metrics: Record<string, number> = {};
      for (const key of keys) {
        const value = await this.client.get(key);
        metrics[key.replace('metric:', '')] = value ? parseInt(value, 10) : 0;
      }
      return metrics;
    } catch (error) {
      logger.error('Failed to get all metrics', { error: (error as Error).message, event: 'metrics_get_all', status: 'failed' });
      return {};
    }
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}

export default new RedisService();