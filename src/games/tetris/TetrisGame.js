import { TouchHandler } from '../../utils/TouchHandler.js';
import { TetrisRenderer } from './TetrisRenderer.js';
import { TetrisBoard } from './TetrisBoard.js';
import { TetrominoFactory } from './TetrominoFactory.js';
import { TetrisBackground } from './TetrisBackground.js';

export class TetrisGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.board = new TetrisBoard();
    this.renderer = new TetrisRenderer(this.ctx);
    this.tetrominoFactory = new TetrominoFactory();
    this.background = new TetrisBackground(canvas);
    
    this.reset();
    this.setupControls();
  }

  reset() {
    this.board.clear();
    this.currentPiece = this.tetrominoFactory.createRandom();
    this.nextPiece = this.tetrominoFactory.createRandom();
    this.score = 0;
    this.level = 1;
    this.gameOver = false;
    this.lastUpdate = 0;
    this.dropInterval = 1000;
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      if (this.gameOver) {
        if (e.code === 'Space') this.reset();
        return;
      }

      switch (e.code) {
        case 'ArrowLeft':
          this.movePiece(-1, 0);
          break;
        case 'ArrowRight':
          this.movePiece(1, 0);
          break;
        case 'ArrowDown':
          this.movePiece(0, 1);
          break;
        case 'ArrowUp':
          this.rotatePiece();
          break;
        case 'Space':
          this.hardDrop();
          break;
      }
    });

    // Touch controls
    const touchHandler = new TouchHandler(this.canvas);
    let touchStartX = 0;
    let touchStartY = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.gameOver) return;

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      
      const deltaX = touchX - touchStartX;
      const deltaY = touchY - touchStartY;
      
      if (Math.abs(deltaX) > 30) {
        this.movePiece(Math.sign(deltaX), 0);
        touchStartX = touchX;
      }
      
      if (deltaY > 30) {
        this.movePiece(0, 1);
        touchStartY = touchY;
      }
    });

    touchHandler.onTap = () => {
      if (!this.gameOver) {
        this.rotatePiece();
      }
    };
  }

  movePiece(dx, dy) {
    const newX = this.currentPiece.x + dx;
    const newY = this.currentPiece.y + dy;
    
    if (this.board.isValidMove(this.currentPiece.shape, newX, newY)) {
      this.currentPiece.x = newX;
      this.currentPiece.y = newY;
      return true;
    }
    return false;
  }

  rotatePiece() {
    const rotated = this.currentPiece.getRotated();
    if (this.board.isValidMove(rotated, this.currentPiece.x, this.currentPiece.y)) {
      this.currentPiece.shape = rotated;
    }
  }

  hardDrop() {
    while (this.movePiece(0, 1)) {}
    this.lockPiece();
  }

  lockPiece() {
    this.board.addPiece(this.currentPiece);
    const linesCleared = this.board.clearLines();
    this.updateScore(linesCleared);
    
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.tetrominoFactory.createRandom();
    
    if (!this.board.isValidMove(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
      this.gameOver = true;
    }
  }

  updateScore(linesCleared) {
    const points = [0, 100, 300, 500, 800];
    this.score += points[linesCleared] * this.level;
    
    if (this.score > this.level * 1000) {
      this.level++;
      this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
    }
  }

  update(timestamp) {
    if (this.gameOver) return;
    
    this.background.update();
    
    if (timestamp - this.lastUpdate > this.dropInterval) {
      this.lastUpdate = timestamp;
      if (!this.movePiece(0, 1)) {
        this.lockPiece();
      }
    }
  }

  draw() {
    this.background.draw();
    this.renderer.drawBoard(this.board);
    this.renderer.drawPiece(this.currentPiece);
    this.renderer.drawNextPiece(this.nextPiece);
    this.renderer.drawScore(this.score, this.level);

    if (this.gameOver) {
      this.renderer.drawGameOver(this.score);
    }
  }
}