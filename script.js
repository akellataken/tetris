const gameCanvas = document.getElementById("game");
const nextCanvas = document.getElementById("next");
const savedCanvas = document.getElementById("saved");
const gameContext = gameCanvas.getContext("2d");
const nextContext = nextCanvas.getContext("2d");
const savedContext = savedCanvas.getContext("2d");

const CELL_SIZE = 20; // px
const CANVAS_WIDTH = gameCanvas.width;
const CANVAS_HEIGHT = gameCanvas.height;
const NEXT_WIDTH = nextCanvas.width;
const NEXT_HEIGHT = nextCanvas.height;
const SAVED_WIDTH = savedCanvas.width;
const SAVED_HEIGHT = savedCanvas.height;

document.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "KeyW":
      onKeyRotate();
      break;
    case "KeyA":
      onKeyLeft();
      break;
    case "KeyS":
      onKeyFall();
      break;
    case "KeyD":
      onKeyRight();
      break;
    case "KeyC":
      onKeySave();
      break;
    case "KeyP":
      onKeyPause();
      break;
    case "KeyR":
      onKeyRestart();
      break;
    case "Space":
      onKeyDrop();
      break;
    default:
      console.log(`Unbinded key pressed: ${event.code}`);
      break;
  }
  render();
});

const Brush = {
  LIGHT_GRAY: "rgb(42 42 42)",
  GREEN: "rgb(0 255 0)",
  DIM_GREEN: "rgb(0 200 0)",
  DARK_GREEN: "rgb(0 155 0)",
  BLUE: "rgb(0 0 255)",
  DIM_BLUE: "rgb(0 0 200)",
  DARK_BLUE: "rgb(0 0 155)",
  ORANGE: "rgb(255 175 0)",
  DIM_ORANGE: "rgb(235 152 0)",
  DARK_ORANGE: "rgb(200 140 0)",
  BLACK: "rgb(0 0 0)",
  CYAN: "rgb(0 255 255)",
  DIM_CYAN: "rgb(0 200 200)",
  DARK_CYAN: "rgb(0 155 155)",
  RED: "rgb(255 0 0)",
  DIM_RED: "rgb(235 0 0)",
  DARK_RED: "rgb(200 0 0)",
  YELLOW: "rgb(255 255 0)",
  DIM_YELLOW: "rgb(235 235 0)",
  DARK_YELLOW: "rgb(200 200 0)",
  PURPLE: "rgb(155 0 155)",
  DIM_PURPLE: "rgb(140 0 140)",
  DARK_PURPLE: "rgb(125 0 125)",
};

function drawTriangle(x1, y1, x2, y2, x3, y3, brush, context) {
  context.fillStyle = brush;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context.closePath();
  context.fill();
}

function drawBrick(x, y, darkBrush, dimBrush, brush, context) {
  drawTriangle(x, y, x + CELL_SIZE, y, x, y + CELL_SIZE, brush, context);
  drawTriangle(
    x + CELL_SIZE,
    y,
    x + CELL_SIZE,
    y + CELL_SIZE,
    x,
    y + CELL_SIZE,
    darkBrush,
    context
  );
  context.fillStyle = dimBrush;
  context.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
}

const Brick = {
  NONE: (x, y, context) => {
    context.fillStyle = Brush.BLACK;
    context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  },
  GREEN: (x, y, context) => {
    drawBrick(x, y, Brush.DARK_GREEN, Brush.DIM_GREEN, Brush.GREEN, context);
  },
  ORANGE: (x, y, context) => {
    drawBrick(x, y, Brush.DARK_ORANGE, Brush.DIM_ORANGE, Brush.ORANGE, context);
  },
  BLUE: (x, y, context) => {
    drawBrick(x, y, Brush.DARK_BLUE, Brush.DIM_BLUE, Brush.BLUE, context);
  },
  CYAN: (x, y, context) => {
    drawBrick(x, y, Brush.DARK_CYAN, Brush.DIM_CYAN, Brush.CYAN, context);
  },
  RED: (x, y, context) => {
    drawBrick(x, y, Brush.DARK_RED, Brush.DIM_RED, Brush.RED, context);
  },
  YELLOW: (x, y, context) => {
    drawBrick(x, y, Brush.DARK_YELLOW, Brush.DIM_YELLOW, Brush.YELLOW, context);
  },
  PURPLE: (x, y, context) => {
    drawBrick(x, y, Brush.DARK_PURPLE, Brush.DIM_PURPLE, Brush.PURPLE, context);
  },
};

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

function getRandomTetromino() {
  const tetrominoKeys = Object.keys(Tetromino);
  const randomKey =
    tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
  const original = Tetromino[randomKey];

  return {
    color: original.color,
    blocks: original.blocks.map((block) => [block[0], block[1]]),
  };
}

let field = Array.from({ length: 10 }, () =>
  Array.from({ length: 20 }, () => Brick.NONE)
);

let currentTetromino = getRandomTetromino();
let nextTetromino = getRandomTetromino();
let savedTetromino = [];
let gameSpeed = 1.0;
let canRenderGameTick = false;
let offset = [3, -2];
let paused = false;

