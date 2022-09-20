import { TLoggerMessage } from './Logger';

export type TChatMessage = {
  id: number;
  date: Date;
  user: string;
  message: string;
};

export namespace SocketEvents {
  export type ServerToClientEvents = {
    chatHistory: (arg: TChatMessage[]) => void;
    newMessages: (arg: TChatMessage) => void;
    updateChat: (arg: TChatMessage[]) => void;
  };
  export type ClientToServerEvents = {
    sendMessage: (arg: Pick<TChatMessage, 'message'>) => void;
    // test
    getAllUsers: () => any;
    updateLogs: (arg: TLoggerMessage) => void;
  };
}
