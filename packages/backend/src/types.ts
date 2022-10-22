import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type TChatMessage = {
  id: number;
  date: Date;
  user: string;
  message: string;
};

export type TChatResponse = {
  date: Date;
  user: string;
  message: string;
};

export type TLoggerMessage = { header: string; params?: Record<string, any> };

type EventWithKnowledge<RES = undefined, REQ = undefined> = (data: REQ, callback: (responseData: RES) => void) => void;

export type TGameField = number[];

export type TGameActionKeys = { up: boolean; down: boolean; left: boolean; right: boolean };

export const IO_ROOMS = {
  MAIN: '/',
  ROOMS: '/rooms',
  CHAT: '/chat',
  LOGGERS: '/logs',
} as const;

export type TRoomInfo = {
  key: string;
  isSingle: boolean;
  users: string;
  name: string;
};

export type SocketInstance = Socket<
  SocketEvents.ClientToServerEvents,
  SocketEvents.ServerToClientEvents,
  DefaultEventsMap,
  any
>;

export namespace SocketEvents {
  export type ServerToClientEvents = {
    newMessages: (arg: TChatResponse) => void;
    updateChat: (arg: TChatResponse[]) => void;
    updateLogs: (arg: TLoggerMessage) => void;
    updateGame: (arg: TGameField) => void;
    // TODO add TS
    updateRoomList: (args: TRoomInfo[]) => void;
  };
  export type ClientToServerEvents = {
    sendMessage: (arg: Pick<TChatMessage, 'message'>) => void;
    createRoom: EventWithKnowledge<{ isSuccess: boolean; roomId: string }, { roomName: string; isSingleGame: boolean }>;
    // Room
    addGamerToRoom: EventWithKnowledge<{ isSuccess: boolean }, { roomId: string }>;
    leaveGamerFromRoom: EventWithKnowledge<undefined, { roomId: string }>;
    addSpectators: EventWithKnowledge<string | undefined, { roomId: string }>;
    leaveSpectatorFromRoom: EventWithKnowledge<boolean, { roomId: string }>;
    //

    // test
    getAllUsers: () => any;
    gameAction: (arg: TGameActionKeys) => void;
  };
}
