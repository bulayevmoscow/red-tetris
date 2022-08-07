import React, { memo, useEffect, useRef, useState } from "react";
import BackgroundBattlefieldImg from "../assets/img/battlefield_bg.svg";
import {
  BATTLEFIELD_CELL_COUNT,
  BATTLEFIELD_CONFIG,
  renderBackGround,
} from "../utils/battlefieldUtils";

// https://github.com/dionyziz/canvas-tetris/blob/master/js/tetris.js

export const Battlefield = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const field = useRef(new Array(BATTLEFIELD_CELL_COUNT).fill(0) as number[]);
  const [a, b] = useState(0);
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        renderBackGround(ctx);
      }
    }
  }, []);
  useEffect(() => {
    return () => {
      //
    };
  }, []);
  console.log(`url: (${BackgroundBattlefieldImg})`);
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={BATTLEFIELD_CONFIG.width + 5}
        height={BATTLEFIELD_CONFIG.height + 5}
      />
      <h1>{a}</h1>
    </div>
  );
});

Battlefield.displayName = "battlefield";
