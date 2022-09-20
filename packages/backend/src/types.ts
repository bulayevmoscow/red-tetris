export type TChatMessage = {
  id: number;
  date: Date;
  user: string;
  message: string;
};

export type TLoggerMessage = { header: string; params?: Record<string, any> };

export namespace SocketEvents {
  export type ServerToClientEvents = {
    chatHistory: (arg: TChatMessage[]) => void;
    newMessages: (arg: TChatMessage) => void;
    updateChat: (arg: TChatMessage[]) => void;
    updateLogs: (arg: TLoggerMessage) => void;
  };
  export type ClientToServerEvents = {
    sendMessage: (arg: Pick<TChatMessage, 'message'>) => void;
    // test
    getAllUsers: () => any;
  };
}
