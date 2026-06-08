import { Request, Response, NextFunction } from 'express';
import { login, register, getProfile } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendCreated, sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../lib/httpStatus';

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const result = await register({ email, password });

    sendCreated(res, result, 'Пользователь успешно зарегистрирован');
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const result = await login({ email, password });

    sendSuccess(res, result, 'Вход выполнен успешно');
  } catch (error) {
    next(error);
  }
};

export const meController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return sendSuccess(res, null, 'Требуется авторизация', HTTP_STATUS.UNAUTHORIZED);
    }

    const profile = await getProfile(req.user.id);
    sendSuccess(res, profile, 'Данные пользователя получены');
  } catch (error) {
    next(error);
  }
};