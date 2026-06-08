import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { TaskFilters } from '../types';
import { TaskStatus } from '@prisma/client';

const statusMapping: Record<string, TaskStatus> = {
  todo: 'TODO',
  in_progress: 'IN_PROGRESS',
  inprogress: 'IN_PROGRESS',
  done: 'DONE',
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};

const normalizeStatus = (status: string): TaskStatus[] => {
  const segments = status
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const mapped = segments.map((value) => {
    const normalized = statusMapping[value as keyof typeof statusMapping];
    if (!normalized) {
      throw new ApiError(400, `Invalid status filter value: ${value}`);
    }
    return normalized;
  });

  return Array.from(new Set(mapped));
};

export const TaskService = {
  async getTasks(filters: TaskFilters) {
    const where: Record<string, unknown> = {};

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.assigneeId) {
      where.assigneeId = filters.assigneeId;
    }

    if (filters.status) {
      const statuses = normalizeStatus(filters.status);
      where.status = statuses.length === 1 ? statuses[0] : { in: statuses };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
