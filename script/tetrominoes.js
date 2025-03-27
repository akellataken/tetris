import { Brick } from './bricks.js';
import { CELL_SIZE } from './constants.js';

// Map for tetrominos describing drawing color and their form.
const Tetromino = {
  SQUARE: {
    color: Brick.YELLOW,
    blocks: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  },
  I: {
    color: Brick.CYAN,
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  },
  T: {
    color: Brick.PURPLE,
    blocks: [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 0],
    ],
  },
  S: {
    color: Brick.GREEN,
    blocks: [
      [1, 1],
      [2, 1],
      [0, 0],
      [1, 0],
    ],
  },
  Z: {
    color: Brick.RED,
    blocks: [
      [0, 1],
      [1, 1],
      [1, 0],
      [2, 0],
    ],
  },
  L: {
    color: Brick.ORANGE,
    blocks: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  J: {
    color: Brick.BLUE,
    blocks: [
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
};

/**
 * Generates a random tetromino from the available types.
 */
const getRandomTetromino = () => {
  const keys = Object.keys(Tetromino);
  const tet = Tetromino[keys[Math.floor(Math.random() * keys.length)]];
  return { color: tet.color, blocks: tet.blocks.map((b) => [...b]) };
};

/**
 * Draws a tetromino on the specified canvas.
 */
function drawTetromino(tetromino, ctx, useOffset = false, offset = [0, 0]) {
  if (!tetromino) return;
  tetromino.blocks.forEach(([bx, by]) => {
    const offX = useOffset ? offset[0] : 0;
    const offY = useOffset ? offset[1] : 0;
    if (by + offY < 0) return;
    const x = (bx + offX) * CELL_SIZE + (bx + offX);
    const y = (by + offY) * CELL_SIZE + (by + offY);
    tetromino.color(x, y, ctx);
  });
}

export { Tetromino, getRandomTetromino, drawTetromino };
