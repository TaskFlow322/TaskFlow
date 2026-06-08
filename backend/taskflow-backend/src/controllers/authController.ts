import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AuthRequest } from '../middlewares/authMiddleware';

// РЕГИСТРАЦИЯ
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, fullName } = req.body;

    if (!email || !username || !password) {
      res.status(400).json({
        success: false,
        error: { message: 'Заполни все поля: email, username, password' }
      });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: { message: 'Пользователь с таким email или username уже существует' }
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, env.bcryptRounds);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        fullName: fullName || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        createdAt: true,
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] }
    );

    res.status(201).json({
      success: true,
      data: { token, user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка сервера при регистрации' }
    });
  }
};

// ЛОГИН
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { message: 'Заполни email и password' }
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: { message: 'Неверный email или пароль' }
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: { message: 'Неверный email или пароль' }
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка сервера при входе' }
    });
  }
};

// ПОЛУЧИТЬ СЕБЯ
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        error: { message: 'Пользователь не авторизован' }
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatar: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: 'Пользователь не найден' }
      });
      return;
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Ошибка сервера' }
    });
  }
};