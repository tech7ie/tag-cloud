import * as WebSocket from 'ws';
import { ws } from '../app';


export function broadcast(data: string): void {
  try {
    ws.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  } catch (e) {}
}