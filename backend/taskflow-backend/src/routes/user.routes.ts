import { Router } from 'express';
import { updateProfile } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const userRouter = Router();

userRouter.put('/profile', authMiddleware, updateProfile);
