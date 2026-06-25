import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';

export const projectsRouter = Router();

projectsRouter.use(authMiddleware);

const projectInclude = {
  members: {
    include: {
      user: {
        select: { id: true, username: true, email: true, fullName: true, avatar: true },
      },
    },
  },
  _count: {
    select: { tasks: true },
  },
} as const;

const getAuthUserId = (req: AuthRequest): string => req.user?.id ?? '';

// GET /api/projects
projectsRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: req.query.memberId
        ? {
            members: {
              some: { userId: String(req.query.memberId) },
            },
          }
        : undefined,
      include: projectInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: { projects } });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Ошибка сервера' } });
  }
});

// GET /api/projects/:id
projectsRouter.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        ...projectInclude,
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      res.status(404).json({ success: false, error: { message: 'Проект не найден' } });
      return;
    }

    res.json({ success: true, data: { project } });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Ошибка сервера' } });
  }
});

// POST /api/projects
projectsRouter.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ success: false, error: { message: 'name обязателен' } });
      return;
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: getAuthUserId(req),
            role: 'OWNER',
          },
        },
      },
      include: projectInclude,
    });

    res.status(201).json({ success: true, data: { project } });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Ошибка сервера' } });
  }
});

// PUT /api/projects/:id
projectsRouter.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
      },
      include: projectInclude,
    });

    res.json({ success: true, data: { project } });
  } catch {
    res.status(404).json({ success: false, error: { message: 'Проект не найден или ошибка сервера' } });
  }
});

// DELETE /api/projects/:id
projectsRouter.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });

    res.json({ success: true, data: null });
  } catch {
    res.status(404).json({ success: false, error: { message: 'Проект не найден или ошибка сервера' } });
  }
});
