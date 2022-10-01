import { Game } from './Game';
import { randomUUID as v4 } from 'crypto';
import { Server } from './index';
import { IO_ROOMS, TRoomInfo } from './types';

type TRoomUser = {
  score: number;
  level: number;
  game: Game;
  userId: string;
};
type TRoomParams = {
  isSingleGame: boolean;
  roomName: string;
  createdBy: string;
};

class Room {
  private listeners: string[];
  public isSingleGame: boolean;
  public users: TRoomUser[];
  constructor(params: TRoomParams, public roomId: string, public name: string) {
    this.listeners = [];
    this.users = [];
    this.isSingleGame = params.isSingleGame;
  }

  addUser = (userId: string) => {
    this.users.push({
      userId,
      game: new Game({ updateState: () => undefined }),
      level: 0,
      score: 0,
    });
  };
}

const roomsDataParse = (rooms: Map<string, Room>): TRoomInfo[] => {
  return Array.from(rooms, (value) => {
    const data = value[1];
    const res: TRoomInfo = {
      key: data.roomId,
      isSingle: data.isSingleGame,
      users: data.users.length,
      name: data.name,
    };
    return res;
  });
};

export default class Rooms {
  static rooms: Map<string, Room> = new Map<string, Room>();
  constructor(private io = Server.io) {
    // this.io.on('createRoom', () => {});
    console.log('rooms init');
    setTimeout(() => {
      this.addRoom({ roomName: 'kekw', isSingleGame: false, createdBy: 'admin' });
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

  removeRoom = () => {
    // createRoom
  };
}
