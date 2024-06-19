import { clients } from '../app';

export function broadcast(data: { word: string }): void {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    client.write(`data: ${message}\n\n`);
  });
}
