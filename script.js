const CELL_SIZE = 20; // px
const CANVAS_WIDTH = CELL_SIZE * 10 + 9;
const CANVAS_HEIGHT = CELL_SIZE * 20 + 19;

const c = document.getElementById("game");
const context = c.getContext("2d");

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


function drawTriangle(x1, y1, x2, y2, x3, y3, brush) {
  context.fillStyle = brush;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context.closePath();
  context.fill();
}

function drawBrick(x, y, darkBrush, dimBrush, brush) {
  drawTriangle(x, y, x + CELL_SIZE, y, x, y + CELL_SIZE, brush);
  drawTriangle(
    x + CELL_SIZE,
    y,
    x + CELL_SIZE,
    y + CELL_SIZE,
    x,
    y + CELL_SIZE,
    darkBrush
  );
  context.fillStyle = dimBrush;
  context.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
}

const Brick = {
  NONE: (x, y) => {
    context.fillStyle = Brush.BLACK;
    context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  },
  GREEN: (x, y) => {
    drawBrick(x, y, Brush.DARK_GREEN, Brush.DIM_GREEN, Brush.GREEN);
  },
  ORANGE: (x, y) => {
    drawBrick(x, y, Brush.DARK_ORANGE, Brush.DIM_ORANGE, Brush.ORANGE);
  },
  BLUE: (x, y) => {
    drawBrick(x, y, Brush.DARK_BLUE, Brush.DIM_BLUE, Brush.BLUE);
  },
  CYAN: (x, y) => {
    drawBrick(x, y, Brush.DARK_CYAN, Brush.DIM_CYAN, Brush.CYAN);
  },
  RED: (x, y) => {
    drawBrick(x, y, Brush.DARK_RED, Brush.DIM_RED, Brush.RED);
  },
  YELLOW: (x, y) => {
    drawBrick(x, y, Brush.DARK_YELLOW, Brush.DIM_YELLOW, Brush.YELLOW);
  },
  PURPLE: (x, y) => {
    drawBrick(x, y, Brush.DARK_PURPLE, Brush.DIM_PURPLE, Brush.PURPLE);
  },
};


const field = Array.from({ length: 10 }, () =>
  Array.from({ length: 20 }, () => Brick.NONE)
);

class BrickLocation {
  constructor(brick, location) {
    this.brick = brick;
    this.location = location;
  }
}

const currentTetromino = [new BrickLocation(Brick.GREEN, [4, 9])];
const nextTetromino = []; 
const savedTetromino = []; 
let gameSpeed = 1.0;

function canMoveLeft() {
  for (let i = 0; i < currentTetromino.length; i++) {
    const tetro = currentTetromino[i];
    if (
      tetro.location[0] <= 0 ||
      tetro.location[1] < 0 ||
      field[tetro.location[0] - 1][tetro.location[1]] !== Brick.NONE
    ) {
      return false;
    }
  }
  return true;
}

function canMoveRight() {
  for (let i = 0; i < currentTetromino.length; i++) {
    const tetro = currentTetromino[i];
    if (
      tetro.location[0] >= 9 ||
      tetro.location[1] < 0 ||
      field[tetro.location[0] + 1][tetro.location[1]] !== Brick.NONE
    ) {
      return false;
    }
  }
  return true;
}

function canFall() {
  for (let i = 0; i < currentTetromino.length; i++) {
    const tetro = currentTetromino[i];
    if (
      tetro.location[1] >= 19 ||
      field[tetro.location[0]][tetro.location[1] + 1] !== Brick.NONE
    ) {
      return false;
    }
  }
  return true;
}

// TODO: Remove later.
function canRotate() {
  for (let i = 0; i < currentTetromino.length; i++) {
    const tetro = currentTetromino[i];
    if (
      tetro.location[1] <= 0 ||
      field[tetro.location[0]][tetro.location[1] - 1] !== Brick.NONE
    ) {
      return false;
    }
  }
  return true;
}

function onKeyRight() {
  if (!canMoveRight()) return;
  currentTetromino.forEach((tetro) => {
    tetro.location = [tetro.location[0] + 1, tetro.location[1]];
  });
}
function onKeyLeft() {
  if (!canMoveLeft()) return;
  currentTetromino.forEach((tetro) => {
    tetro.location = [tetro.location[0] - 1, tetro.location[1]];
  });
}
function onKeyRotate() {
  // TODO: Remake to actual rotate later.
  if (!canRotate()) return;
  currentTetromino.forEach((tetro) => {
    tetro.location = [tetro.location[0], tetro.location[1] - 1];
  });
}
function onKeyFall() {
  if (!canFall()) return;
  currentTetromino.forEach((tetro) => {
    tetro.location = [tetro.location[0], tetro.location[1] + 1];
  });
}
function onKeyDrop() {}
function onKeyPause() {}
function onKeySave() {}
function onKeyRestart() {}

function clear() {
  context.fillStyle = Brush.BLACK;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawMarks() {
  context.strokeStyle = Brush.LIGHT_GRAY;
  for (let i = CELL_SIZE + 1; i <= CANVAS_WIDTH; i += CELL_SIZE + 1) {
    context.moveTo(i, 0);
    context.lineTo(i, CANVAS_HEIGHT);
    context.stroke();
  }

  for (let i = CELL_SIZE + 1; i <= CANVAS_HEIGHT; i += CELL_SIZE + 1) {
    context.moveTo(0, i);
    context.lineTo(CANVAS_WIDTH, i);
    context.stroke();
  }
}

function drawField() {
  for (let row = 0; row < field.length; row++) {
    for (let column = 0; column < field[row].length; column++) {
      field[row][column](row * CELL_SIZE + row, column * CELL_SIZE + column);
    }
  }
}

function drawCurrentTetromino() {
  currentTetromino.forEach((tetro) => {
    if (tetro.location[1] < 0) return;
    tetro.brick(
      tetro.location[0] * CELL_SIZE + tetro.location[0],
      tetro.location[1] * CELL_SIZE + tetro.location[1]
    );
  });
}

async function render() {
  clear();
  drawMarks();
  drawField();
  drawCurrentTetromino();
}

async function gameLoop() {
  render();
  await new Promise((resolve) => setTimeout(resolve, 1000 / gameSpeed));
  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

field[3][3] = Brick.BLUE;
field[7][7] = Brick.BLUE;
field[7][8] = Brick.BLUE;
