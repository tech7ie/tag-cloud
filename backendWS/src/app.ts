import express, { Request, Response } from 'express';
import router from './routes/index';
import * as http from 'http';
import pool from './database/db';
import cors from 'cors';
import dotenv from 'dotenv';
import checkToken from './middleware/auth';

dotenv.config();

const port = 3000;

const app = express();
export const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api', router);

import { ServerResponse } from 'http';
let clients: ServerResponse[] = [];

app.get('/events', (req: Request, res: ServerResponse) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

server.listen(port, () => console.log(`Started at http://localhost:${port}`));

export { clients };
