import { Game } from './Game';
import { randomUUID as v4 } from 'crypto';
import Server from './index';
import { IO_ROOMS, SocketInstance, TRoomInfo } from './types';
import Users, { User } from './Users';
import { Logger } from './Logger';

const roomsDataParse = (rooms: Map<string, Room>): TRoomInfo[] => {
  return Array.from(rooms, (value) => {
    const data = value[1];
    const res: TRoomInfo = {
      key: data.roomId,
      isSingle: data.isSingleGame,
      users: JSON.stringify(data.gamers),
      name: data.name,
    };
    return res;
  });
};

type TRoomUser = {
  score: number;
  level: number;
  userId: string;
};
type TRoomParams = {
  isSingleGame: boolean;
  roomName: string;
  createdBy: User;
};

abstract class GameRoom {
  protected constructor(protected spectators: string) {}
}

export class Room {
  public isSingleGame: boolean;
  public gamers: User[] = [];
  private users = new Users();
  private game: Game;
  constructor(params: TRoomParams, public roomId: string, public name: string) {
    this.isSingleGame = params.isSingleGame;
    this.game = new Game(roomId);
  }

  addUser = (user: User) => {
    this.gamers.push(user);
  };

  removeUser = (userToRemove: User) => {
    const findUserIndex = this.gamers.findIndex((user) => {
      return user === userToRemove;
    });
    if (findUserIndex === -1) {
      return false;
    } else {
      this.gamers.splice(findUserIndex, 1);
      return true;
    }
  };

  updateStatusUsers = () => {
    if (this.gamers.length === 0) {
      this.game.stopGame();
    }
  };
}

export default class Rooms {
  static readonly rooms: Map<string, Room> = new Map<string, Room>();
  constructor(private io = Server.io, private logger = new Logger(), private users = new Users()) {
    // this.io.on('createRoom', () => {});
    console.log('rooms init');
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.addRoom({ roomName: 'kekw', isSingleGame: false, createdBy: undefined });
      this.updateRoomInfo();
    }, 3000);

    setInterval(() => {
      // const rooms = io.adapter.rooms;
      // const rooms = io.of('/').adapter.rooms;
      // console.log(rooms);
    }, 5000);
  }

  addListener = (toSocketId: string) => {
    const roomsList = roomsDataParse(Rooms.rooms);
    // setTimeout(() => {
    this.io.of('/').to(toSocketId).emit('updateRoomList', roomsList);
    // }, 100);
  };

  updateRoomInfo = () => {
    const roomsList = roomsDataParse(Rooms.rooms);
    this.io.in(IO_ROOMS.ROOMS).emit('updateRoomList', roomsList);
  };

  addRoom = (params: TRoomParams) => {
    const roomId = `GameRoom:${v4()}`;
    const game = new Room(
      {
        ...params,
      },
      roomId,
      'some name'
    );
    Rooms.rooms.set(roomId, game);
    this.updateRoomInfo();
    return roomId;
  };

  // Вход игрока в комнату
  joinToRoom = ({ socket, roomId }: { socket: SocketInstance; roomId: string }) => {
    const room = Rooms.rooms.get(roomId);
    const user = Users.users.get(socket.id);
    if (!user) {
      this.logger.setMessage({ header: 'user not found', params: { id: socket.id } });
      return;
    }
    if (room) {
      this.logger.setMessage({ header: 'user joined to room', params: { roomId: room.roomId } });
      room.addUser(user);
      socket.join(room.roomId);
      socket.on('disconnect', () => {
        this.logger.setMessage({ header: 'user removed from room', params: { roomId: room.roomId } });
        this.removeFromRoom({ user, room });
      });
      return room;
    } else {
      this.logger.setMessage({ header: 'room not found', params: { roomId } });
    }
  };
  // Удаление игрока из списков по ссылкам
  private removeFromRoom = ({ user, room }: { user: User; room: Room }) => {
    const isRemoved = room.removeUser(user);
    if (isRemoved) {
      this.logger.setMessage({
        header: '[removeFromRoom] User removed from room',
        params: { room: room.roomId, user: user.name },
      });
    } else {
      this.logger.setMessage({
        header: '[removeFromRoom] User not removed from room',
        params: { room: room.roomId, user: user.name },
      });
    }
  };
  // Удаление игрока по socketId
  removeFromRoomByIds = ({ socketId, roomId }: { socketId: string; roomId: string }) => {
    const user = this.users.getUserData(socketId);
    const room = Rooms.rooms.get(roomId);
    if (!user) {
      this.logger.setMessage({ header: '[removeFromRoomByIds] User not found', params: { user } });
      return;
    }
    if (!room) {
      this.logger.setMessage({ header: '[removeFromRoomByIds] Room not found', params: { room } });
      return;
    }
    this.removeFromRoom({ user, room });
  };
  // Добавление пользователя в обзорщики
  addSpectator = (socket: SocketInstance, roomId: string) => {
    const room = Rooms.rooms.get(roomId);
    if (room) {
      socket.join(room.roomId);
      this.logger.setMessage({ header: `User ${socket.id} join to ${room.roomId}` });
      socket.on('disconnect', () => {
        this.logger.setMessage({ header: `User ${socket.id} disconnected from ${room.roomId}` });
        socket.leave(room.roomId);
      });
      return roomId;
    }
    return undefined;
  };
  removeSpectator = (socket: SocketInstance, roomId: string) => {
    const room = Rooms.rooms.get(roomId);
    if (room) {
      this.logger.setMessage({ header: `User ${socket.id} disconnected from ${room.roomId}` });
      socket.leave(room.roomId);
      return true;
    }
    return false;
  };
}
