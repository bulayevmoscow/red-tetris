import { TGameActionKeys } from './types';
import internal from 'stream';

class GameRoom {}

const ENV_GAME = { width: 10, height: 20, delayUpdate: 100, maxLevel: 12 };

export class Game {
  constructor(
    public serverActions: {
      updateState: () => void;
    },
    public gameField: number[] = new Array(ENV_GAME.width * ENV_GAME.height).fill(0),
    public tick = 0,
    public points = 0,
    public level = 0,
    public actions: TGameActionKeys = {
      up: false,
      down: false,
      left: false,
      right: false,
    },
    public gameInterval: NodeJS.Timer | undefined = undefined
  ) {}

  render = (action: any) => {
    //  move blocks
    // this.serverActions.updateState();
  };

  updateTick = () => {
    this.tick++;
  };

  startGame = () => {
    this.gameInterval = setInterval(this.updateTick, ENV_GAME.delayUpdate);
  };

  stopGame = () => {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
  };

  // calculate = () => {
  //   this.tick++;
  //
  //   Object.keys(this.actions).forEach((key) => {
  //     this.actions[key as keyof TGameActionKeys] = false;
  //   });
  // };
  //
  // getGameField = () => {
  //   return this.gameField;
  // };
  //
  // gameAction = (keyofAction: keyof TGameActionKeys) => {
  //   this.actions[keyofAction] = true;
  // };
}
