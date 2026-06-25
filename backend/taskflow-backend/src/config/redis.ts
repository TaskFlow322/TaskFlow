import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

let redis: Redis | undefined;

export const initRedis = async (): Promise<void> => {
  if (!env.redisUrl) {
    logger.info('Redis URL is not configured; Redis cache disabled');
    return;
  }

  redis = new Redis(env.redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  });

  redis.on('error', (error) => {
    logger.warn('Redis error', { error });
  });

  try {
    await redis.connect();
    logger.info('Connected to Redis');
  } catch (error) {
    logger.warn('Redis connection failed; cache disabled', { error });
    redis.disconnect();
    redis = undefined;
  }
};

export const getRedis = (): Redis | undefined => redis;

export const disconnectRedis = async (): Promise<void> => {
  if (!redis) return;
  await redis.quit();
  redis = undefined;
};
