import React, { FC } from 'react';
import { TBattlefieldCells } from '@/utils/types';
import style from './Battlefield.module.scss';
import { useBattlefield } from '@/components/battlefield/useBattlefield';

const CellWrapper: FC<{
  battlefieldMap: TBattlefieldCells;
}> = ({ battlefieldMap }) => {
  return (
    <div>
      {battlefieldMap.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className={style.cell_wrapper_row}>
            {row.map((cellValue, cellIndex) => {
              return <div key={cellIndex} className={style.cell_wrapper_cell} data-celltype={cellValue} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const Battlefield = () => {
  console.log('updated');
  const { rotateTetramino, moveTetramino, startGame, setUpdate, refBattleField } = useBattlefield();
  return (
    <div>
      <CellWrapper battlefieldMap={refBattleField.current.battlefield} />
      <button onClick={setUpdate}>Update</button>
      <button onClick={startGame}>start game</button>
      <button onClick={() => moveTetramino('left')}>left</button>
      <button onClick={() => moveTetramino('right')}>right</button>
      <button onClick={() => moveTetramino('right')}>right</button>
      <button onClick={() => rotateTetramino()}>rotate</button>

      {/*<pre onKeyDown={() => console.log('123')}>{JSON.stringify(refBattleField.current.battlefield, null, '\t')}</pre>*/}
    </div>
  );
};
