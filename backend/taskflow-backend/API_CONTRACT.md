# TaskFlow API Contract

> **Версия:** 1.0.0  
> **Base URL:** `http://localhost:3000/api`  
> **Формат:** JSON  
> **Аутентификация:** Bearer JWT Token

---

## Общие принципы

- Все ответы имеют структуру: `{ success: boolean, data?, message?, error? }`
- Ошибки: `{ success: false, error: { message: string } }`
- Успех: `{ success: true, data: {...}, message: "..." }`
- Дата/время: ISO 8601 (`2024-01-15T10:30:00.000Z`)
- Пагинация: query params `?page=1&limit=20`

---

## 🏥 Health

### `GET /api/health`
Проверка состояния сервера и БД.

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "development",
  "services": {
    "database": "connected",
    "api": "running"
  }
}
```

---

## 👤 Auth

### `POST /api/auth/register`
Регистрация нового пользователя.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "john_doe",
      "fullName": "John Doe",
      "role": "MEMBER",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGci..."
  },
  "message": "User registered successfully"
}
```

### `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "role": "MEMBER" },
    "token": "eyJhbGci..."
  }
}
```

### `GET /api/auth/me` 🔒
Получить текущего пользователя (требует токен).

**Headers:** `Authorization: Bearer <token>`

---

## 📋 Projects (День 4)

### `GET /api/projects` 🔒
Список проектов пользователя. Query: `?page=1&limit=20`

### `POST /api/projects` 🔒
```json
{
  "name": "My Project",
  "description": "Project description",
  "color": "#6366f1"
}
```

### `GET /api/projects/:id` 🔒
### `PUT /api/projects/:id` 🔒
### `DELETE /api/projects/:id` 🔒

---

## ✅ Tasks (День 5)

### `GET /api/projects/:projectId/tasks` 🔒
Query: `?status=TODO&assigneeId=uuid&search=fix&page=1&limit=20`

### `POST /api/projects/:projectId/tasks` 🔒
```json
{
  "title": "Fix bug #123",
  "description": "...",
  "status": "TODO",
  "priority": "HIGH",
  "assigneeId": "uuid",
  "dueDate": "2024-02-01T00:00:00.000Z"
}
```

**Статусы задач:** `TODO | IN_PROGRESS | REVIEW | DONE`  
**Приоритеты:** `LOW | MEDIUM | HIGH | URGENT`

### `GET /api/tasks/:id` 🔒
### `PUT /api/tasks/:id` 🔒
### `DELETE /api/tasks/:id` 🔒
### `PATCH /api/tasks/:id/status` 🔒 — изменить статус (для Kanban drag&drop)

---

## 💬 Comments (День 8)

### `GET /api/tasks/:taskId/comments` 🔒
### `POST /api/tasks/:taskId/comments` 🔒
```json
{ "content": "Comment text" }
```
### `DELETE /api/comments/:id` 🔒

---

## 🔔 WebSocket Events (День 11)

Подключение: `ws://localhost:3000` с токеном в handshake

| Event | Direction | Payload |
|---|---|---|
| `task:created` | server → client | `{ task, projectId }` |
| `task:updated` | server → client | `{ task }` |
| `task:moved` | server → client | `{ taskId, fromStatus, toStatus }` |
| `comment:added` | server → client | `{ comment, taskId }` |
| `notification:new` | server → client | `{ notification }` |

---

## 🔑 Auth Headers

Все защищённые маршруты (🔒) требуют:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |
