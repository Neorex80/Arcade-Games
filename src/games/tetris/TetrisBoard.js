export class TetrisBoard {
  constructor() {
    this.width = 10;
    this.height = 20;
    this.clear();
  }

  clear() {
    this.grid = Array(this.height).fill().map(() => Array(this.width).fill(0));
  }

  isValidMove(shape, x, y) {
    return shape.every((row, dy) =>
      row.every((value, dx) => {
        if (!value) return true;
        const newX = x + dx;
        const newY = y + dy;
        return (
          newX >= 0 &&
          newX < this.width &&
          newY >= 0 &&
          newY < this.height &&
          !this.grid[newY][newX]
        );
      })
    );
  }

  addPiece(piece) {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.grid[piece.y + y][piece.x + x] = piece.color;
        }
      });
    });
  }

  clearLines() {
    let linesCleared = 0;
    
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.grid[y].every(cell => cell !== 0)) {
        this.grid.splice(y, 1);
        this.grid.unshift(Array(this.width).fill(0));
        linesCleared++;
        y++; // Check the same row again
      }
    }
    
    return linesCleared;
  }
}