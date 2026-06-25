import { createServer } from 'http';
import app from './app';
import { prisma } from './config/prisma';
import { logger } from './config/logger';
import { env } from './config/env';
import { initSocket } from './config/socket';
import { disconnectRedis, initRedis } from './config/redis';

async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL via Prisma');
    await initRedis();

    const httpServer = createServer(app);
    initSocket(httpServer);

    httpServer.listen(env.port, () => {
      logger.info(`TaskFlow API running on http://localhost:${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    await disconnectRedis();
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
