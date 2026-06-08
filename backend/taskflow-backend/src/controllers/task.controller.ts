import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response';
import { TaskService } from '../services/task.service';

export class TaskController {
  static async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await TaskService.getTasks({
        status: req.query.status as string | undefined,
        assigneeId: req.query.assigneeId as string | undefined,
        projectId: req.query.projectId as string | undefined,
        search: req.query.search as string | undefined,
      });

      sendSuccess(res, tasks, 'Tasks fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}
