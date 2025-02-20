const CANVAS_WIDTH = 209;
const CANVAS_HEIGHT = 419;

const c = document.getElementById("game");
const context = c.getContext("2d");

document.addEventListener('keydown', function(event) {
  console.log('key ${event.code} is pressed');
})
document.addEventListener('keyup', function(event) {
  console.log("key ${event.code} is released");
})

const Brush = {
  LIGHT_GRAY: "rgb(42 42 42)",
  GREEN: "rgb(0 255 0)",
  DIM_GREEN: "rgb(0 200 0)",
  DARK_GREEN: "rgb(0 155 0)",
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

const Bricks = {
  NONE: (x, y) => {
    context.fillStyle = Brush.BLACK;
    context.fillRect(x, y, 20, 20);
  },
  GREEN: (x, y) => {
    drawTriangle(x, y, x + 20, y, x, y + 20, Brush.GREEN);
    drawTriangle(x + 20, y, x + 20, y + 20, x, y + 20, Brush.DARK_GREEN);
    context.fillStyle = Brush.DIM_GREEN;
    context.fillRect(x + 2, y + 2, 16, 16);
  },
};

const field = Array.from({ length: 10 }, () =>
  Array.from({ length: 20 }, () => Bricks.NONE)
);

let gameSpeed = 1.0;
let realSpeed = 1.0;
let lastRandomCell = [0, 0];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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
  field[lastRandomCell[0]][lastRandomCell[1]] = Bricks.NONE;
  lastRandomCell = [getRandomInt(10), getRandomInt(20)];
  field[lastRandomCell[0]][lastRandomCell[1]] = Bricks.GREEN;
  console.log(lastRandomCell);

  drawField();

  await sleep(1000 / gameSpeed);
  window.requestAnimationFrame(render);
}

drawMarks();
window.requestAnimationFrame(render);
