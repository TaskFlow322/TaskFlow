import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const result = await AuthService.login({ email, password });

    sendSuccess(res, result, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};
