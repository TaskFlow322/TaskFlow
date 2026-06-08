import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const checkRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: 'Пользователь не авторизован' }
      });
      return;
    }

    if (!roles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        error: { message: `Доступ запрещён. Нужна роль: ${roles.join(' или ')}` }
      });
      return;
    }

    next();
  };
};