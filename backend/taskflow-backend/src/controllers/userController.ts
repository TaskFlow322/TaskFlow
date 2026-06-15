import { Response } from 'express';
import { prisma } from '../config/prisma';
import redis from '../config/redis';
import { AuthRequest } from '../middlewares/authMiddleware';

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: { message: 'Пользователь не авторизован' } });
      return;
    }

    const { fullName, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(avatar !== undefined && { avatar })
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatar: true,
        role: true,
        createdAt: true,
      }
    });

    // Invalidate Redis cache
    if (redis) {
      await redis.del(`user:profile:${userId}`);
    }

    res.json({
      success: true,
      data: { user: updatedUser },
      message: 'Профиль успешно обновлен'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка сервера при обновлении профиля' }
    });
  }
};
