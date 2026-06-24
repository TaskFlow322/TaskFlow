import { Router } from 'express';
import { notifyTaskMoved, notifyTaskCreated } from '../controllers/taskController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.post('/', notifyTaskCreated);
taskRouter.patch('/:id/status', notifyTaskMoved);
taskRouter.patch('/:id/move', notifyTaskMoved);
