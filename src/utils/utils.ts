import { TBattlefieldCells } from '@/utils/types';
import { BATTLEFIELD_ENV } from '@/config';

export const initBattleField = (): TBattlefieldCells => {
  const { width, height } = BATTLEFIELD_ENV;
  const battlefield = new Array(height).fill([]);
  battlefield.forEach(
    (value, index) =>
      (battlefield[index] = new Array(width).fill(0))
  );
  return battlefield;
};
