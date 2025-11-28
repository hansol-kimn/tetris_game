import { BLOCKSIZE, COLS, KEY, ROWS } from "./constant";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

ctx.canvas.width = COLS * BLOCKSIZE;
ctx.canvas.height = ROWS * BLOCKSIZE;

ctx.scale(BLOCKSIZE, BLOCKSIZE);

let block;

const reset = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

const isInsideBoard = (x, y) => {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS;
};

console.table(reset());

class Block {
  x;
  y;
  color;
  shape;
  ctx;

  constructor() {
    this.ctx = ctx;
    this.spawn();
  }

  spawn() {
    this.color = "blue";
    this.shape = [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];

    this.x = 3;
    this.y = 0;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  move(p) {
    this.x = p.x;
    this.y = p.y;
  }
}

function play() {
  reset();
  block = new Block();
  block.draw();
}

document.querySelector("#playButton").addEventListener("click", () => {
  play();
});

const moves = {
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.DOWM]: (p) => ({ ...p, y: p.y + 1 }),
};

document.addEventListener("keydown", (event) => {
  if (block && moves[event.keyCode]) {
    const isValidMove = (p) => {
      return block.shape.every((row, dy) => {
        return row.every((cell, dx) => {
          if (cell === 0) return true;

          const newX = p.x + dx;
          const newY = p.y + dy;

          if (!isInsideBoard(newX, newY)) return false;
          return true;
        });
      });
    };

    const position = moves[event.keyCode]({ x: block.x, y: block.y });
    if (isValidMove(position)) {
      block.move(position);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      block.draw();
    }
  }
});
