import { Server } from './index';
import { TLoggerMessage } from './types';

export class LoggerClass {
  private logs: TLoggerMessage[];
  constructor() {
    this.logs = [];
  }

  setMessage = (msg: TLoggerMessage) => {
    Server.io.to('logger').emit('updateLogs', msg);
    this.logs.push(msg);
  };
}
