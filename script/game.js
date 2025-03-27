import { setupInputHandlers } from './input.js';
import { initRenderer, render } from './renderer.js';
import { update } from './gameLogic.js';

/**
 * Initializes the game
 */
function initGame() {
  // Getting canvases for the main game field and tetrinos canvases
  const gameCanvas = document.getElementById("game");
  const nextCanvas = document.getElementById("next");
  const savedCanvas = document.getElementById("saved");
  
  // Initialize renderer with canvases
  initRenderer(gameCanvas, nextCanvas, savedCanvas);
  
  // Set up input handlers
  setupInputHandlers();
  
  // Start the game loop and update interval
  setInterval(() => {
    update();
  }, 1000);
  
  requestAnimationFrame(gameLoop);
}

/**
 * The main game loop, responsible for rendering the game at each frame.
 */
function gameLoop() {
  render();
  requestAnimationFrame(gameLoop);
}

export { initGame };