function canMoveLeft() {
  for (let i = 0; i < currentTetromino.blocks.length; i++) {
    const tetro = currentTetromino.blocks[i];
    if (
      tetro[0] + offset[0] <= 0 ||
      tetro[1] + offset[1] < 0 ||
      (field[tetro[0] + offset[0] - 1][tetro[1] + offset[1]] !== Brick.NONE &&
        field[tetro[0] + offset[0] - 1][tetro[1] + offset[1]] !== undefined)
    ) {
      return false;
    }
  }
  return true;
}

function canMoveRight() {
  for (let i = 0; i < currentTetromino.blocks.length; i++) {
    const tetro = currentTetromino.blocks[i];
    if (
      tetro[0] + offset[0] >= 9 ||
      tetro[1] + offset[1] < 0 ||
      (field[tetro[0] + offset[0] + 1][tetro[1] + offset[1]] !== Brick.NONE &&
        field[tetro[0] + offset[0] + 1][tetro[1] + offset[1]] !== undefined)
    ) {
      return false;
    }
  }
  return true;
}

function canFall() {
  for (let i = 0; i < currentTetromino.blocks.length; i++) {
    const tetro = currentTetromino.blocks[i];
    if (
      tetro[1] + offset[1] >= 19 ||
      (field[tetro[0] + offset[0]][tetro[1] + offset[1] + 1] !== Brick.NONE &&
        field[tetro[0] + offset[0]][tetro[1] + offset[1] + 1] !== undefined)
    ) {
      return false;
    }
  }
  return true;
}

function fixateTetromino() {
  for (let i = 0; i < currentTetromino.blocks.length; i++) {
    const tetro = currentTetromino.blocks[i];
    const x = tetro[0] + offset[0];
    const y = tetro[1] + offset[1];
    field[x][y] = currentTetromino.color;
  }
  currentTetromino = nextTetromino;
  nextTetromino = getRandomTetromino();
  offset = [4, -2];
}

function onKeyRight() {
  if (!canMoveRight()) return;
  offset = [offset[0] + 1, offset[1]];
}

function onKeyLeft() {
  if (!canMoveLeft()) return;
  offset = [offset[0] - 1, offset[1]];
}

function onKeyRotate() {}

function onKeyFall() {
  if (!canFall()) {
    fixateTetromino();
  } else {
    offset = [offset[0], offset[1] + 1];
  }
}

function onKeyDrop() {}

function onKeyPause() {
  paused = !paused;
}

function onKeySave() {
  const temp = currentTetromino;
  if (savedTetromino.length != 0) {
    currentTetromino = savedTetromino;
  } else {
    currentTetromino = getRandomTetromino();
  }
  savedTetromino = temp;
}

function onKeyRestart() {
  offset = [4, -2];
  field = Array.from({ length: 10 }, () =>
    Array.from({ length: 20 }, () => Brick.NONE)
  );
}

function clear(context, width, height) {
  context.fillStyle = Brush.BLACK;
  context.fillRect(0, 0, width, height);
}

function drawMarks(context, cellSize, width, height) {
  context.strokeStyle = Brush.LIGHT_GRAY;
  for (let i = cellSize + 1; i <= width; i += cellSize + 1) {
    context.moveTo(i, 0);
    context.lineTo(i, height);
    context.stroke();
  }

  for (let i = cellSize + 1; i <= height; i += cellSize + 1) {
    context.moveTo(0, i);
    context.lineTo(width, i);
    context.stroke();
  }
}

function drawField() {
  for (let row = 0; row < field.length; row++) {
    for (let column = 0; column < field[row].length; column++) {
      field[row][column](
        row * CELL_SIZE + row,
        column * CELL_SIZE + column,
        gameContext
      );
    }
  }
}

function drawTetromino(tetromino, context, useOffset) {
  if (tetromino.blocks === undefined || tetromino.blocks === 0) return;
  tetromino.blocks.forEach((tetro) => {
    if (tetro[1] + offset[1] < 0) return;
    const x =
      (tetro[0] + (useOffset ? offset[0] : 0)) * CELL_SIZE +
      (tetro[0] + (useOffset ? offset[0] : 0));
    const y =
      (tetro[1] + (useOffset ? offset[1] : 0)) * CELL_SIZE +
      (tetro[1] + (useOffset ? offset[1] : 0));
    tetromino.color(x, y, context);
  });
}

async function render() {
  clear(gameContext, CANVAS_WIDTH, CANVAS_HEIGHT);
  clear(nextContext, NEXT_WIDTH, NEXT_HEIGHT);
  clear(savedContext, SAVED_WIDTH, SAVED_HEIGHT);
  drawMarks(gameContext, CELL_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawField();
  drawTetromino(currentTetromino, gameContext, true);
  drawTetromino(nextTetromino, nextContext, false);
  drawTetromino(savedTetromino, savedContext, false);
}

async function gameTickLoop() {
  await new Promise((resolve) => {
    canRenderGameTick = true;
    setTimeout(resolve, 1000 / gameSpeed);
  });
  gameTickLoop();
}

async function gameLoop() {
  render();
  await new Promise((resolve) => {
    if (!paused) {
      if (canRenderGameTick) {
        onKeyFall();
        canRenderGameTick = false;
      }
      setTimeout(resolve, 1000 / 30);
    }
  });
  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
gameTickLoop();
