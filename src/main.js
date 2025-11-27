import { BLOCKSIZE, COLS, ROWS } from "./constant";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

ctx.canvas.width = COLS * BLOCKSIZE;
ctx.canvas.height = ROWS * BLOCKSIZE;

ctx.scale(BLOCKSIZE, BLOCKSIZE);

const reset = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
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
}

function play() {
  reset();
  const block = new Block();
  block.draw();
}

document.querySelector("#playButton").addEventListener("click", () => {
  play();
});
