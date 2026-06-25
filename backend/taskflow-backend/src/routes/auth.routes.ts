import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', authMiddleware, getMe);
authRouter.patch('/profile', authMiddleware, updateProfile);
