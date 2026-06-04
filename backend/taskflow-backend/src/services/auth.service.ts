import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  role: string;
}

export interface LoginResult {
  user: AuthUser;
  token: string;
}

export class AuthService {
  static async login({ email, password }: LoginInput): Promise<LoginResult> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
      },
      token,
    };
  }
}
