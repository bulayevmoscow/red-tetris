import { TGameActionKeys } from './types';
import Rooms from './Room';
import { User } from './Users';
import Server from './index';

class GameRoom {}

const ENV_GAME = { width: 10, height: 20, delayUpdate: 100, maxLevel: 12 };

export class Game {
  private battlefield = 0;
  private gameInterval: NodeJS.Timer | undefined;
  constructor(private roomId: string, private io = Server.io) {
    setTimeout(() => {
      // this.startGame();
    }, 1000);
  }

  sendStateToUsersInRoom = (battlefield: number) => {
    // @ts-ignore
    this.io.in(this.roomId).emit('battlefield', battlefield);
    console.log('tick', battlefield);
  };

  startGame = () => {
    this.gameInterval = setInterval(() => {
      this.sendStateToUsersInRoom(this.battlefield++);
    }, 1000);
  };

  stopGame = () => {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
  };
}
