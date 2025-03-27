import { clear, drawGrid } from './drawing.js';
import { drawTetromino } from './tetrominoes.js';
import { drawField } from './gameLogic.js';
import { state } from './gameState.js';

// Canvases and contexts (will be initialized from game.js)
let gameCanvas, nextCanvas, savedCanvas;
let gameCtx, nextCtx, savedCtx;

/**
 * Initialize renderer with canvas references
 */
function initRenderer(gameCvs, nextCvs, savedCvs) {
  gameCanvas = gameCvs;
  nextCanvas = nextCvs;
  savedCanvas = savedCvs;
  
  gameCtx = gameCanvas.getContext("2d");
  nextCtx = nextCanvas.getContext("2d");
  savedCtx = savedCanvas.getContext("2d");
}

/**
 * Renders the entire game, including the field, current tetromino, next tetromino, and saved tetromino.
 */
function render() {
  clear(gameCtx, gameCanvas.width, gameCanvas.height);
  clear(nextCtx, nextCanvas.width, nextCanvas.height);
  clear(savedCtx, savedCanvas.width, savedCanvas.height);
  
  drawGrid(gameCtx, gameCanvas.width, gameCanvas.height);
  drawField(gameCtx);
  drawTetromino(state.current, gameCtx, true, state.offset);
  drawTetromino(state.next, nextCtx);
  drawTetromino(state.saved, savedCtx);
}

export { initRenderer, render };
