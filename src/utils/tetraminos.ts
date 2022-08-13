import { TBattlefieldCells } from '@/utils/types';
import { initBattleField } from '@/utils/utils';

export const figuresSymbols = {
  square: 's',
  line: 'l',
} as const;

const BATTLEFIELD_ENV = {
  width: 10,
  height: 20,
};

const createTetramino = (
  s: keyof typeof figuresSymbols
): TBattlefieldCells => {
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

export class tetraminoField {
  public battlefield: TBattlefieldCells;
  public updateComponent: () => void;

  constructor(
    public gameIsRunning = true,
    updateComponent?: () => void,
    private currentFigure?: TBattlefieldCells
  ) {
    this.battlefield = initBattleField();
    this.updateComponent = updateComponent
      ? updateComponent
      : () => undefined;
    this.currentFigure = undefined;
  }

  private getLog = () => {
    console.log(this.battlefield);
  };

  private validate = () => {
    // this.gameIsRunning = false;
  };
  private inputTetramino = (offset: {
    x: number;
    y: number;
  }) => {
    this.currentFigure?.forEach((row, indexRow) => {
      row.forEach((value, indexCell) => {
        if (value !== 0) {
          this.battlefield[indexRow][indexCell] = value;
        }
      });
    });
    this.updateComponent();
  };

  public addFigure = () => {
    //  TODO MAKE VALIDATE

    // TODO GENERATE RANDOM FIGURE
    const typeFigure: keyof typeof figuresSymbols = 'line';
    this.currentFigure = createTetramino(typeFigure);
    this.inputTetramino({ x: 5, y: 0 });
  };
}

// const test = new tetraminoField(cb);
