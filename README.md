


# Система управления задачами
## Быстрый старт для команды

### Требования
- Docker Desktop (должен быть запущен) 
		https://www.docker.com/products/docker-desktop/
- Git
		https://git-scm.com/


##  Установка и запуск

### 1. Клонируйте репозиторий

```bash
git clone <ссылка_на_репозиторий>
cd taskflow
```

### 2. Запустите все сервисы

```bash
docker-compose up -d
```

### 3. Проверьте, что всё работает

```bash
docker ps
```

Должны быть 4 контейнера: `taskflow-frontend`, `taskflow-backend`, `taskflow-postgres`, `taskflow-pgadmin`

---

## Доступ к сервисам

| Сервис | Адрес | Описание |
|--------|-------|----------|
| Фронтенд | http://localhost:3000 | Интерфейс приложения |
| Бэкенд API | http://localhost:5000/api/health | API сервер (проверка здоровья) |
| pgAdmin | http://localhost:5050 | Управление базой данных |

---

## Доступ к базе данных

**Через pgAdmin (браузер):**

- Email: `admin@taskflow.com`
- Пароль: `admin123`

**Подключение к PostgreSQL (из кода):**

- Хост: `postgres` (внутри Docker) или `localhost` (с хоста)
- Порт: `5432`
- База данных: `taskflow_db`
- Пользователь: `taskflow`
- Пароль: `taskflow123`

---

##  Остановка проекта

```bash
docker-compose down
```

## Просмотр логов

```bash
docker-compose logs -f
```

## Перезапуск после изменений

```bash
docker-compose up --build
```

---

## Структура проекта

```
taskflow/
├── frontend/
│   ├── Dockerfile
│   └── dist/
│       └── index.html
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

_____________________

##  Частые проблемы

**Ошибка "port already in use"**

Закройте программы, которые используют порты 3000, 5000, 5050, 5432

**Контейнер не запускается**

```
docker-compose down
docker-compose up --build
```

**Не могу подключиться к БД**

Подождите 30 секунд после запуска — PostgreSQL инициализируется

