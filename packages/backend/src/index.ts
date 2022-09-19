import express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

class Server {
  constructor(
    public httpServer = http.createServer(app),
    public io = new socketio.Server(httpServer, {
      cors: {
        origin: '*',
      },
    })
  ) {
    //  some
    this.io.on('connection', (socket) => {
      // ...
      console.log('connected');
    });
    this.httpServer.listen(3001);
  }
}

const serv = new Server();
