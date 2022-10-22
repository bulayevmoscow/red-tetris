import Server from './index';
import Users from './Users';
import Chat from './Chat';
import Rooms from './Room';
import { IO_ROOMS, TChatResponse } from './types';
import { EventReceiver } from './utils/EmitterFactory';

export class SocketInit {
  constructor(
    private io = Server.io,
    private users = new Users(),
    private chat = new Chat(),
    private rooms = new Rooms()
  ) {
    this.rooms.on('roomsListUpdate', (rooms) => {
      io.of('/').to(IO_ROOMS.ROOMS).emit('updateRoomList', rooms);
    });
    this.io.on('connection', (socket) => {
      const socketId = socket.id;
      if (socket.handshake.query.name && users.createUser(socketId, String(socket.handshake.query.name))) {
        console.log('userIsCreated');
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

      const updateChatEmitter: EventReceiver<TChatResponse[]> = (messages) => {
        console.log('updateChat', messages.length);
        // socket.emit('updateChat', messages);
        io.in(IO_ROOMS.CHAT).emit('updateChat', messages);
      };

      this.chat.on('updateChat', updateChatEmitter);

      // setInterval(() => {
      //   socket.emit('updateChat', [{ user: '123', date: new Date(), message: '1111' }]);
      // }, 5000);

      socket.on('sendMessage', ({ message }) => {
        const user = this.users.getUserBySocketId(socket.id);
        if (message && user) {
          this.chat.addMessage(user?.name ?? 'someUser', message);
        }
      });

      //  socket init

      // Отправляем список комнат
      // io.to(socketId).emit('updateRoomList', this.rooms.getRooms());

      // this.rooms.add(socket.id);
      setTimeout(() => {
        socket.join(IO_ROOMS.ROOMS);
        socket.join(IO_ROOMS.CHAT);
        socket.join(IO_ROOMS.LOGGERS);
        this.chat.getHistory();
        console.log('user rooms is', [...socket.rooms.keys()]);
      }, 100);

      socket.on('disconnect', () => {
        this.chat.off('updateChat', updateChatEmitter);
      });
    });
  }
}
