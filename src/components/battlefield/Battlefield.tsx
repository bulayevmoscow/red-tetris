import React, {
  FC,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { tetraminoField } from '@/utils/tetraminos';
import { TBattlefieldCells } from '@/utils/types';
import style from './Battlefield.module.scss';

const CellWrapper: FC<{
  battlefieldMap: TBattlefieldCells;
}> = ({ battlefieldMap }) => {
  return (
    <div>
      {battlefieldMap.map((row, rowIndex) => {
        return (
          <div
            key={rowIndex}
            className={style.cell_wrapper_row}
          >
            {row.map((cellValue, cellIndex) => {
              return (
                <div
                  key={cellIndex}
                  className={style.cell_wrapper_cell}
                  data-celltype={cellValue}
                />
              );
            })}
          </div>
        );
      })}
      {/*{[battlefieldMap[0]].map((row, rowIndex) => {*/}
      {/*  return (*/}
      {/*    <div key={rowIndex}>*/}
      {/*      {row.map((cellValue, cellIndex) => {*/}
      {/*        return <div key={cellIndex}>{cellValue}</div>;*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*  );*/}
      {/*})}*/}
    </div>
  );
};

export const Battlefield = () => {
  const setUpdate = useReducer((x) => !x, false)[1];
  const ref = useRef(new tetraminoField(true, setUpdate));
  const { addFigure } = useMemo(() => {
    return ref.current;
  }, [ref.current]);
  return (
    <div>
      <CellWrapper
        battlefieldMap={ref.current.battlefield}
      />
      <button onClick={setUpdate}>Update</button>
      <button onClick={addFigure}>AddTetramino</button>
      button
      <pre>
        {/*{JSON.stringify(*/}
        {/*  ref.current.battlefield,*/}
        {/*  null,*/}
        {/*  '\t'*/}
        {/*)}*/}
      </pre>
    </div>
  );
};
