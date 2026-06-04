import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validate, loginValidator } from '../validators';

export const authRouter = Router();

/**
 * POST /api/auth/login
 * Authenticates a user and issues a JWT token
 */
authRouter.post('/login', validate(loginValidator), login);
