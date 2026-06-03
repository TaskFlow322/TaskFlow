import app from './app';
import { prisma } from './config/prisma';
import { logger } from './config/logger';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL via Prisma');

    app.listen(env.port, () => {
      logger.info(`TaskFlow API running on http://localhost:${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
