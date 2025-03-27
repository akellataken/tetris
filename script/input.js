import { state } from './gameState.js';
import { canMove, fixateTetromino } from './gameLogic.js';
import { restartGame } from './gameState.js';
import { render } from './renderer.js';
import { getRandomTetromino } from './tetrominoes.js';

const actions = {
  KeyW: () => {
    state.current.blocks = state.current.blocks.map(([x, y]) => [2 - y, x]);
  },
  KeyA: () => {
    if (canMove(-1, 0)) state.offset[0]--;
  },
  KeyD: () => {
    if (canMove(1, 0)) state.offset[0]++;
  },
  KeyS: () => {
    if (canMove(0, 1)) state.offset[1]++;
    else fixateTetromino();
  },
  Space: () => {},
  KeyP: () => {
    state.paused = !state.paused;
  },
  KeyC: () => {
    if (!state.alreadySaved) {
      [state.current, state.saved, state.next] = state.saved
        ? [state.saved, state.current, state.next]
        : [state.next, state.current, getRandomTetromino()];
      state.offset = [4, -1];
      state.alreadySaved = true;
    }
  },
  KeyR: restartGame,
};

/**
 * Initialize keyboard input handlers
 */
function setupInputHandlers() {
  document.addEventListener("keydown", ({ code }) => {
    if (actions[code]) actions[code]();
    else console.log(`Unbound key: ${code}`);
    render();
  });
}

export { setupInputHandlers };
