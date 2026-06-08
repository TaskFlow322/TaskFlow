# TaskFlow 🚀
Система управления задачами для IT-команды

## Стек
- Node.js 20
- React 18 + TypeScript 5
- Vite 5
- TailwindCSS 3
- Redux Toolkit 2
- React Router 6
- Express 4
- Prisma 5
- PostgreSQL 16
- Docker

## Структура проекта
frontend/src/components — переиспользуемые компоненты (кнопки, инпуты, модалки)
frontend/src/pages — страницы приложения (Login, Dashboard, Board)
frontend/src/hooks — кастомные хуки
frontend/src/store — Redux store и слайсы
frontend/src/api — запросы к бэкенду через axios
frontend/src/types — TypeScript типы и интерфейсы
frontend/src/utils — вспомогательные функции

backend/src/routes — маршруты API
backend/src/controllers — обработка запросов
backend/src/services — бизнес-логика
backend/src/models — работа с базой данных
backend/src/middleware — проверка токена, обработка ошибок
backend/src/types — TypeScript типы
backend/prisma — схема базы данных и миграции

qa/test-cases — тест-кейсы по модулям
qa/bug-reports — шаблоны и заполненные баг-репорты
qa/checklists — чек-листы для проверки функционала
qa/autotests/e2e — e2e-тесты через Playwright
qa/autotests/api — тесты API через Supertest

devops/nginx — конфиг Nginx для прода

## Запуск
1. Установить Docker Desktop, Node.js 20, Git
2. Клонировать репо
3. Запустить базу данных: `docker compose up -d`
4. Запустить бэкенд: `cd backend && npm install && npm run dev`
5. Запустить фронтенд: `cd frontend && npm install && npm run dev`

Фронтенд — localhost:5173
Бэкенд — localhost:3000
База (pgAdmin) — localhost:8080

## Правила работы
- Никто не пушит напрямую в main
- Каждая задача — отдельная ветка (feature/fe-login, fix/be-auth)
- Коммиты по формату: feat: добавил логин / fix: исправил токен
- Каждый день стендап — что сделал, что делаю, что мешает
