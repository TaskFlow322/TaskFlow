# [BUG-001] Auth endpoints не реализованы — register/login возвращают 404

| Поле | Значение |
|------|----------|
| **Дата** | 2026-06-08 |
| **Автор** | QA |
| **Приоритет** | Critical |
| **Статус** | Open |
| **Модуль** | Auth / Backend |
| **Окружение** | Windows 10, Node v22.22.0, backend `server.js` на порту 5000 |

---

## Описание

Эндпоинты авторизации из API Contract (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`) отсутствуют в работающем бэкенде. Smoke-пункты S3 и S4 провалены.

---

## Шаги воспроизведения

1. Установить зависимости: `cd backend && npm install`
2. Запустить сервер: `node server.js`
3. Убедиться, что health работает: `GET http://localhost:5000/api/health`
4. Отправить `POST http://localhost:5000/api/auth/register` с телом:
   ```json
   {
     "email": "smoke@test.com",
     "username": "smoke_user",
     "password": "SecurePass123!",
     "fullName": "Smoke Test"
   }
   ```
5. Отправить `POST http://localhost:5000/api/auth/login` с телом:
   ```json
   {
     "email": "smoke@test.com",
     "password": "SecurePass123!"
   }
   ```

---

## Ожидаемый результат

- Register → HTTP `201`, `success: true`, `data.user` + `data.token`
- Login → HTTP `200`, `success: true`, `data.token`

(согласно `backend/taskflow-backend/API_CONTRACT.md`)

---

## Фактический результат

- Register → **HTTP 404 Not Found**
- Login → **HTTP 404 Not Found**

В `backend/server.js` объявлен только маршрут `/api/health`. В `taskflow-backend/src/routes/index.ts` подключён только `healthRouter`; файлов `auth.routes.ts`, `auth.controller.ts`, `auth.service.ts` нет.

---

## Окружение

| Параметр | Значение |
|----------|----------|
| OS | Windows 10 (10.0.26200) |
| Node.js | v22.22.0 |
| Backend URL | `http://localhost:5000/api` |
| Ветка | `feature/qa-auth-setup` |

---

## Скриншот

_Не приложен — воспроизводится через API-запросы (404)._

---

## Дополнительно

- Логи: сервер стартует без ошибок, 404 на неизвестные маршруты
- Связанные пункты: Smoke S3, S4; TC-AUTH-001, TC-AUTH-003
- Валидаторы уже есть: `backend/taskflow-backend/src/validators/auth.validator.ts`
- Зависимости JWT/bcrypt подключены в `taskflow-backend/package.json`, но не используются в роутинге
