import { Request, Response } from 'express';
import { HealthService } from '../services';
import { HTTP_STATUS } from '../lib/httpStatus';

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  const health = await HealthService.getHealthStatus();

  const statusCode =
    health.status === 'ok'
      ? HTTP_STATUS.OK
      : HTTP_STATUS.SERVICE_UNAVAILABLE;

  res.status(statusCode).json(health);
};
