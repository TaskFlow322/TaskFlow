import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const DEFAULT_ROLE = {
  name: 'MEMBER',
  description: 'Default workspace member access',
  priority: 10,
};

const authUserSelect = {
  id: true,
  email: true,
  username: true,
  fullName: true,
  avatar: true,
  isActive: true,
  createdAt: true,
  userRoles: {
    select: {
      role: {
        select: {
          id: true,
          name: true,
          priority: true,
          rolePermissions: {
            select: {
              permission: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

const authUserWithPasswordSelect = {
  ...authUserSelect,
  password: true,
} satisfies Prisma.UserSelect;

type AuthUser = Prisma.UserGetPayload<{ select: typeof authUserSelect }>;
type AuthUserWithPassword = Prisma.UserGetPayload<{ select: typeof authUserWithPasswordSelect }>;

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  role: string;
  roles: string[];
  permissions: string[];
  createdAt: Date;
}

export interface RegisterInput {
  email?: string;
  username?: string;
  password?: string;
  fullName?: string;
}

export interface LoginInput {
  email?: string;
  password?: string;
}

export interface UpdateProfileInput {
  email?: string;
  username?: string;
  fullName?: string;
  avatar?: string;
}

const normalizeUser = (user: AuthUser | AuthUserWithPassword): PublicUser => {
  const roles = user.userRoles
    .map(({ role }) => role)
    .sort((left, right) => right.priority - left.priority);
  const roleNames = roles.map((role) => role.name);
  const permissions = Array.from(
    new Set(
      roles.flatMap((role) =>
        role.rolePermissions.map((rolePermission) => rolePermission.permission.name)
      )
    )
  ).sort();

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    avatar: user.avatar,
    role: roleNames[0] ?? DEFAULT_ROLE.name,
    roles: roleNames.length > 0 ? roleNames : [DEFAULT_ROLE.name],
    permissions,
    createdAt: user.createdAt,
  };
};

const ensureDefaultRole = async () => {
  return prisma.role.upsert({
    where: { name: DEFAULT_ROLE.name },
    update: {},
    create: DEFAULT_ROLE,
  });
};

const createToken = (user: PublicUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      roles: user.roles,
      permissions: user.permissions,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] }
  );
};

export const authService = {
  async register(input: RegisterInput) {
    const { email, username, password, fullName } = input;

    if (!email || !username || !password) {
      throw ApiError.badRequest('Заполни все поля: email, username, password');
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw ApiError.badRequest('Пользователь с таким email или username уже существует');
    }

    const defaultRole = await ensureDefaultRole();
    const hashedPassword = await bcrypt.hash(password, env.bcryptRounds);

    const createdUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        fullName: fullName || null,
        userRoles: {
          create: {
            roleId: defaultRole.id,
          },
        },
      },
      select: authUserSelect,
    });

    const user = normalizeUser(createdUser);

    return {
      token: createToken(user),
      user,
    };
  },

  async login(input: LoginInput) {
    const { email, password } = input;

    if (!email || !password) {
      throw ApiError.badRequest('Заполни email и password');
    }

    const userWithPassword = await prisma.user.findUnique({
      where: { email },
      select: authUserWithPasswordSelect,
    });

    if (!userWithPassword || !userWithPassword.isActive) {
      throw ApiError.unauthorized('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, userWithPassword.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Неверный email или пароль');
    }

    const user = normalizeUser(userWithPassword);

    return {
      token: createToken(user),
      user,
    };
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isActive: true,
      },
      select: authUserSelect,
    });

    if (!user) {
      throw ApiError.unauthorized('Пользователь не найден или неактивен');
    }

    return normalizeUser(user);
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const { email, username, fullName, avatar } = input;

    if (!email && !username && fullName === undefined && avatar === undefined) {
      throw ApiError.badRequest('Нет данных для обновления профиля');
    }

    if (email || username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          id: { not: userId },
          OR: [
            ...(email ? [{ email }] : []),
            ...(username ? [{ username }] : []),
          ],
        },
      });

      if (existingUser) {
        throw ApiError.badRequest('Пользователь с таким email или username уже существует');
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(email ? { email } : {}),
        ...(username ? { username } : {}),
        ...(fullName !== undefined ? { fullName } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
      },
      select: authUserSelect,
    });

    return normalizeUser(user);
  },
};
