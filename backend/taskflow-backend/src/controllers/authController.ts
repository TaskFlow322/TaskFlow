import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ApiError } from '../utils/ApiError';

const handleControllerError = (res: Response, error: unknown, fallbackMessage: string): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      error: { message: error.message },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: { message: fallbackMessage },
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleControllerError(res, error, 'Ошибка сервера при регистрации');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleControllerError(res, error, 'Ошибка сервера при входе');
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Пользователь не авторизован');
    }

    const user = await authService.getCurrentUser(req.user.id);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    handleControllerError(res, error, 'Ошибка сервера');
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Пользователь не авторизован');
    }

    const user = await authService.updateProfile(req.user.id, req.body);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    handleControllerError(res, error, 'Ошибка сервера при обновлении профиля');
  }
};
