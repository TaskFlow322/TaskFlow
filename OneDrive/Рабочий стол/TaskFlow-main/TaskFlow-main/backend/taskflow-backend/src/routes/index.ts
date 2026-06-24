import { Router } from 'express';
import { healthRouter } from './health.routes';
import { authRouter } from './auth.routes';
import { taskRouter } from './task.routes';
import { tasksRouter } from './tasks.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/tasks', taskRouter);
apiRouter.use('/tasks', tasksRouter);