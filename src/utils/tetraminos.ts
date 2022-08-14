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

  private validate = () => {
    // this.gameIsRunning = false;
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

    console.log(newPosition);
    if (newPosition.x < 0 || newPosition.x > BATTLEFIELD_ENV.width - (this.currentFigure?.length ?? 0)) {
      return;
    }
    if (newPosition.y < 0 || newPosition.y > BATTLEFIELD_ENV.height - (this.currentFigure?.length ?? 0)) {
      return;
    }

    // const blocked = false;
    // this.currentFigure?.forEach((row, indexRow) => {
    //   row.forEach((value, indexCell) => {
    //     if (this.battlefield[indexRow + y][indexCell + x]);
    //   });
    // });
    this.removeTetramino(false);
    this.offsetCurrentFigure = { ...newPosition };
    this.addTetramino(true);
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
    this.currentFigure = transpose(this.currentFigure);
    this.addTetramino(true);
  };

  public moveTetramino = (move: 'right' | 'left' | 'down') => {
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
      default:
        break;
    }
    // this.addTetramino(true);
  };

  public startGame = () => {
    //  TODO MAKE VALIDATE

    // TODO GENERATE RANDOM FIGURE
    this.battlefield = initBattleField();
    const typeFigure: keyof typeof figuresSymbols = 'line';
    this.currentFigure = createTetramino(typeFigure);
    this.addTetramino();
    // setInterval(() => {
    //   this.moveTetramino('down');
    // }, 500);
  };
}

// const test = new tetraminoField(cb);
