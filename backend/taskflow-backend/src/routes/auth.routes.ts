import { Router } from 'express';
import { validate } from '../validators';
import {
  registerValidator,
  loginValidator
} from '../validators/auth.validator';
import {
  registerController,
  loginController,
  meController
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerValidator), registerController);

router.post('/login', validate(loginValidator), loginController);

router.get('/me', authenticate, meController);

export default router;