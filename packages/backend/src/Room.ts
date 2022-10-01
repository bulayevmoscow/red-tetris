import { Game } from './Game';
import { randomUUID as v4 } from 'crypto';
import { Server } from './index';
import { IO_ROOMS, TRoomInfo } from './types';
import Users, { User } from './Users';

const roomsDataParse = (rooms: Map<string, Room>): TRoomInfo[] => {
  return Array.from(rooms, (value) => {
    const data = value[1];
    const res: TRoomInfo = {
      key: data.roomId,
      isSingle: data.isSingleGame,
      users: data.gamers.length,
      name: data.name,
    };
    return res;
  });
};

type TRoomUser = {
  score: number;
  level: number;
  game: Game;
  userId: string;
};
type TRoomParams = {
  isSingleGame: boolean;
  roomName: string;
  createdBy: User;
};

class Room {
  public isSingleGame: boolean;
  private users = new Users();
  public gamers: User[];
  constructor(params: TRoomParams, public roomId: string, public name: string) {
    this.isSingleGame = params.isSingleGame;
    this.gamers = [];
  }

  addUser = (userId: string) => {
    const user = this.users.hasUserByName(userId);
    if (user) {
      this.gamers.push(user);
    }
  };
}

export default class Rooms {
  static rooms: Map<string, Room> = new Map<string, Room>();
  constructor(private io = Server.io) {
    // this.io.on('createRoom', () => {});
    console.log('rooms init');
    setTimeout(() => {
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

  joinToRoom = (User: User, RoomId: string) => {
    const room = Rooms.rooms.get(RoomId);

    // if (room) => {
    //   io.to
    // }
  };

  removeRoom = () => {
    // createRoom
  };
}
