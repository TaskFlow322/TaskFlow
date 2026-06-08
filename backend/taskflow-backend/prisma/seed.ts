import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Начинаю сидирование базы данных...\n');

  // Создаем роли
  const roles = [
    { name: 'ADMIN', description: 'Полный доступ ко всем функциям', priority: 100 },
    { name: 'MANAGER', description: 'Управление задачами и командами', priority: 50 },
    { name: 'USER', description: 'Обычный пользователь', priority: 10 },
    { name: 'GUEST', description: 'Ограниченный доступ', priority: 1 }
  ];

  for (const roleData of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: roleData.name }
    });

    if (!existingRole) {
      await prisma.role.create({
        data: roleData
      });
      console.log(`✅ Роль создана: ${roleData.name}`);
    } else {
      console.log(`📝 Роль уже существует: ${roleData.name}`);
    }
  }

  // Создаем права (пермишены)
  const permissions = [
    { name: 'users:read', resource: 'users', action: 'read', description: 'Просмотр пользователей' },
    { name: 'users:write', resource: 'users', action: 'write', description: 'Создание/редактирование пользователей' },
    { name: 'users:delete', resource: 'users', action: 'delete', description: 'Удаление пользователей' },
    { name: 'tasks:read', resource: 'tasks', action: 'read', description: 'Просмотр задач' },
    { name: 'tasks:write', resource: 'tasks', action: 'write', description: 'Создание/редактирование задач' },
    { name: 'tasks:delete', resource: 'tasks', action: 'delete', description: 'Удаление задач' },
    { name: 'projects:read', resource: 'projects', action: 'read', description: 'Просмотр проектов' },
    { name: 'projects:write', resource: 'projects', action: 'write', description: 'Создание/редактирование проектов' },
    { name: 'projects:delete', resource: 'projects', action: 'delete', description: 'Удаление проектов' },
    { name: 'settings:manage', resource: 'settings', action: 'manage', description: 'Управление настройками' }
  ];

  const permissionRecords: Record<string, string> = {};

  for (const permData of permissions) {
    const existingPerm = await prisma.permission.findUnique({
      where: { name: permData.name }
    });

    if (!existingPerm) {
      const perm = await prisma.permission.create({
        data: permData
      });
      permissionRecords[permData.name] = perm.id;
      console.log(`✅ Право создано: ${permData.name}`);
    } else {
      permissionRecords[permData.name] = existingPerm.id;
      console.log(`📝 Право уже существует: ${permData.name}`);
    }
  }

  // Связываем роли с правами
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const managerRole = await prisma.role.findUnique({ where: { name: 'MANAGER' } });
  const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });

  if (adminRole && managerRole && userRole) {
    // Админ получает все права
    const allPermissions = Object.values(permissionRecords);
    for (const permId of allPermissions) {
      const existing = await prisma.rolePermission.findFirst({
        where: { roleId: adminRole.id, permissionId: permId }
      });

      if (!existing) {
        await prisma.rolePermission.create({
          data: { roleId: adminRole.id, permissionId: permId }
        });
      }
    }
    console.log('✅ Права назначены: ADMIN → все права');

    // Менеджер получает задачи и проекты
    const managerPermissions = [
      'tasks:read', 'tasks:write', 'tasks:delete',
      'projects:read', 'projects:write'
    ];

    for (const permName of managerPermissions) {
      const permId = permissionRecords[permName];
      const existing = await prisma.rolePermission.findFirst({
        where: { roleId: managerRole.id, permissionId: permId }
      });

      if (!existing) {
        await prisma.rolePermission.create({
          data: { roleId: managerRole.id, permissionId: permId }
        });
      }
    }
    console.log('✅ Права назначены: MANAGER → задачи и проекты');

    // Пользователь получает базовые права
    const userPermissions = ['tasks:read', 'tasks:write', 'projects:read'];
    for (const permName of userPermissions) {
      const permId = permissionRecords[permName];
      const existing = await prisma.rolePermission.findFirst({
        where: { roleId: userRole.id, permissionId: permId }
      });

      if (!existing) {
        await prisma.rolePermission.create({
          data: { roleId: userRole.id, permissionId: permId }
        });
      }
    }
    console.log('✅ Права назначены: USER → базовые права');
  }

  // Создаем тестовых пользователей
  const testUsers = [
    {
      email: 'admin@taskflow.local',
      password: 'Admin1234!',
      roleName: 'ADMIN'
    },
    {
      email: 'manager@taskflow.local',
      password: 'Manager1234!',
      roleName: 'MANAGER'
    },
    {
      email: 'user@taskflow.local',
      password: 'User1234!',
      roleName: 'USER'
    }
  ];

  for (const userData of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash
        }
      });

      const role = await prisma.role.findUnique({
        where: { name: userData.roleName }
      });

      if (role) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id
          }
        });
      }

      console.log(`✅ Пользователь создан: ${userData.email} (${userData.roleName})`);
    } else {
      console.log(`📝 Пользователь уже существует: ${userData.email}`);
    }
  }

  console.log('\n✅ Сидирование завершено!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидирования:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });