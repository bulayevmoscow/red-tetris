import { figuresSymbols } from '@/utils/tetraminos';

type valueOf<T> = T[keyof T];

export type TBattlefieldCells = (valueOf<typeof figuresSymbols> | 0)[][];
