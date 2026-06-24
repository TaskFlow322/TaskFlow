const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuthService {
  async register(email, password) {
    if (!email || !password) throw new Error('Email и пароль обязательны');
    if (password.length < 6) throw new Error('Пароль минимум 6 символов');

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (existingUser) throw new Error('Email уже используется');

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash
      }
    });

    return { id: user.id, email: user.email };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (!user) throw new Error('Неверный email или пароль');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error('Неверный email или пароль');

    return { id: user.id, email: user.email };
  }
}

module.exports = AuthService;