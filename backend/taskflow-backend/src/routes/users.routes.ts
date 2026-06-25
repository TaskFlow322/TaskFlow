import { Router } from 'express';
import { updateProfile } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const usersRouter = Router();

usersRouter.use(authMiddleware);

usersRouter.put('/profile', updateProfile);
usersRouter.patch('/profile', updateProfile);
