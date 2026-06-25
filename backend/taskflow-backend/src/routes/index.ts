import { Router } from 'express';
import { healthRouter } from './health.routes';
import { authRouter } from './auth.routes';
import { tasksRouter } from './tasks.routes';
import { projectsRouter } from './projects.routes';
import { usersRouter } from './users.routes';
import { analyticsRouter } from './analytics.routes';
import { getMe } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.get('/me', authMiddleware, getMe);
apiRouter.use('/projects', projectsRouter);
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/analytics', analyticsRouter);
