import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../lib/httpStatus';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

interface RegisterData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

export const register = async (data: RegisterData): Promise<AuthResult> => {
  const { email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Пользователь уже существует');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash
    }
  });

  const userRole = await prisma.role.findUnique({
    where: { name: 'USER' }
  });

  if (userRole) {
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: userRole.id
      }
    });
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      roles: userRole ? [userRole.name] : [],
      permissions: []
    }
  };
};

export const login = async (data: LoginData): Promise<AuthResult> => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Неверный email или пароль');
  }

  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Аккаунт деактивирован');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Неверный email или пароль');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  const roles = user.userRoles.map(ur => ur.role.name);
  const permissions = user.userRoles.flatMap(ur =>
    ur.role.rolePermissions.map(rp => rp.permission.name)
  );

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      roles,
      permissions
    }
  };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Пользователь не найден');
  }

  const roles = user.userRoles.map(ur => ur.role.name);
  const permissions = user.userRoles.flatMap(ur =>
    ur.role.rolePermissions.map(rp => rp.permission.name)
  );

  return {
    id: user.id,
    email: user.email,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    roles,
    permissions
  };
};

function generateToken(userId: string): string {
  const payload = { userId };
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
}