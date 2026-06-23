import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

const userSelect = {
  id: true,
  username: true,
  fullName: true,
  avatar: true,
};

export interface ListCommentsParams {
  page: number;
  limit: number;
}

export class CommentService {
  static async ensureTaskExists(taskId: string): Promise<void> {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw ApiError.notFound('Задача не найдена');
    }
  }

  static async list(taskId: string, { page, limit }: ListCommentsParams) {
    await this.ensureTaskExists(taskId);

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where: { taskId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
        include: { user: { select: userSelect } },
      }),
      prisma.comment.count({ where: { taskId } }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async create(taskId: string, userId: string, content: string) {
    await this.ensureTaskExists(taskId);

    return prisma.comment.create({
      data: { content, taskId, userId },
      include: { user: { select: userSelect } },
    });
  }

  static async remove(taskId: string, commentId: string, userId: string, role: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment || comment.taskId !== taskId) {
      throw ApiError.notFound('Комментарий не найден');
    }

    const isAuthor = comment.userId === userId;
    const isPrivileged = role === 'ADMIN' || role === 'MANAGER';

    if (!isAuthor && !isPrivileged) {
      throw ApiError.forbidden('Удалить комментарий может только автор или администратор');
    }

    await prisma.comment.delete({ where: { id: commentId } });
  }
}
