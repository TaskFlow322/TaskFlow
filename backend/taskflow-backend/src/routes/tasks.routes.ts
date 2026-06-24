import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';

export const tasksRouter = Router();

tasksRouter.use(authMiddleware);

// GET /api/tasks
tasksRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      where: req.query.assigneeId ? { assigneeId: String(req.query.assigneeId) } : undefined,
      include: {
        assignee: { select: { id: true, username: true, fullName: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: { tasks } });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Ошибка сервера' } });
  }
});

// GET /api/tasks/:id
tasksRouter.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        assignee: { select: { id: true, username: true, fullName: true } },
        project: { select: { id: true, name: true } },
      },
    });
    if (!task) {
      res.status(404).json({ success: false, error: { message: 'Задача не найдена' } });
      return;
    }
    res.json({ success: true, data: { task } });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Ошибка сервера' } });
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
      data: { title, description, status, priority, projectId, assigneeId },
      include: {
        assignee: { select: { id: true, username: true, fullName: true } },
        project: { select: { id: true, name: true } },
      },
    });
    res.status(201).json({ success: true, data: { task } });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Ошибка сервера' } });
  }
});

// PUT /api/tasks/:id
tasksRouter.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, projectId, assigneeId } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { title, description, status, priority, projectId, assigneeId },
      include: {
        assignee: { select: { id: true, username: true, fullName: true } },
        project: { select: { id: true, name: true } },
      },
    });
    res.json({ success: true, data: { task } });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Задача не найдена или ошибка сервера' } });
  }
});

// DELETE /api/tasks/:id
tasksRouter.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Задача не найдена или ошибка сервера' } });
  }
});
