import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { SocketEvents } from './types';

export const socketOptions = {
  autoConnect: false,
  query: {
    name: 'kekw',
  },
};

export const socket: Socket<SocketEvents.ServerToClientEvents, SocketEvents.ClientToServerEvents> = io(
  'http://localhost:3001',
  socketOptions
);
