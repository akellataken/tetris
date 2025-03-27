import { FIELD_WIDTH, FIELD_HEIGHT } from './constants.js';
import { Brick } from './bricks.js';
import { getRandomTetromino } from './tetrominoes.js';

let state = {
  field: Array.from({ length: FIELD_WIDTH }, () =>
    Array.from({ length: FIELD_HEIGHT }, () => Brick.NONE)
  ),
  current: getRandomTetromino(),
  next: getRandomTetromino(),
  saved: undefined,
  offset: [4, -1],
  paused: false,
  alreadySaved: false,
};

/**
 * Restarts the game by resetting the state to its initial values.
 */
function restartGame() {
  state = {
    field: Array.from({ length: FIELD_WIDTH }, () =>
      Array.from({ length: FIELD_HEIGHT }, () => Brick.NONE)
    ),
    current: getRandomTetromino(),
    next: getRandomTetromino(),
    saved: undefined,
    offset: [4, -1],
    paused: false,
    alreadySaved: false,
  };
}

export { state, restartGame };
