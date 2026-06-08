import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultUsers = [
  {
    email: 'admin@taskflow.local',
    username: 'admin',
    fullName: 'Administrator',
    password: 'Admin1234!',
    role: Role.ADMIN,
  },
  {
    email: 'manager@taskflow.local',
    username: 'manager',
    fullName: 'Default Manager',
    password: 'Manager1234!',
    role: Role.MANAGER,
  },
  {
    email: 'member@taskflow.local',
    username: 'member',
    fullName: 'Default Member',
    password: 'Member1234!',
    role: Role.MEMBER,
  },
];

async function main() {
  for (const user of defaultUsers) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (existing) {
      console.log(`Skipped (already exists): ${user.email}`);
      continue;
    }

    const hashed = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        password: hashed,
        role: user.role,
      },
    });

    console.log(`Created [${user.role}]: ${user.email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
