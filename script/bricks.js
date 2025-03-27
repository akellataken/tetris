import { Brush, CELL_SIZE } from './constants.js';
import { drawBrick } from './drawing.js';

/**
 * A collection of brick-drawing functions for a canvas.
 */
const Brick = {
  NONE: (x, y, ctx) => {
    ctx.fillStyle = Brush.BLACK;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  },
  GREEN: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_GREEN, Brush.DIM_GREEN, Brush.GREEN, ctx),
  ORANGE: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_ORANGE, Brush.DIM_ORANGE, Brush.ORANGE, ctx),
  BLUE: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_BLUE, Brush.DIM_BLUE, Brush.BLUE, ctx),
  CYAN: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_CYAN, Brush.DIM_CYAN, Brush.CYAN, ctx),
  RED: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_RED, Brush.DIM_RED, Brush.RED, ctx),
  YELLOW: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_YELLOW, Brush.DIM_YELLOW, Brush.YELLOW, ctx),
  PURPLE: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_PURPLE, Brush.DIM_PURPLE, Brush.PURPLE, ctx),
};

export { Brick };
