import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';

export const healthRouter = Router();

/**
 * GET /api/health
 * Returns server and database health status
 */
healthRouter.get('/health', healthCheck);
