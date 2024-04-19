import express from 'express';
import router from './routes/index';
import * as http from 'http';
import * as WebSocket from 'ws';

const port = 3000;

const app = express();
export const server = http.createServer(app);
export const ws = new WebSocket.Server({ server });

app.use(express.json());
app.use('/api', router);

server.listen(port, () => console.log(`Started at http://localhost:${port}`));