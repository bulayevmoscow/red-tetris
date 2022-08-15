import { useEffect, useMemo, useReducer, useRef } from 'react';
import { TetraminoField } from '@/utils/tetraminos';

export const useBattlefield = () => {
  const setUpdate = useReducer((x) => x, false)[1];

  const ref = useRef(new TetraminoField(true, setUpdate));
  const { startGame, moveTetramino, rotateTetramino } = useMemo(() => {
    return ref.current;
  }, [ref.current]);

  useEffect(() => {
    const event = (e: KeyboardEvent) => {
      const { key } = e;
      console.log(key);
      switch (key) {
        case 'ArrowRight':
          moveTetramino('right');
          break;
        case 'ArrowLeft':
          moveTetramino('left');
          break;
        case 'ArrowUp':
          rotateTetramino();
          break;
        case 'ArrowDown':
          moveTetramino('down');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', event);

    return () => {
      window.removeEventListener('keydown', event);
    };
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  return {
    startGame,
    moveTetramino,
    rotateTetramino,
    setUpdate,
    refBattleField: ref,
  };
};
