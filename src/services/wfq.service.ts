import redisService from './redis.service';
import logger from '../shared/logger';

interface QueueItem {
  item: string;
  weight: number;
  timestamp: number;
}

class WFQService {
  private queues: Map<string, number> = new Map(); // queue -> deficit

  async enqueue(queue: string, item: string, weight: number = 1): Promise<void> {
    await redisService.enqueue(queue, item, weight);
  }

  async dequeue(): Promise<{ queue: string; item: string } | null> {
    const activeQueues = Array.from(this.queues.keys());
    if (activeQueues.length === 0) {
      // Find queues with items
      const allQueues = await this.getAllQueues();
      for (const q of allQueues) {
        if (await redisService.getQueueLength(q) > 0) {
          this.queues.set(q, 0);
        }
      }
      activeQueues.push(...Array.from(this.queues.keys()));
    }

    if (activeQueues.length === 0) return null;

    // DRR: increment deficit, serve if deficit >= weight
    for (const queue of activeQueues) {
      const deficit = this.queues.get(queue) || 0;
      this.queues.set(queue, deficit + 1); // quantum = 1 for simplicity

      const length = await redisService.getQueueLength(queue);
      if (length > 0) {
        const itemStr = await redisService.dequeue(queue);
        if (itemStr) {
          const parsed: QueueItem = JSON.parse(itemStr);
          if (deficit + 1 >= parsed.weight) {
            this.queues.set(queue, deficit + 1 - parsed.weight);
            return { queue, item: parsed.item };
          } else {
            // Re-enqueue if not served
            await redisService.enqueue(queue, parsed.item, parsed.weight);
          }
        }
      }
    }

    return null;
  }

  private async getAllQueues(): Promise<string[]> {
    // Assume queues are known, or scan Redis keys
    // For simplicity, hardcode or use a set
    return ['biomo', 'agromo', 'robot']; // Example
  }
}

export default new WFQService();