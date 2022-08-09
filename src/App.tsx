import React, { useMemo, useState } from 'react';
import {
  StyledTetris,
  StyledTetrisWrapper,
} from './App.styles';

import {
  Stage,
  Display,
  Cell,
  StartButton,
} from './components';

function App() {
  const [dropTime, setDropTime] = useState<
    undefined | number
  >(undefined);
  const [gameOver, setGameOver] = useState(true);

  return (
    <StyledTetrisWrapper role="button" tabIndex={0}>
      <StyledTetris>
        {gameOver ? (
          <>
            <Display
              gameOver={gameOver}
              text={'GAME OVER!'}
            />
            <StartButton callback={() => undefined} />
          </>
        ) : (
          <>
            <Display text={'Score: '} />
            <Display text={'Rows: '} />
            <Display text={'Level: '} />
          </>
        )}
      </StyledTetris>
    </StyledTetrisWrapper>
  );
}

export default App;
