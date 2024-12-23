export class TetrisRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.blockSize = 30;
    this.boardX = 50;
    this.boardY = 50;
  }

  clear() {
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawBlock(x, y, color) {
    const gradient = this.ctx.createLinearGradient(
      x * this.blockSize + this.boardX,
      y * this.blockSize + this.boardY,
      (x + 1) * this.blockSize + this.boardX,
      (y + 1) * this.blockSize + this.boardY
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, this.darken(color));

    this.ctx.fillStyle = gradient;
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    this.ctx.roundRect(
      x * this.blockSize + this.boardX,
      y * this.blockSize + this.boardY,
      this.blockSize - 1,
      this.blockSize - 1,
      4
    );
    this.ctx.fill();
    this.ctx.stroke();

    // Highlight
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.beginPath();
    this.ctx.roundRect(
      x * this.blockSize + this.boardX + 2,
      y * this.blockSize + this.boardY + 2,
      this.blockSize - 4,
      this.blockSize - 4,
      2
    );
    this.ctx.fill();
  }

  darken(color) {
    const r = parseInt(color.substr(1,2), 16);
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);
    return `rgb(${r*0.7},${g*0.7},${b*0.7})`;
  }

  drawBoard(board) {
    // Draw background grid
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        this.ctx.strokeRect(
          x * this.blockSize + this.boardX,
          y * this.blockSize + this.boardY,
          this.blockSize,
          this.blockSize
        );
      }
    }

    // Draw placed blocks
    board.grid.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          this.drawBlock(x, y, color);
        }
      });
    });
  }

  drawPiece(piece) {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.drawBlock(piece.x + x, piece.y + y, piece.color);
        }
      });
    });
  }

  drawNextPiece(piece) {
    const nextX = 400;
    const nextY = 100;

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px "Press Start 2P"';
    this.ctx.fillText('Next:', nextX, nextY - 20);

    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const blockX = nextX + x * this.blockSize;
          const blockY = nextY + y * this.blockSize;
          
          this.ctx.fillStyle = piece.color;
          this.ctx.strokeStyle = '#000';
          this.ctx.lineWidth = 1;
          
          this.ctx.beginPath();
          this.ctx.roundRect(
            blockX,
            blockY,
            this.blockSize - 1,
            this.blockSize - 1,
            4
          );
          this.ctx.fill();
          this.ctx.stroke();
        }
      });
    });
  }

  drawScore(score, level) {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px "Press Start 2P"';
    this.ctx.fillText(`Score: ${score}`, 400, 200);
    this.ctx.fillText(`Level: ${level}`, 400, 240);
  }

  drawGameOver(finalScore) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      'GAME OVER',
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 - 50
    );
    
    this.ctx.font = '24px "Press Start 2P"';
    this.ctx.fillText(
      `Final Score: ${finalScore}`,
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 + 20
    );
    
    this.ctx.font = '16px "Press Start 2P"';
    this.ctx.fillText(
      'Press SPACE to play again',
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2 + 80
    );
  }
}