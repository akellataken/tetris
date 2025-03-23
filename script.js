// Getting canvases for the main game field and tetrinos canvases (next and saved).
/** @type {HTMLCanvasElement} */
const gameCanvas = document.getElementById("game");
/** @type {HTMLCanvasElement} */
const nextCanvas = document.getElementById("next");
/** @type {HTMLCanvasElement} */
const savedCanvas = document.getElementById("saved");

// Getting drawing contexts to work with.
/** @type {CanvasRenderingContext2D} */
const gameCtx = gameCanvas.getContext("2d");
/** @type {CanvasRenderingContext2D} */
const nextCtx = nextCanvas.getContext("2d");
/** @type {CanvasRenderingContext2D} */
const savedCtx = savedCanvas.getContext("2d");

// Constants.
/** The size of a single cell in pixels. */
const CELL_SIZE = 20;
/** The width of the game field in cells. */
const FIELD_WIDTH = 10;
/** The height of the game field in cells. */
const FIELD_HEIGHT = 20;

/**
 * A collection of predefined colors for drawing bricks and other elements.
 * @enum {string}
 */
const Brush = {
  LIGHT_GRAY: "rgb(42,42,42)",
  GREEN: "rgb(0,255,0)",
  DIM_GREEN: "rgb(0,200,0)",
  DARK_GREEN: "rgb(0,155,0)",
  BLUE: "rgb(0,0,255)",
  DIM_BLUE: "rgb(0,0,200)",
  DARK_BLUE: "rgb(0,0,155)",
  ORANGE: "rgb(255,175,0)",
  DIM_ORANGE: "rgb(235,152,0)",
  DARK_ORANGE: "rgb(200,140,0)",
  BLACK: "rgb(0,0,0)",
  CYAN: "rgb(0,255,255)",
  DIM_CYAN: "rgb(0,200,200)",
  DARK_CYAN: "rgb(0,155,155)",
  RED: "rgb(255,0,0)",
  DIM_RED: "rgb(235,0,0)",
  DARK_RED: "rgb(200,0,0)",
  YELLOW: "rgb(255,255,0)",
  DIM_YELLOW: "rgb(235,235,0)",
  DARK_YELLOW: "rgb(200,200,0)",
  PURPLE: "rgb(155,0,155)",
  DIM_PURPLE: "rgb(140,0,140)",
  DARK_PURPLE: "rgb(125,0,125)",
};

/**
 * Draws a triangle on a canvas.
 *
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @param {number} x3 - The x-coordinate of the third point.
 * @param {number} y3 - The y-coordinate of the third point.
 * @param {string} brush - The fill color for the triangle.
 *                         Use of {@link Brush} is recommended.
 * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
 *                                         <code>canvas.getContext("2d")</code>.
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
 * @param {number} x - Top-left coordinate X.
 * @param {number} y - Top-left coordinate Y.
 * @param {string} darkBrush - The fill color for a dark part of tetrino block.
 *                             Use of {@link Brush} is recommended.
 * @param {string} dimBrush - The fill color for a dimmed part of tetrino block.
 *                            Use of {@link Brush} is recommended.
 * @param {string} brush - The fill color for a bright part of tetrino block.
 *                         Use of {@link Brush} is recommended.
 * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
 *                                         <code>canvas.getContext("2d")</code>.
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
 * A collection of brick-drawing functions for a canvas.
 * Each function draws a specific type of brick at the given coordinates.
 */
const Brick = {
  /**
   * Draws an empty (black) brick.
   *
   * @param {number} x - The x-coordinate of the brick's top-left corner.
   * @param {number} y - The y-coordinate of the brick's top-left corner.
   * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
   *                                         <code>canvas.getContext("2d")</code>.
   */
  NONE: (x, y, ctx) => {
    ctx.fillStyle = Brush.BLACK;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  },

  /**
   * Draws a green brick.
   *
   * @param {number} x - The x-coordinate of the brick's top-left corner.
   * @param {number} y - The y-coordinate of the brick's top-left corner.
   * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
   *                                         <code>canvas.getContext("2d")</code>.
   */
  GREEN: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_GREEN, Brush.DIM_GREEN, Brush.GREEN, ctx),

  /**
   * Draws an orange brick.
   *
   * @param {number} x - The x-coordinate of the brick's top-left corner.
   * @param {number} y - The y-coordinate of the brick's top-left corner.
   * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
   *                                         <code>canvas.getContext("2d")</code>.
   */
  ORANGE: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_ORANGE, Brush.DIM_ORANGE, Brush.ORANGE, ctx),

  /**
   * Draws a blue brick.
   *
   * @param {number} x - The x-coordinate of the brick's top-left corner.
   * @param {number} y - The y-coordinate of the brick's top-left corner.
   * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
   *                                         <code>canvas.getContext("2d")</code>.
   */
  BLUE: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_BLUE, Brush.DIM_BLUE, Brush.BLUE, ctx),

  /**
   * Draws a cyan brick.
   *
   * @param {number} x - The x-coordinate of the brick's top-left corner.
   * @param {number} y - The y-coordinate of the brick's top-left corner.
   * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
   *                                         <code>canvas.getContext("2d")</code>.
   */
  CYAN: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_CYAN, Brush.DIM_CYAN, Brush.CYAN, ctx),

  /**
   * Draws a red brick.
   *
   * @param {number} x - The x-coordinate of the brick's top-left corner.
   * @param {number} y - The y-coordinate of the brick's top-left corner.
   * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
   *                                         <code>canvas.getContext("2d")</code>.
   */
  RED: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_RED, Brush.DIM_RED, Brush.RED, ctx),

  /**
   * Draws a yellow brick.
   *
   * @param {number} x - The x-coordinate of the brick's top-left corner.
   * @param {number} y - The y-coordinate of the brick's top-left corner.
   * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
   *                                         <code>canvas.getContext("2d")</code>.
   */
  YELLOW: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_YELLOW, Brush.DIM_YELLOW, Brush.YELLOW, ctx),

  /**
   * Draws a purple brick.
   *
   * @param {number} x - The x-coordinate of the brick's top-left corner.
   * @param {number} y - The y-coordinate of the brick's top-left corner.
   * @param {CanvasRenderingContext2D} ctx - The drawing context obtained from
   *                                         <code>canvas.getContext("2d")</code>.
   */
  PURPLE: (x, y, ctx) =>
    drawBrick(x, y, Brush.DARK_PURPLE, Brush.DIM_PURPLE, Brush.PURPLE, ctx),
};

