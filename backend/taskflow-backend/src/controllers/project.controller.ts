import { NextFunction, Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { ApiError } from '../utils/ApiError';
import { sendCreated, sendSuccess } from '../utils/response';

const ensureAuthorized = (req: Request): void => {
  if (!req.user) {
    throw ApiError.unauthorized('Пользователь не авторизован');
  }
};

export const listProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    ensureAuthorized(req);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = (req.query.search as string | undefined) || undefined;

    const result = await ProjectService.list({ page, limit, search });
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    ensureAuthorized(req);
    const project = await ProjectService.getById(req.params.id);
    sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    ensureAuthorized(req);
    const project = await ProjectService.create(req.body);
    sendCreated(res, project, 'Проект создан');
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    ensureAuthorized(req);
    const project = await ProjectService.update(req.params.id, req.body);
    sendSuccess(res, project, 'Проект обновлён');
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    ensureAuthorized(req);
    await ProjectService.remove(req.params.id);
    sendSuccess(res, null, 'Проект удалён');
  } catch (err) {
    next(err);
  }
};
