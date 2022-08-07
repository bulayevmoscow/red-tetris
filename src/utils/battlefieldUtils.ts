export const BATTLEFIELD_CONFIG = {
  height: 800,
  width: 400,
  cellW: 10,
  cellH: 20,
} as const;

export const CANVAS_FIELD = {
  width: BATTLEFIELD_CONFIG.width / BATTLEFIELD_CONFIG.cellW,
  height: BATTLEFIELD_CONFIG.height / BATTLEFIELD_CONFIG.cellH,
} as const;
console.log(CANVAS_FIELD);
export const BATTLEFIELD_CELL_COUNT =
  BATTLEFIELD_CONFIG.cellW * BATTLEFIELD_CONFIG.cellH;

export const renderBackGround = (ctx: CanvasRenderingContext2D) => {
  console.time("render");
  const { cellH, cellW } = BATTLEFIELD_CONFIG;
  const { width, height } = CANVAS_FIELD;

  ctx.fillRect(0, 0, 1, BATTLEFIELD_CONFIG.height);
  ctx.fillRect(width, 0, 1, BATTLEFIELD_CONFIG.height);

  for (let paddingX = 0; paddingX <= cellW; paddingX++) {
    ctx.fillRect(width * paddingX, 0, 1, BATTLEFIELD_CONFIG.height);
  }

  for (let paddingY = 0; paddingY <= cellH; paddingY++) {
    ctx.fillRect(0, height * paddingY, BATTLEFIELD_CONFIG.width, 1);
  }

  for (let x = 0; x < cellW; x++) {
    for (let y = 0; y < cellH; y++) {
      const startX = x * width;
      const startY = y * height;
      if (y === x) {
        ctx.strokeStyle = "transparent";
        ctx.fillRect(startX, startY, width, height);
      } else {
        ctx.strokeStyle = "transparent";
        ctx.rect(startX, startY, width, height);
      }
      ctx.stroke();
    }
  }
  console.timeEnd("render");
};
