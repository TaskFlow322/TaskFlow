# JWT Авторизация TaskFlow

## Запуск проекта

1. **Запустить базу данных:**
   ```bash
   docker compose up -d
   ```

2. **Установить зависимости:**
   ```bash
   npm install
   ```

3. **Создать файл .env (скопировать из .env.example):**
   ```bash
   cp .env.example .env
   ```

4. **Запустить миграции и сидирование:**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Запустить сервер:**
   ```bash
   npm run dev
   ```

## API Endpoints

### 1. Регистрация пользователя
**POST** `http://localhost:3000/api/auth/register`

**Пример запроса:**
```json
{
  "email": "test@example.com",
  "password": "Test1234"
}
```

**Пример успешного ответа:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clxk...",
      "email": "test@example.com",
      "roles": ["USER"],
      "permissions": []
    }
  },
  "message": "Пользователь успешно зарегистрирован"
}
```

### 2. Логин
**POST** `http://localhost:3000/api/auth/login`

**Пример запроса:**
```json
{
  "email": "test@example.com",
  "password": "Test1234"
}
```

**Пример успешного ответа:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clxk...",
      "email": "test@example.com",
      "roles": ["USER"],
      "permissions": ["tasks:read", "tasks:write", "projects:read"]
    }
  },
  "message": "Вход выполнен успешно"
}
```

### 3. Получение данных пользователя
**GET** `http://localhost:3000/api/auth/me`

**Заголовок:**
```
Authorization: Bearer <ваш_jwt_токен>
```

**Пример успешного ответа:**
```json
{
  "success": true,
  "data": {
    "id": "clxk...",
    "email": "test@example.com",
    "isActive": true,
    "lastLoginAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "roles": ["USER"],
    "permissions": ["tasks:read", "tasks:write", "projects:read"]
  },
  "message": "Данные пользователя получены"
}
```

## Тестовые пользователи

После сидирования создаются 3 тестовых пользователя:

1. **admin@taskflow.local** / **Admin1234!** – роль ADMIN (все права)
2. **manager@taskflow.local** / **Manager1234!** – роль MANAGER (задачи и проекты)
3. **user@taskflow.local** / **User1234!** – роль USER (базовые права)

## Роли и права

**Структура базы данных:**
- **User** ↔ **Role** (многие ко многим через `user_roles`)
- **Role** ↔ **Permission** (многие ко многим через `role_permissions`)

**Роли по умолчанию:**
1. **ADMIN** – полный доступ ко всем функциям
2. **MANAGER** – управление задачами и командами
3. **USER** – обычный пользователь
4. **GUEST** – ограниченный доступ

**Права (permissions):**
- `users:read`, `users:write`, `users:delete` – управление пользователями
- `tasks:read`, `tasks:write`, `tasks:delete` – управление задачами
- `projects:read`, `projects:write`, `projects:delete` – управление проектами
- `settings:manage` – управление настройками

## Middleware для защиты маршрутов

Пример использования в маршрутах:

```typescript
import { authenticate, requireRole, requirePermission } from '../middlewares/auth.middleware';

// Только авторизованные пользователи
router.get('/protected', authenticate, controller);

// Только пользователи с ролью ADMIN
router.get('/admin-only', authenticate, requireRole('ADMIN'), controller);

// Только пользователи с конкретным правом
router.get('/tasks', authenticate, requirePermission('tasks:read'), controller);
```

## Структура токена

JWT токен содержит:
```json
{
  "userId": "clxk...",
  "iat": 1673942400,
  "exp": 1674547200
}
```

**Время жизни:** 7 дней (настраивается через `JWT_EXPIRES_IN` в .env)