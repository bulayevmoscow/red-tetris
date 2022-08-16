import React, { FC } from 'react';
import { TBattlefieldCells } from '@/utils/types';
import style from './Battlefield.module.scss';
import { TetraminoField } from '@/utils/tetraminos';

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

type MyState = {
  tetris: TetraminoField; // like this
  keyBoardEvent: (e: KeyboardEvent) => void;
};
class Battlefield extends React.Component<Record<never, never>, MyState> {
  forceUpdate(callback?: () => void) {
    super.forceUpdate(callback);
  }
  state: MyState = {
    tetris: new TetraminoField(true, () => this.forceUpdate()),
    keyBoardEvent: (e: KeyboardEvent) => {
      const { key } = e;
      console.log(key);
      switch (key) {
        case 'ArrowRight':
          this.state.tetris.moveTetramino('right');
          break;
        case 'ArrowLeft':
          this.state.tetris.moveTetramino('left');
          break;
        case 'ArrowUp':
          this.state.tetris.rotateTetramino();
          break;
        case 'ArrowDown':
          this.state.tetris.moveTetramino('down');
          break;
        case 'q':
          this.state.tetris.moveTetramino('up');
          break;
        default:
          break;
      }
    },
  };
  componentDidMount() {
    window.addEventListener('keydown', this.state.keyBoardEvent);
    this.state.tetris.startGame();
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.state.keyBoardEvent);
  }

  render() {
    const { startGame, moveTetramino, rotateTetramino } = this.state.tetris;
    return (
      <>
        <CellWrapper battlefieldMap={this.state.tetris.battlefield} />
        <button onClick={startGame}>start game</button>
        <button onClick={() => moveTetramino('left')}>left</button>
        <button onClick={() => moveTetramino('right')}>right</button>
        <button onClick={() => moveTetramino('down')}>down</button>
        <button onClick={() => rotateTetramino()}>rotate</button>
      </>
    );
  }
}

export default Battlefield;
