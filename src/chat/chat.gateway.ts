import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll() {
    console.log('events');
    return '123';
  }

  @SubscribeMessage('identity')
  async identity() {
    console.log('identity');

    return '1234';
  }
}
