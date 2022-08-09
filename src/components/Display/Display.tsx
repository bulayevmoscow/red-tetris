import React from 'react';
import { StyledDisplay } from './Display.styles';

type Props = {
  gameOver?: boolean;
  text: string;
};

export const Display: React.FC<Props> = ({
  gameOver,
  text,
}) => (
  <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>
);
