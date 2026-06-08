import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

export const taskRouter = Router();

taskRouter.get('/', TaskController.getTasks);
