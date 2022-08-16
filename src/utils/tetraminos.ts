import { TBattlefieldCells } from '@/utils/types';
import { initBattleField } from '@/utils/utils';
import { BATTLEFIELD_ENV } from '@/config';

const transpose = (arr: TBattlefieldCells) => {
  const arrLen = arr.length;
  for (let i = 0; i < arrLen; i++) {
    for (let j = 0; j < i; j++) {
      const temp = arr[i][j];
      arr[i][j] = arr[j][i];
      arr[j][i] = temp;
    }
  }
  return arr;
};

export const figuresSymbols = {
  square: 's',
  line: 'l',
} as const;

const createTetramino = (s: keyof typeof figuresSymbols): TBattlefieldCells => {
  switch (s) {
    case 'square': {
      const f = figuresSymbols[s];
      return [
        [0, 0, 0, 0],
        [0, f, f, 0],
        [0, f, f, 0],
        [0, 0, 0, 0],
      ];
    }
    case 'line': {
      const f = figuresSymbols[s];
      return [
        [0, f, 0, 0],
        [0, f, 0, 0],
        [0, f, 0, 0],
        [0, f, 0, 0],
      ];
    }
  }
};

type valueOf<T> = T[keyof T];

export class TetraminoField {
  public battlefield: TBattlefieldCells;
  public updateComponent: () => void;
  public offsetCurrentFigure: { x: number; y: number };
  private currentFigure?: TBattlefieldCells;

  constructor(public gameIsRunning = true, updateComponent: () => void) {
    this.battlefield = initBattleField();
    this.updateComponent = () =>
      setTimeout(() => {
        console.log('want to update');
        updateComponent();
      }, 16);
    this.currentFigure = undefined;
    this.offsetCurrentFigure = {
      x: 0,
      y: 0,
    };
  }

  private getLog = () => {
    console.log(this.battlefield);
  };

  private overrideTetraminoOnBattlefield = (add: boolean) => {
    const { x, y } = this.offsetCurrentFigure;
    this.currentFigure?.forEach((row, indexRow) => {
      row.forEach((value, indexCell) => {
        if (value !== 0) {
          this.battlefield[indexRow + y][indexCell + x] = add ? value : 0;
        }
      });
    });
  };

  private checkToMove = ({ x, y }: { x: number; y: number }) => {
    const newPosition = {
      x: x + this.offsetCurrentFigure.x,
      y: y + this.offsetCurrentFigure.y,
    };

    const status = {
      isBlocked: false,
      isCollision: false,
    };

    // Удаляем тетраминку
    this.removeTetramino(false);

    this.currentFigure?.forEach((row, indexRow) => {
      row.forEach((value, indexCell) => {
        if (status.isCollision || status.isBlocked) {
          return;
        }
        if (value !== 0) {
          // Новая позиция блока this.current.figure
          const cellPos = {
            x: newPosition.x + indexCell,
            y: newPosition.y + indexRow,
          };
          console.log(`Can i write on y: ${cellPos.x} x:${cellPos.y} cell`);
          if (cellPos.x < 0 || cellPos.x >= BATTLEFIELD_ENV.width) {
            console.error('WRONG X');
            status.isBlocked = true;
            return;
          }
          if (cellPos.y < 0 || cellPos.y >= BATTLEFIELD_ENV.height) {
            console.error('WRONG Y');
            status.isBlocked = true;
            return;
          }
          // check Collision
          // TODO
          if (this.battlefield[cellPos.y][cellPos.x] !== 0) {
            console.log(`isCollision on x: ${cellPos.x} y: ${cellPos.y} = ${this.battlefield[cellPos.y][cellPos.x]}`);
            console.log(this.battlefield);
            status.isCollision = true;
            console.error('Collision');
          }
        }
      });
    });

    if (!status.isCollision && !status.isBlocked) {
      this.offsetCurrentFigure = { ...newPosition };
      this.addTetramino(true);
    }
    return status;
  };

  private checkToRotate = (figure: TBattlefieldCells) => {
    if (!this.currentFigure) {
      return;
    }
    const rotatedFigure = transpose(figure);
    const offsetCorrector = {
      x: 0,
      y: 0,
    };
    let isError = false;
    let needOffsetCurrent = true;
    let iterations = 0;
    while (needOffsetCurrent && iterations++ < 50) {
      console.log(offsetCorrector);
      isError = false;
      needOffsetCurrent = false;
      rotatedFigure.forEach((row, indexRow) => {
        row.forEach((cell, indexCell) => {
          if (isError || needOffsetCurrent) {
            return;
          }
          if (cell !== 0) {
            const cellPos = {
              x: this.offsetCurrentFigure.x + indexCell + offsetCorrector.x,
              y: this.offsetCurrentFigure.y + indexRow + offsetCorrector.y,
            };
            // eslint-disable-next-line no-debugger
            // debugger;
            if (cellPos.x < 0 || cellPos.x >= BATTLEFIELD_ENV.width) {
              console.error(`[ROTATE]WRONG X ${cellPos.x}`);
              offsetCorrector.x += cellPos.x < 0 ? 1 : -1;
              needOffsetCurrent = true;
            }
            if (cellPos.y < 0 || cellPos.y >= BATTLEFIELD_ENV.height) {
              console.error(`[ROTATE]WRONG Y ${cellPos.y}`);
              isError = true;
            }

            if (this.battlefield?.[cellPos.y]?.[cellPos.x]) {
              console.error(
                `[ROTATE] isCollision on x: ${cellPos.x} y: ${cellPos.y} = ${
                  this.battlefield?.[cellPos.y]?.[cellPos.x]
                }`
              );
              isError = true;
            }
          }
        });
      });
    }

    if (isError) {
      transpose(figure);
    }

    this.offsetCurrentFigure.x += offsetCorrector.x;

    console.log('ITERATIONS', iterations);

    return isError;
  };

  private removeTetramino = (shouldUpdate = true) => {
    this.overrideTetraminoOnBattlefield(false);
    if (shouldUpdate) {
      this.updateComponent();
    }
  };

  private addTetramino = (shouldUpdate = true) => {
    this.overrideTetraminoOnBattlefield(true);
    if (shouldUpdate) {
      this.updateComponent();
    }
  };

  public rotateTetramino = () => {
    if (!this.currentFigure) {
      return;
    }
    this.removeTetramino(false);
    this.checkToRotate(this.currentFigure);
    this.addTetramino(true);
  };

  public moveTetramino = (move: 'right' | 'left' | 'down' | 'up') => {
    switch (move) {
      case 'left':
        this.checkToMove({ x: -1, y: 0 });
        break;
      case 'right':
        this.checkToMove({ x: 1, y: 0 });
        break;
      case 'down':
        this.checkToMove({ x: 0, y: 1 });
        break;
      case 'up':
        this.checkToMove({ x: 0, y: -1 });
        break;
      default:
        break;
    }
    // this.addTetramino(true);
  };

  public startGame = () => {
    //  TODO MAKE VALIDATE
    console.log('start game');
    // TODO GENERATE RANDOM FIGURE
    this.battlefield = initBattleField();
    const typeFigure: keyof typeof figuresSymbols = 'line';
    this.currentFigure = createTetramino(typeFigure);
    this.addTetramino(true);
  };
}

// const test = new tetraminoField(cb);
