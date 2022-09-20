import { Server } from './index';
import { socket } from 'red-tetris-frontend/src/providers/socketIoAdapter';

export type TLoggerMessage = { header: string; params: Record<string, any> };

export class Logger {
  private logs: TLoggerMessage[];
  constructor(private io: Server['io']) {
    this.logs = [];
  }

  setMessage = (msg: TLoggerMessage) => {
    this.logs.push(msg);
    socket.emit('updateLogs', msg);
  };
}
