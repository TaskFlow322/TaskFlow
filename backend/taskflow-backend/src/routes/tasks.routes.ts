import { Router, Response } from 'express';
import { TaskStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
import {
  emitCommentCreated,
  emitCommentDeleted,
  emitTaskCreated,
  emitTaskDeleted,
  emitTaskMoved,
  emitTaskUpdated,
} from '../events/taskEvents';

export const tasksRouter = Router();

tasksRouter.use(authMiddleware);

const taskInclude = {
  assignee: { select: { id: true, username: true, fullName: true, avatar: true } },
  project: { select: { id: true, name: true } },
} as const;

const commentInclude = {
  user: { select: { id: true, username: true, fullName: true, avatar: true } },
} as const;

const getAuthUserId = (req: AuthRequest): string => req.user?.id ?? '';

const isTaskStatus = (status: unknown): status is TaskStatus => {
  return typeof status === 'string' && Object.values(TaskStatus).includes(status as TaskStatus);
};

const sendServerError = (res: Response, message = 'Ошибка сервера'): void => {
  res.status(500).json({ success: false, error: { message } });
};

// GET /api/tasks
tasksRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        ...(req.query.projectId ? { projectId: String(req.query.projectId) } : {}),
        ...(req.query.assigneeId ? { assigneeId: String(req.query.assigneeId) } : {}),
        ...(req.query.status && isTaskStatus(req.query.status) ? { status: req.query.status } : {}),
      },
      include: taskInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: { tasks } });
  } catch {
    sendServerError(res);
  }
});

// GET /api/tasks/:id/comments
tasksRouter.get('/:id/comments', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: req.params.id },
      include: commentInclude,
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, data: { comments } });
  } catch {
    sendServerError(res);
  }
});

// POST /api/tasks/:id/comments
tasksRouter.post('/:id/comments', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const content = req.body.content ?? req.body.text;
    const userId = getAuthUserId(req);

    if (!content || typeof content !== 'string') {
      res.status(400).json({ success: false, error: { message: 'content обязателен' } });
      return;
    }

    const task = await prisma.task.findUnique({ where: { id: req.params.id }, select: { id: true } });
    if (!task) {
      res.status(404).json({ success: false, error: { message: 'Задача не найдена' } });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId: req.params.id,
        userId,
      },
      include: commentInclude,
    });

    emitCommentCreated({
      id: comment.id,
      taskId: comment.taskId,
      userId: comment.userId,
      content: comment.content,
    });

    res.status(201).json({ success: true, data: { comment } });
  } catch {
    sendServerError(res);
  }
});

// DELETE /api/tasks/:id/comments/:commentId
tasksRouter.delete('/:id/comments/:commentId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: req.params.commentId,
        taskId: req.params.id,
      },
      select: { id: true, taskId: true, userId: true },
    });

    if (!comment) {
      res.status(404).json({ success: false, error: { message: 'Комментарий не найден' } });
      return;
    }

    await prisma.comment.delete({ where: { id: comment.id } });
    emitCommentDeleted(comment);

    res.json({ success: true, data: null });
  } catch {
    sendServerError(res);
  }
});

// DELETE /api/tasks/:id/comments?commentId=...
tasksRouter.delete('/:id/comments', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const commentId = req.body.commentId ?? req.query.commentId;

    if (!commentId) {
      res.status(400).json({ success: false, error: { message: 'commentId обязателен' } });
      return;
    }

    const comment = await prisma.comment.findFirst({
      where: {
        id: String(commentId),
        taskId: req.params.id,
      },
      select: { id: true, taskId: true, userId: true },
    });

    if (!comment) {
      res.status(404).json({ success: false, error: { message: 'Комментарий не найден' } });
      return;
    }

    await prisma.comment.delete({ where: { id: comment.id } });
    emitCommentDeleted(comment);

    res.json({ success: true, data: null });
  } catch {
    sendServerError(res);
  }
});

// GET /api/tasks/:id
tasksRouter.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: taskInclude,
    });

    if (!task) {
      res.status(404).json({ success: false, error: { message: 'Задача не найдена' } });
      return;
    }

    res.json({ success: true, data: { task } });
  } catch {
    sendServerError(res);
  }
});

// POST /api/tasks
tasksRouter.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, projectId, assigneeId } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: { message: 'title обязателен' } });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        projectId,
        assigneeId,
      },
      include: taskInclude,
    });

    if (projectId) {
      const memberUserId = assigneeId ?? getAuthUserId(req);
      await prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId,
            userId: memberUserId,
          },
        },
        update: {},
        create: {
          projectId,
          userId: memberUserId,
          role: assigneeId ? 'MEMBER' : 'OWNER',
        },
      });
    }

    emitTaskCreated(task);

    res.status(201).json({ success: true, data: { task } });
  } catch {
    sendServerError(res);
  }
});

const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, projectId, assigneeId } = req.body;

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        status,
        priority,
        projectId,
        assigneeId,
      },
      include: taskInclude,
    });

    emitTaskUpdated(task);

    res.json({ success: true, data: { task } });
  } catch {
    res.status(404).json({ success: false, error: { message: 'Задача не найдена или ошибка сервера' } });
  }
};

// PUT /api/tasks/:id
tasksRouter.put('/:id', updateTask);

// PATCH /api/tasks/:id
tasksRouter.patch('/:id', updateTask);

const moveTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!isTaskStatus(status)) {
      res.status(400).json({ success: false, error: { message: 'Некорректный status' } });
      return;
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: req.params.id },
      select: { id: true, title: true, status: true },
    });

    if (!existingTask) {
      res.status(404).json({ success: false, error: { message: 'Задача не найдена' } });
      return;
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status },
      include: taskInclude,
    });

    emitTaskMoved({
      id: task.id,
      title: task.title,
      previousStatus: existingTask.status,
      status: task.status,
    });

    res.json({ success: true, data: { task } });
  } catch {
    sendServerError(res);
  }
};

// PATCH /api/tasks/:id/move
tasksRouter.patch('/:id/move', moveTask);

// Backward-compatible alias for the frontend currently using /status.
tasksRouter.patch('/:id/status', moveTask);

// DELETE /api/tasks/:id
tasksRouter.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    emitTaskDeleted({ id: req.params.id });

    res.json({ success: true, data: null });
  } catch {
    res.status(404).json({ success: false, error: { message: 'Задача не найдена или ошибка сервера' } });
  }
});
