import { FIELD_WIDTH, FIELD_HEIGHT, CELL_SIZE } from "./constants.js";
import { Brick } from "./bricks.js";
import { getRandomTetromino } from "./tetrominoes.js";
import { state } from "./gameState.js";

/**
 * Checks if the current tetromino can move by the specified offsets.
 */
const canMove = (dx, dy) =>
  state.current.blocks.every(([bx, by]) => {
    const x = bx + state.offset[0] + dx;
    const y = by + state.offset[1] + dy;
    if (x < 0 || x >= FIELD_WIDTH || y >= FIELD_HEIGHT) return false;
    return y < 0 || state.field[x][y] === Brick.NONE;
  });

/**
 * Check if the current tetromino can be rotated.
 */
const canRotate = () => {
  return !state.current.blocks.some(([bx, by]) => {
    const x = 2- by + state.offset[0];
    const y = bx + state.offset[1];
    const result =  x < 0 || y < 0 || state.field[x][y] !== Brick.NONE;
    return result;
  });
};

/**
 * Rotates current tetomino clockwise by 90 deg.
 * TODO: Fix spin for line and cube.
 */
const rotate = () => {
  state.current.blocks = state.current.blocks.map(([x, y]) => [2 - y, x]);
};

/**
 * Fixates the current tetromino on the game field and prepares the next one.
 */
function fixateTetromino() {
  state.current.blocks.forEach(([bx, by]) => {
    const x = bx + state.offset[0];
    const y = by + state.offset[1];
    if (y >= 0 && x >= 0 && x < FIELD_WIDTH && y < FIELD_HEIGHT) {
      state.field[x][y] = state.current.color;
    }
  });
  clearLines();
  state.current = state.next;
  state.next = getRandomTetromino();
  state.offset = [4, -1];
  state.alreadySaved = false;
}

/**
 * Clears completed lines from the game field and shifts the remaining lines down.
 */
function clearLines() {
  for (let y = 0; y < FIELD_HEIGHT; y++) {
    if (state.field.every((col) => col[y] !== Brick.NONE)) {
      for (let x = 0; x < FIELD_WIDTH; x++) {
        state.field[x].splice(y, 1);
        state.field[x].unshift(Brick.NONE);
      }
    }
  }
}

/**
 * Updates the game state, moving the current tetromino down if possible.
 */
function update() {
  if (!state.paused) {
    if (canMove(0, 1)) state.offset[1]++;
    else fixateTetromino();
  }
}

/**
 * Draws the game field, including all fixed bricks.
 */
function drawField(gameCtx) {
  for (let x = 0; x < FIELD_WIDTH; x++) {
    for (let y = 0; y < FIELD_HEIGHT; y++) {
      const posX = x * CELL_SIZE + x;
      const posY = y * CELL_SIZE + y;
      state.field[x][y](posX, posY, gameCtx);
    }
  }
}

export {
  canMove,
  canRotate,
  rotate,
  fixateTetromino,
  clearLines,
  update,
  drawField,
};
