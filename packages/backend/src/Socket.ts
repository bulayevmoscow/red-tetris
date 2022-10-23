import Server from './index';
import Users, { User } from './Users';
import Chat from './Chat';
import Rooms from './Room';
import { IO_ROOMS, TChatResponse, TRoomInfo } from './types';
import { EventReceiver } from './utils/EmitterFactory';

export class SocketInit {
  constructor(
    private io = Server.io,
    private users = new Users(),
    private chat = new Chat(),
    private rooms = new Rooms()
  ) {
    this.rooms.addRoom({roomName: '123', createdBy: undefined as unknown as User, isSingleGame: true})
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

      socket.on('removeGamerFromRoom', ({ roomId }) => {
        this.rooms.removeGamerFromRoomById({
          roomId,
          socketId: socket.id,
        });
      });

      socket.on('addSpectatorToRoom', ({roomId}, cb) => {
        const {disconnectCallback, status}  = this.rooms.addSpectator({roomId, socketId});
        cb(roomId);
      })

      socket.on('removeSpectatorFromRoom', ({roomId}) => {
        this.rooms.removeSpectator({roomId, socketId});
      })


      const updateChatEmitter: EventReceiver<TChatResponse[]> = (messages) => {
        console.log('updateChat', messages.length);
        // socket.emit('updateChat', messages);
        io.in(IO_ROOMS.CHAT).emit('updateChat', messages);
      };

      const updateRoomListEmitter: EventReceiver<TRoomInfo[]> = (args) => {
        console.log('updateRoomListEmitter', Date.now());
        // console.log(args);
      }

      this.chat.on('updateChat', updateChatEmitter);
      this.rooms.on('roomsListUpdate', updateRoomListEmitter);


      socket.on('sendMessage', ({ message }) => {
        const user = this.users.getUserBySocketId(socket.id);
        if (message && user) {
          this.chat.addMessage(user?.name ?? 'someUser', message);
        }
      });



      setTimeout(() => {
        socket.join(IO_ROOMS.ROOMS);
        socket.join(IO_ROOMS.CHAT);
        // Отправить пользователю исторю сообщений
        this.chat.getHistory();
        socket.join(IO_ROOMS.LOGGERS);
        this.rooms.updateRoomInfo();
        console.log('user rooms is', [...socket.rooms.keys()]);
      }, 300);

      socket.on('disconnect', () => {
        this.chat.off('updateChat', updateChatEmitter);
        this.rooms.off('roomsListUpdate', updateRoomListEmitter);
      });
    });
  }
}
