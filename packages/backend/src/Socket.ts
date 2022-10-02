import Server from './index';
import Users from './Users';
import Chat from './Chat';
import Rooms from './Room';
import { IO_ROOMS } from './types';

export class SocketInit {
  constructor(private io = Server.io, private users = new Users(), private chat = Chat, private rooms = new Rooms()) {
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
      socket.on('createRoom', ({ roomName, isSingleGame }, cb) => {
        const user = this.users.getUserData(socket.id);
        let roomId = '';
        console.log(user);
        if (user && user?.name) {
          roomId = this.rooms.addRoom({
            roomName,
            createdBy: user,
            isSingleGame,
          });
        }
        cb({ roomId, isSuccess: roomId !== '' });
      });

      socket.on('joinToRoom', ({ roomId }, cb) => {
        const res = this.rooms.joinToRoom({ socket, roomId });
        cb({ isSuccess: !!res });
      });

      socket.on('leaveFromRoom', ({ roomId }) => {
        this.rooms.removeFromRoomByIds({
          roomId,
          socketId: socket.id,
        });
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
