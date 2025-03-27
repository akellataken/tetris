import { CELL_SIZE, Brush } from './constants.js';

/**
 * Draws a triangle on a canvas.
 */
const drawTriangle = (x1, y1, x2, y2, x3, y3, brush, ctx) => {
  ctx.fillStyle = brush;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
};

/**
 * Draws a single tetrino block.
 */
const drawBrick = (x, y, darkBrush, dimBrush, brush, ctx) => {
  drawTriangle(x, y, x + CELL_SIZE, y, x, y + CELL_SIZE, brush, ctx);
  drawTriangle(
    x + CELL_SIZE,
    y,
    x + CELL_SIZE,
    y + CELL_SIZE,
    x,
    y + CELL_SIZE,
    darkBrush,
    ctx
  );
  ctx.fillStyle = dimBrush;
  ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
};

/**
 * Clears the entire canvas with a black background.
 */
const clear = (ctx, width, height) => {
  ctx.fillStyle = Brush.BLACK;
  ctx.fillRect(0, 0, width, height);
};

/**
 * Draws a grid on the canvas for visualizing the game field.
 */
function drawGrid(ctx, width, height) {
  ctx.strokeStyle = Brush.LIGHT_GRAY;
  ctx.beginPath();
  for (let x = CELL_SIZE; x < width; x += CELL_SIZE + 1) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = CELL_SIZE; y < height; y += CELL_SIZE + 1) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
}

export { drawTriangle, drawBrick, clear, drawGrid };
