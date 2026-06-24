# TaskFlow Backend

Backend для системы управления задачами **TaskFlow** — Node.js + Express + TypeScript + PostgreSQL (Prisma)

## Технологии

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT
- **WebSocket:** Socket.IO
- **Logger:** Winston

## Структура проекта

```
src/
├── config/         # Конфигурация (Prisma, Logger)
├── controllers/    # Обработчики запросов
├── middlewares/    # Express middleware
├── routes/         # Маршруты API
├── services/       # Бизнес-логика
├── types/          # TypeScript типы
├── utils/          # Утилиты (ApiError, response helpers)
├── app.ts          # Express приложение
└── index.ts        # Точка входа
prisma/
├── schema.prisma   # Схема базы данных
logs/               # Лог-файлы
```

## Запуск

```bash
# 1. Клонировать репозиторий
git clone https://github.com/shimtuuu/taskflow-backend
cd taskflow-backend

# 2. Установить зависимости
npm install

# 3. Настроить переменные окружения
cp .env.example .env
# Заполнить .env своими значениями

# 4. Запустить миграцию БД
npx prisma migrate dev --name init_users

# 5. Сгенерировать Prisma Client
npx prisma generate

# 6. Запустить в dev режиме
npm run dev
```

## API Endpoints

См. [API_CONTRACT.md](./API_CONTRACT.md) для полного описания всех эндпоинтов.

### День 1 — доступно сейчас:
- `GET /api/health` — проверка здоровья сервера и БД

## Проверка работы

```bash
curl http://localhost:3000/api/health
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "timestamp": "...",
  "services": {
    "database": "connected",
    "api": "running"
  }
}
```

## Roadmap

- **День 1** - Инициализация, структура, health check, схема users
- **День 2** — Подключение БД, миграции
- **День 3** — JWT авторизация, регистрация/логин
- **День 4** — CRUD проектов
- **День 5** — CRUD задач
- **День 11** — WebSocket уведомления
- **День 14** — API статистики

## Команда

TaskFlow Team — Backend Group (10 developers)
