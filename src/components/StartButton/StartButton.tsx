import React from 'react';
import { StyledStartButton } from './StartButton.styles';

type Props = {
  callback: () => void;
};

export const StartButton: React.FC<Props> = ({
  callback,
}) => (
  <StyledStartButton onClick={callback}>
    Start Game
  </StyledStartButton>
);
