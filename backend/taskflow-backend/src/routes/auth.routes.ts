import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate, registerValidator, loginValidator } from '../validators';

export const authRouter = Router();

authRouter.post('/register', validate(registerValidator), register);
authRouter.post('/login', validate(loginValidator), login);
authRouter.get('/me', authMiddleware, getMe);