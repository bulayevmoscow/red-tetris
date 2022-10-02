import express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import cors from 'cors';
import { SocketInit } from './Socket';
import { SocketEvents } from './types';

const app = express();
app.use(cors());
const httpServer = http.createServer(app);

export default class Server {
  static readonly io = new socketio.Server<SocketEvents.ClientToServerEvents, SocketEvents.ServerToClientEvents>(
    httpServer,
    {
      cors: {
        origin: '*',
      },
    }
  );
  static Room = require('./Room');
  static Users = require('./Users');

  constructor() {
    new SocketInit();
  }
}

new Server();
httpServer.listen(3001);
