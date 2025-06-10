import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisInstance = new Redis(redisUrl);

    redisInstance.on('error', (e) => {
      console.error('Redis connection error:', e);
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [],
};
