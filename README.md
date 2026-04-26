# HelpDesk Backend

Серверная часть для задания **HelpDesk**.

## Деплой

- Frontend опубликован на GitHub Pages: [HelpDesk](https://sergetfep.github.io/helpdesk-frontend/)
- Backend развёрнут на [Railway](helpdesk-backend-production-9472.up.railway.app)

## Запуск

```bash
npm i
npm start
```

Сервер запускается на `http://localhost:7070`.

## Методы API

- `GET ?method=allTickets`
- `GET ?method=ticketById&id=<id>`
- `POST ?method=createTicket`
- `POST ?method=updateById&id=<id>`
- `GET ?method=deleteById&id=<id>`

Все данные передаются и принимаются в JSON.

## Ссылка за задание

[7. Работа с HTTP](https://github.com/netology-code/ahj-homeworks/tree/AHJ-50/http)