// Map for tetrominos describing drawing color and their form.
// Each <code>blocks</code> element represents a required tetromino block coordinates.
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
 *
 * @return {{color: Function, blocks: number[][]}} A random tetromino object
 * containing its color and block coordinates.
 */
const getRandomTetromino = () => {
  const keys = Object.keys(Tetromino);
  const tet = Tetromino[keys[Math.floor(Math.random() * keys.length)]];
  return { color: tet.color, blocks: tet.blocks.map((b) => [...b]) };
};

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
 * Checks if the current tetromino can move by the specified offsets.
 *
 * @param {number} dx - The horizontal offset.
 * @param {number} dy - The vertical offset.
 * @return {boolean} True if the tetromino can move, false otherwise.
 */
const canMove = (dx, dy) =>
  state.current.blocks.every(([bx, by]) => {
    const x = bx + state.offset[0] + dx;
    const y = by + state.offset[1] + dy;
    if (x < 0 || x >= FIELD_WIDTH || y >= FIELD_HEIGHT) return false;
    return y < 0 || state.field[x][y] === Brick.NONE;
  });

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

document.addEventListener("keydown", ({ code }) => {
  if (actions[code]) actions[code]();
  else console.log(`Unbound key: ${code}`);
  render();
});

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

/**
 * Clears the entire canvas with a black background.
 *
 * @param {CanvasRenderingContext2D} ctx - The drawing context.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 */
const clear = (ctx, width, height) => {
  ctx.fillStyle = Brush.BLACK;
  ctx.fillRect(0, 0, width, height);
};

/**
 * Draws a grid on the canvas for visualizing the game field.
 *
 * @param {CanvasRenderingContext2D} ctx - The drawing context.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
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

/**
 * Draws the game field, including all fixed bricks.
 */
function drawField() {
  for (let x = 0; x < FIELD_WIDTH; x++) {
    for (let y = 0; y < FIELD_HEIGHT; y++) {
      const posX = x * CELL_SIZE + x;
      const posY = y * CELL_SIZE + y;
      state.field[x][y](posX, posY, gameCtx);
    }
  }
}

/**
 * Draws a tetromino on the specified canvas.
 *
 * @param {{color: Function, blocks: number[][]}} tetromino - The tetromino to draw.
 * @param {CanvasRenderingContext2D} ctx - The drawing context.
 * @param {boolean} [useOffset=false] - Whether to apply the current offset to the tetromino's position.
 */
function drawTetromino(tetromino, ctx, useOffset = false) {
  if (!tetromino) return;
  tetromino.blocks.forEach(([bx, by]) => {
    const offX = useOffset ? state.offset[0] : 0;
    const offY = useOffset ? state.offset[1] : 0;
    if (by + offY < 0) return;
    const x = (bx + offX) * CELL_SIZE + (bx + offX);
    const y = (by + offY) * CELL_SIZE + (by + offY);
    tetromino.color(x, y, ctx);
  });
}

/**
 * Renders the entire game, including the field, current tetromino, next tetromino, and saved tetromino.
 */
function render() {
  clear(gameCtx, gameCanvas.width, gameCanvas.height);
  clear(nextCtx, nextCanvas.width, nextCanvas.height);
  clear(savedCtx, savedCanvas.width, savedCanvas.height);
  drawGrid(gameCtx, gameCanvas.width, gameCanvas.height);
  drawField();
  drawTetromino(state.current, gameCtx, true);
  drawTetromino(state.next, nextCtx);
  drawTetromino(state.saved, savedCtx);
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
 * The main game loop, responsible for rendering the game at each frame.
 */
function gameLoop() {
  render();
  requestAnimationFrame(gameLoop);
}

// Start the game loop and update interval.
setInterval(() => {
  if (!state.paused) update();
}, 1000);

requestAnimationFrame(gameLoop);
