const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
const port = process.env.PORT || 7070;

app.use(cors());
app.use(express.json());

let tickets = [
  {
    id: randomUUID(),
    name: 'Поменять картридж в принтере, ком. 404',
    status: false,
    description: 'Принтер HP LJ-1210, картриджи есть на складе',
    created: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: randomUUID(),
    name: 'Переустановить Windows, PC-Hall24',
    status: false,
    description: '',
    created: Date.now() - 1000 * 60 * 60 * 18,
  },
  {
    id: randomUUID(),
    name: 'Настроить VPN для удалённого сотрудника',
    status: true,
    description: 'Нужно проверить доступ в корпоративную сеть и выдать инструкцию',
    created: Date.now() - 1000 * 60 * 40,
  },
];

function sendJson(response, statusCode, data) {
  response.status(statusCode).json(data);
}

function makeShortTicket(ticket) {
  return {
    id: ticket.id,
    name: ticket.name,
    status: ticket.status,
    created: ticket.created,
  };
}

function parseStatus(value) {
  if (value === 'true' || value === true) {
    return true;
  }

  if (value === 'false' || value === false) {
    return false;
  }

  return Boolean(value);
}

function findTicket(id) {
  return tickets.find((ticket) => ticket.id === id);
}

app.use((request, response) => {
  const action = request.query.method;
  const { id } = request.query;

  switch (action) {
    case 'allTickets':
      sendJson(response, 200, tickets.map(makeShortTicket));
      return;

    case 'ticketById': {
      const ticket = findTicket(id);

      if (!ticket) {
        sendJson(response, 404, { message: 'Ticket not found' });
        return;
      }

      sendJson(response, 200, ticket);
      return;
    }

    case 'createTicket': {
      const { name, description = '', status = false } = request.body || {};

      if (!name || !name.trim()) {
        sendJson(response, 400, { message: 'Ticket name is required' });
        return;
      }

      const ticket = {
        id: randomUUID(),
        name: name.trim(),
        description: description.trim(),
        status: parseStatus(status),
        created: Date.now(),
      };

      tickets.push(ticket);
      sendJson(response, 201, ticket);
      return;
    }

    case 'updateById': {
      const ticket = findTicket(id);

      if (!ticket) {
        sendJson(response, 404, { message: 'Ticket not found' });
        return;
      }

      const { name, description, status } = request.body || {};

      if (typeof name === 'string' && name.trim()) {
        ticket.name = name.trim();
      }

      if (typeof description === 'string') {
        ticket.description = description.trim();
      }

      if (typeof status !== 'undefined') {
        ticket.status = parseStatus(status);
      }

      sendJson(response, 200, ticket);
      return;
    }

    case 'deleteById': {
      const ticket = findTicket(id);

      if (!ticket) {
        sendJson(response, 404, { message: 'Ticket not found' });
        return;
      }

      tickets = tickets.filter((item) => item.id !== id);
      response.status(204).end();
      return;
    }

    default:
      sendJson(response, 404, { message: 'Unknown method' });
  }
});

app.listen(port, () => {
  console.log(`HelpDesk backend started on http://localhost:${port}`);
});
