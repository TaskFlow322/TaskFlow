# [BUG-002] Docker Engine недоступен после переустановки

| Поле | Значение |
|------|----------|
| **Дата** | 2026-06-08 |
| **Автор** | QA |
| **Приоритет** | High |
| **Статус** | Open |
| **Модуль** | Docker / DevOps |
| **Окружение** | Windows 10, Docker Desktop 29.5.2 |

---

## Описание

После переустановки Docker Desktop CLI установлен (`docker --version` работает), но Docker Engine не отвечает. Команды `docker ps` и `docker compose up` возвращают 500 Internal Server Error.

---

## Шаги воспроизведения

1. Открыть PowerShell в корне проекта `TaskFlow`
2. Выполнить `docker ps`
3. Выполнить `docker compose up -d`

---

## Ожидаемый результат

- Docker Engine в статусе Running
- Контейнеры postgres, redis, backend, frontend поднимаются без ошибок

---

## Фактический результат

```
request returned 500 Internal Server Error for API route and version
http://./pipe/dockerDesktopLinuxEngine/v1.54/containers/json
```

`docker compose up -d --build` — та же ошибка.

---

## Окружение

| Параметр | Значение |
|----------|----------|
| OS | Windows 10 (10.0.26200) |
| Docker CLI | 29.5.2 |
| Ветка | `feature/qa-auth-setup` |

---

## Рекомендации

1. Запустить **Docker Desktop** из меню Пуск
2. Дождаться зелёного индикатора **Engine running**
3. При необходимости включить WSL 2: `wsl --install` и перезагрузка
4. Повторить `docker compose up -d` в корне репозитория

---

## Дополнительно

- Связанный пункт чеклиста: Smoke S1
- Smoke S2–S4 через Docker не проверены; health проверен локально через `node server.js`
