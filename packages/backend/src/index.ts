import express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import cors from 'cors';
import { SocketInit } from './Socket';
import { SocketEvents } from './types';

const app = express();
app.use(cors());

export class Server {
  constructor(
    public httpServer = http.createServer(app),
    // eslint-disable-next-line @typescript-eslint/ban-types
    public io = new socketio.Server<SocketEvents.ClientToServerEvents, SocketEvents.ServerToClientEvents>(httpServer, {
      cors: {
        origin: '*',
      },
    })
  ) {
    this.httpServer.listen(3001);
    SocketInit(this.io);
  }
}

const serv = new Server();
