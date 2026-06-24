import { prisma } from '../config/prisma';
import { env } from '../config/env';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  services: {
    database: 'connected' | 'disconnected';
    api: 'running';
  };
}

export class HealthService {
  static async getHealthStatus(): Promise<HealthStatus> {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.nodeEnv,
        services: {
          database: 'connected',
          api: 'running',
        },
      };
    } catch {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.nodeEnv,
        services: {
          database: 'disconnected',
          api: 'running',
        },
      };
    }
  }
}
