import { NextFunction, Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { ApiError } from '../utils/ApiError';
import { sendCreated, sendSuccess } from '../utils/response';

const getUser = (req: Request): { id: string; role: string } => {
  if (!req.user) {
    throw ApiError.unauthorized('Пользователь не авторизован');
  }
  return { id: req.user.id, role: req.user.role };
};

export const listComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await CommentService.list(req.params.taskId, { page, limit });
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = getUser(req);
    const comment = await CommentService.create(
      req.params.taskId,
      id,
      req.body.content as string
    );
    sendCreated(res, comment, 'Комментарий создан');
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, role } = getUser(req);
    await CommentService.remove(req.params.taskId, req.params.commentId, id, role);
    sendSuccess(res, null, 'Комментарий удалён');
  } catch (err) {
    next(err);
  }
};
