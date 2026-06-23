import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export interface CreateProjectInput {
  name: string;
  description?: string | null;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
}

export interface ListProjectsParams {
  page: number;
  limit: number;
  search?: string;
}

export class ProjectService {
  static async list({ page, limit, search }: ListProjectsParams) {
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { _count: { select: { tasks: true } } },
    });

    if (!project) {
      throw ApiError.notFound('Проект не найден');
    }

    return project;
  }

  static async create(input: CreateProjectInput) {
    return prisma.project.create({
      data: {
        name: input.name,
        description: input.description ?? null,
      },
    });
  }

  static async update(id: string, input: UpdateProjectInput) {
    await this.getById(id);

    const data: Prisma.ProjectUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;

    return prisma.project.update({ where: { id }, data });
  }

  static async remove(id: string) {
    await this.getById(id);
    await prisma.project.delete({ where: { id } });
  }
}
