import Server from './index';
import { TLoggerMessage } from './types';

export class Logger {
  static logs: TLoggerMessage[] = [];

  setMessage = (msg: TLoggerMessage) => {
    Server.io.to('logger').emit('updateLogs', msg);
    Logger.logs.push(msg);
  };
}
