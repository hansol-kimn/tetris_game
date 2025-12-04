const COLS = 10;
const ROWS = 20;
const BLOCKSIZE = 30;

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  DOWM: 40,
  SPACE: 32,
  Z: 90,
  X: 88,
};

const ROTATION = {
  LEFT: "left",
  RIGHT: "right",
};

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
    this.hardDropped = false;
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
    if (!this.hardDropped) {
      this.x = p.x;
      this.y = p.y;
    }
    this.shape = p.shape;
  }

  rotate(piece, direction) {
    let p = JSON.parse(JSON.stringify(piece));

    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }
    // Reverse the order of the columns.
    if (direction === ROTATION.RIGHT) {
      p.shape.forEach((row) => row.reverse());
    } else if (direction === ROTATION.LEFT) {
      p.shape.reverse();
    }
    return p;
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
  [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.Z]: (p) => block.rotate(p, ROTATION.LEFT),
  [KEY.X]: (p) => block.rotate(p, ROTATION.RIGHT),
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

    const position = moves[event.keyCode]({ x: block.x, y: block.y, shape: block.shape });
    if (event.keyCode === KEY.SPACE) {
      while (isValidMove(position)) {
        block.move(position);
        position.y++;
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      block.draw();
      return;
    }
    if (isValidMove(position)) {
      block.move(position);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      block.draw();
    }
  }
});
