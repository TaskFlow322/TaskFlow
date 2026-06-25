import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultUsers = [
  {
    email: 'admin@taskflow.local',
    username: 'admin',
    fullName: 'Administrator',
    password: 'Admin1234!',
    role: 'ADMIN',
  },
  {
    email: 'manager@taskflow.local',
    username: 'manager',
    fullName: 'Default Manager',
    password: 'Manager1234!',
    role: 'MANAGER',
  },
  {
    email: 'member@taskflow.local',
    username: 'member',
    fullName: 'Default Member',
    password: 'Member1234!',
    role: 'MEMBER',
  },
];

async function main() {
  const roles = await Promise.all(
    [
      { name: 'ADMIN', description: 'Full platform access', priority: 100 },
      { name: 'MANAGER', description: 'Project and task management access', priority: 50 },
      { name: 'MEMBER', description: 'Default workspace member access', priority: 10 },
    ].map((role) =>
      prisma.role.upsert({
        where: { name: role.name },
        update: {
          description: role.description,
          priority: role.priority,
        },
        create: role,
      })
    )
  );
  const roleByName = new Map(roles.map((role) => [role.name, role]));

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
        userRoles: {
          create: {
            roleId: roleByName.get(user.role)!.id,
          },
        },
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
