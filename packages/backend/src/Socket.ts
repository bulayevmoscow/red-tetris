import Server from './index';
import Users from './Users';
import Chat from './Chat';
import Rooms from './Room';
import { IO_ROOMS } from './types';

export class SocketInit {
  constructor(private io = Server.io, private users = new Users(), private chat = Chat, private rooms = new Rooms()) {
    this.rooms.on('roomsListUpdate', (rooms) => {
      io.of('/').to(IO_ROOMS.ROOMS).emit('updateRoomList', rooms);
    });
    this.io.on('connection', (socket) => {
      const socketId = socket.id;
      if (socket.handshake.query.name && users.createUser(socketId, String(socket.handshake.query.name))) {
        console.log('userIsCreated');
        socket.join(IO_ROOMS.ROOMS);

        // Отправляем список комнат
        io.to(socketId).emit('updateRoomList', this.rooms.getRooms());

        // this.rooms.add(socket.id);
      } else {
        socket.disconnect();
        console.log('user is exitst');
      }
      socket.on('disconnect', () => {
        users.removeUser({ socketId: socket.id });
      });
      socket.on('getAllUsers', () => {
        return '123';
      });
      socket.on('createRoom', ({ roomName, isSingleGame }, cb) => {
        const user = this.users.getUserBySocketId(socket.id);
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

      socket.on('addGamerToRoom', ({ roomId }, cb) => {
        const room = this.rooms.addGamerToRoom({ socketId, roomId });
        cb({ isSuccess: !!room });
      });

      socket.on('leaveGamerFromRoom', ({ roomId }) => {
        this.rooms.removeGamerFromRoomById({
          roomId,
          socketId: socket.id,
        });
      });

      // socket.on('joinToRoomAsSpectator', ({ roomId }, callback) => {
      //   callback(this.rooms.addSpectator(socket, roomId));
      // });
      // socket.on('leaveToRoomAsSpectator', ({ roomId }, callback) => {
      //   callback(this.rooms.removeSpectator(socket, roomId));
      // });

      socket.emit('chatHistory', this.chat.getHistory());
      socket.join('chat');
      socket.join('logger');

      socket.on('sendMessage', ({ message }) => {
        if (message) {
          const user = this.users.getUserBySocketId(socket.id);
          const msg = this.chat.addMessage(user?.name ?? 'someUser', message);
          io.in('chat').emit('updateChat', [msg]);
        }
      });
    });
  }
}
