import { Game } from './Game';
import { randomUUID as v4 } from 'crypto';
import Server from './index';
import { IO_ROOMS, SocketInstance, TRoomInfo } from './types';
import Users, { User } from './Users';
import { Logger } from './Logger';
import { EventEmitter } from 'events';
import { EmitterFactory } from './utils/EmitterFactory';
import { socket } from 'red-tetris-frontend/src/providers/socketIoAdapter';

type RoomEvents = {
  hello: 'listener';
};

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

export class Room extends EmitterFactory<{ roomListUpdate: User[] }> {
  readonly isSingleGame: boolean;
  readonly gamers: User[] = [];
  readonly spectators: User[] = [];
  readonly game: Game;
  readonly logger = new Logger();

  constructor(params: TRoomParams, public roomId: string, public name: string) {
    super();
    this.isSingleGame = params.isSingleGame;
    this.game = new Game(roomId);
  }

  updateGamersList = () => {
    this.emit('roomListUpdate', this.gamers);
  };

  addGamer = (user: User): boolean => {
    // Для одиночной игры
    if (this.isSingleGame) {
      if (this.gamers.length >= 1) {
        this.logger.setMessage({ header: '[Room] AddGamer in single game was end with error, too many users ' });
        return false;
      } else {
        this.logger.setMessage({
          header: '[Room] AddGamer in single game was end with success',
          params: { user: user.name },
        });
        this.gamers.push(user);
      }
      //  Для многопользовательской игры
    } else {
      if (this.gamers.length >= 2) {
        this.logger.setMessage({ header: '[Room] AddGamer in multiplayer game was end with error, too many users ' });
        return false;
      } else {
        this.logger.setMessage({
          header: '[Room] AddGamer in multiplayer game was end with success',
          params: { user: user.name },
        });
        this.gamers.push(user);
      }
    }
    this.updateGamersList();
    return true;
  };

  addSpectators = (user: User) => {
    this.logger.setMessage({
      header: '[Room] AddGamer add Spectator',
      params: { user: user.name },
    });
    this.spectators.push(user);
  };

  removeGamer = (user: User) => {
    const userIndex = this.gamers.indexOf(user);
    if (userIndex !== -1) {
      this.logger.setMessage({
        header: '[Room] remove gamer success',
        params: { user: user.name },
      });
      this.gamers.splice(userIndex, 1);
      this.updateGamersList();
      return true;
    } else {
      this.logger.setMessage({
        header: '[Room] remove gamer error',
        params: { user: user.name },
      });
      return false;
    }
  };

  removeSpectators = (user: User) => {
    const userIndex = this.spectators.indexOf(user);
    if (userIndex !== -1) {
      this.logger.setMessage({
        header: '[Room] remove spectator success',
        params: { user: user.name },
      });
      this.spectators.splice(userIndex, 1);
      return true;
    } else {
      this.logger.setMessage({
        header: '[Room] remove spectator error',
        params: { user: user.name },
      });
      return false;
    }
  };
}

export default class Rooms extends EmitterFactory<{ roomsListUpdate: TRoomInfo[] }> {
  static readonly rooms: Map<string, Room> = new Map<string, Room>();
  constructor(private logger = new Logger(), private users = new Users()) {
    super();
    console.log('roomsInit');
  }

  // addListener = (toSocketId: string) => {
  //   const roomsList = roomsDataParse(Rooms.rooms);
  //   // setTimeout(() => {
  //   this.io.of('/').to(toSocketId).emit('updateRoomList', roomsList);
  //   // }, 100);
  // };

  getRooms = (): TRoomInfo[] => {
    return roomsDataParse(Rooms.rooms);
  };

  updateRoomInfo = () => {
    this.emit('roomsListUpdate', this.getRooms());
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
    game.on('roomListUpdate', (User) => {
      console.log('Event');
    });
    this.updateRoomInfo();
    return roomId;
  };

  // Вход игрока в комнату
  addGamerToRoom = ({ socketId, roomId }: { socketId: string; roomId: string }) => {
    const room = Rooms.rooms.get(roomId);
    const user = this.users.getUserBySocketId(socketId);
    if (!user) {
      this.logger.setMessage({ header: 'user not found', params: { socketId } });
      return;
    }
    if (room) {
      this.logger.setMessage({ header: 'user joined to room', params: { roomId: room.roomId } });
      room.addGamer(user);
      return room;
    } else {
      this.logger.setMessage({ header: 'room not found', params: { roomId } });
    }
  };
  // Удаление игрока из списков по ссылкам
  private removeGamerFromRoom = ({ user, room }: { user: User; room: Room }) => {
    const isRemoved = room.removeGamer(user);
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
  removeGamerFromRoomById = ({ socketId, roomId }: { socketId: string; roomId: string }) => {
    const user = this.users.getUserBySocketId(socketId);
    const room = Rooms.rooms.get(roomId);
    if (!user) {
      this.logger.setMessage({ header: '[removeFromRoomByIds] User not found', params: { user } });
      return;
    }
    if (!room) {
      this.logger.setMessage({ header: '[removeFromRoomByIds] Room not found', params: { room } });
      return;
    }
    this.removeGamerFromRoom({ user, room });
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
