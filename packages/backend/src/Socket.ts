import { Server } from './index';
import Users from './Users';
import Chat from './Chat';
import Rooms from './Room';
import { IO_ROOMS } from './types';

export class SocketInit {
  constructor(private io = Server.io, private users = Users, private chat = Chat, private rooms = new Rooms()) {
    this.io.on('connection', (socket) => {
      if (socket.handshake.query.name && users.createUser(socket.id, String(socket.handshake.query.name))) {
        console.log('userIsCreated');
        socket.join(IO_ROOMS.ROOMS);
        console.log(socket.id);
        this.rooms.addListener(socket.id);
      } else {
        socket.disconnect();
        console.log('user is exitst');
      }
      socket.on('disconnect', () => {
        users.removeUser(socket.id);
      });
      socket.on('getAllUsers', () => {
        return '123';
      });
      socket.on('createRoom', ({ roomName, isSingleGame }, callback) => {
        const user = this.users.getUserData(socket.id);
        let roomId = '';
        console.log(user);
        if (user && user?.name) {
          roomId = this.rooms.addRoom({
            roomName,
            createdBy: user.name,
            isSingleGame,
          });
        }

        callback({ roomId, isSuccess: true });
      });

      socket.emit('chatHistory', this.chat.getHistory());
      socket.join('chat');
      socket.join('logger');

      socket.on('sendMessage', ({ message }) => {
        if (message) {
          const user = this.users.getUserData(socket.id);
          const msg = this.chat.addMessage(user?.name ?? 'someUser', message);
          io.in('chat').emit('updateChat', [msg]);
        }
      });
    });
  }
}
