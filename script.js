const CANVAS_WIDTH = 209;
const CANVAS_HEIGHT = 419;

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
  drawField();
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
  drawTriangle(x, y, x + 20, y, x, y + 20, brush);
  drawTriangle(x + 20, y, x + 20, y + 20, x, y + 20, darkBrush);
  context.fillStyle = dimBrush;
  context.fillRect(x + 2, y + 2, 16, 16);
}

const Bricks = {
  NONE: (x, y) => {
    context.fillStyle = Brush.BLACK;
    context.fillRect(x, y, 20, 20);
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
};

const field = Array.from({ length: 10 }, () =>
  Array.from({ length: 20 }, () => Bricks.NONE)
);

let gameSpeed = 1.0;
let realSpeed = 1.0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let xPos = 4;
let yPos = 9;

function onKeyRight() {
  field[xPos][yPos] = Bricks.NONE;
  if (xPos < 9) {
    xPos += 1;
  }
  field[xPos][yPos] = Bricks.GREEN;
}
function onKeyLeft() {
  field[xPos][yPos] = Bricks.NONE;
  if (xPos > 0) {
    xPos -= 1;
  }
  field[xPos][yPos] = Bricks.GREEN;
}
function onKeyRotate() {
  field[xPos][yPos] = Bricks.NONE;
  if (yPos > 0) {
    yPos -= 1;
  }
  field[xPos][yPos] = Bricks.GREEN;
}
function onKeyFall() {
  field[xPos][yPos] = Bricks.NONE;
  if (yPos < 19) {
    yPos += 1;
  }
  field[xPos][yPos] = Bricks.GREEN;
}
function onKeyDrop() {}
function onKeyPause() {}
function onKeySave() {}
function onKeyRestart() {}

function drawMarks() {
  context.strokeStyle = Brush.LIGHT_GRAY;
  for (let i = 21; i <= CANVAS_WIDTH; i += 21) {
    context.moveTo(i, 0);
    context.lineTo(i, CANVAS_HEIGHT);
    context.stroke();
  }

  for (let i = 21; i <= CANVAS_HEIGHT; i += 21) {
    context.moveTo(0, i);
    context.lineTo(CANVAS_WIDTH, i);
    context.stroke();
  }
}

function drawField() {
  for (let row = 0; row < field.length; row++) {
    for (let column = 0; column < field[row].length; column++) {
      field[row][column](row * 20 + row, column * 20 + column);
    }
  }
}

async function render() {
  drawField();

  await sleep(1000 / gameSpeed);
  window.requestAnimationFrame(render);
}

drawMarks();
window.requestAnimationFrame(render);
