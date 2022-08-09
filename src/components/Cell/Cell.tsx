import React, { FC } from 'react';
import { StyledCell } from './Cell.styles';
import { TETROMINOS } from '../../setup';

type Props = {
  type: keyof typeof TETROMINOS;
};

export const Cell: FC<Props> = ({ type }) => {
  return (
    <StyledCell
      type={type}
      color={TETROMINOS[type].color}
    />
  );
};
