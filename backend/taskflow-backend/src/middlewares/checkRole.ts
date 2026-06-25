import { Request, Response, NextFunction } from 'express';

export const checkRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: 'Пользователь не авторизован' }
      });
      return;
    }

    const userRoles = req.user.roles ?? [req.user.role];

    if (!roles.some((role) => userRoles.includes(role))) {
      res.status(403).json({
        success: false,
        error: { message: `Доступ запрещён. Нужна роль: ${roles.join(' или ')}` }
      });
      return;
    }

    next();
  };
};
