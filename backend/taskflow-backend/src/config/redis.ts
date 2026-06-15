import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger'; // Assuming logger exists based on the file list

let redis: Redis | null = null;

if (env.redisUrl) {
  redis = new Redis(env.redisUrl);

  redis.on('connect', () => {
    logger.info('Successfully connected to Redis');
  });

  redis.on('error', (err) => {
    logger.error('Redis connection error:', err);
  });
} else {
  logger.warn('REDIS_URL is not defined in environment variables. Redis cache will be disabled.');
}

export default redis;
