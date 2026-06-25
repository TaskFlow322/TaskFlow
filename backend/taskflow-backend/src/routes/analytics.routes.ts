import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { getRedis } from '../config/redis';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';

export const analyticsRouter = Router();

analyticsRouter.use(authMiddleware);

// GET /api/analytics/overview
analyticsRouter.get('/overview', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cacheKey = `analytics:overview:${req.user?.id ?? 'anonymous'}`;
    const redis = getRedis();
    const cached = redis ? await redis.get(cacheKey) : null;

    if (cached) {
      res.json({ success: true, data: JSON.parse(cached), meta: { cached: true } });
      return;
    }

    const [
      totalProjects,
      totalTasks,
      totalComments,
      totalUsers,
      activeUsers,
      tasksByStatus,
      tasksByPriority,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.task.count(),
      prisma.comment.count(),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.task.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      prisma.task.groupBy({
        by: ['priority'],
        _count: { _all: true },
      }),
    ]);

    const overview = {
      totalProjects,
      totalTasks,
      totalComments,
      totalUsers,
      activeUsers,
      tasksByStatus: tasksByStatus.reduce<Record<string, number>>((acc, item) => {
        acc[item.status] = item._count._all;
        return acc;
      }, {}),
      tasksByPriority: tasksByPriority.reduce<Record<string, number>>((acc, item) => {
        acc[item.priority] = item._count._all;
        return acc;
      }, {}),
    };

    if (redis) {
      await redis.setex(cacheKey, 60, JSON.stringify(overview));
    }

    res.json({ success: true, data: overview, meta: { cached: false } });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Ошибка сервера' } });
  }
});
