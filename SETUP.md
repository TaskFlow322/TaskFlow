# Запуск окружения

## Windows

1. Установить Docker Desktop — docker.com/products/docker-desktop, при установке соглашаться на WSL 2

2. Установить nvm — github.com/coreybutler/nvm-windows/releases, скачать `nvm-setup.exe`

3. Открыть терминал и выполнить:
```
nvm install 20
nvm use 20
node --version
```
Должно показать v20.x.x

4. Настроить Git:
```
git config --global core.autocrlf false
git config --global user.name "Твоё Имя"
git config --global user.email "твой@email.com"
```

5. Клонировать репо:
```
git clone https://github.com/TaskFlow322/TaskFlow.git
cd TaskFlow
```

6. Запустить всё окружение:
```
docker compose up -d
```

7. Проверить что всё работает:
- localhost:3000 — фронтенд
- localhost:5000/api/health — бэкенд
- localhost:5050 — pgAdmin

---

## macOS

1. Установить Homebrew если нет:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Установить nvm:
```
brew install nvm
```

Добавить в `~/.zshrc`:
```
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
```

Перезапустить терминал, затем:
```
nvm install 20
nvm use 20
node --version
```

3. Установить Docker Desktop для Mac — docker.com/products/docker-desktop (выбрать чип — Apple Silicon или Intel)

4. Настроить Git:
```
git config --global core.autocrlf false
git config --global user.name "Твоё Имя"
git config --global user.email "твой@email.com"
```

5. Клонировать репо:
```
git clone https://github.com/TaskFlow322/TaskFlow.git
cd TaskFlow
```

6. Запустить всё окружение:
```
docker compose up -d
```

7. Проверить что всё работает:
- localhost:3000 — фронтенд
- localhost:5000/api/health — бэкенд
- localhost:5050 — pgAdmin

---

## Доступы

| Сервис   | Адрес                | Логин                  | Пароль      |
|----------|----------------------|------------------------|-------------|
| pgAdmin  | localhost:5050       | admin@taskflow.com     | admin123    |
| База     | localhost:5432       | taskflow               | taskflow123 |
| БД       | taskflow_db          | —                      | —           |

---

## Если что-то не работает

**Windows — Docker ругается на WSL 2:**
Открыть Docker Desktop → Settings → Resources → WSL Integration → включить toggle → Apply & Restart

**Windows — порт занят:**
```
netstat -ano | findstr :5000
taskkill /PID номер_процесса /F
```

**macOS — порт занят:**
```
lsof -i :5000
kill -9 номер_процесса
```

**Docker контейнеры не поднимаются:**
```
docker compose down
docker compose up -d
```

**База не подключается:**
Подождать 10-15 секунд после `docker compose up -d`, PostgreSQL стартует не мгновенно.

**Посмотреть логи если что-то не стартует:**
```
docker compose logs postgres
docker compose logs backend
docker compose logs frontend
```
