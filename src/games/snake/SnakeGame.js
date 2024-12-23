import { TouchHandler } from '../../utils/TouchHandler.js';
import { SnakeBackground } from './SnakeBackground.js';
import { SnakeRenderer } from './SnakeRenderer.js';

export class SnakeGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = 20;
    this.tileSize = canvas.width / this.gridSize;
    
    this.background = new SnakeBackground(canvas);
    this.renderer = new SnakeRenderer(this.ctx, this.tileSize);
    
    this.reset();
    this.setupControls();
  }

  reset() {
    this.snake = [{x: 10, y: 10}];
    this.direction = {x: 1, y: 0};
    this.food = this.spawnFood();
    this.score = 0;
    this.gameOver = false;
    this.lastUpdate = 0;
    this.updateInterval = 150;
  }

  spawnFood() {
    while (true) {
      const food = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
      
      // Check if food spawned on snake
      const onSnake = this.snake.some(segment => 
        segment.x === food.x && segment.y === food.y
      );
      
      if (!onSnake) return food;
    }
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      if (this.gameOver) {
        if (e.code === 'Space') this.reset();
        return;
      }

      const newDirection = {
        'ArrowUp': {x: 0, y: -1},
        'ArrowDown': {x: 0, y: 1},
        'ArrowLeft': {x: -1, y: 0},
        'ArrowRight': {x: 1, y: 0}
      }[e.code];

      if (newDirection && !this.isOppositeDirection(newDirection)) {
        this.direction = newDirection;
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
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const newDirection = {x: Math.sign(deltaX), y: 0};
        if (!this.isOppositeDirection(newDirection)) {
          this.direction = newDirection;
        }
      } else {
        const newDirection = {x: 0, y: Math.sign(deltaY)};
        if (!this.isOppositeDirection(newDirection)) {
          this.direction = newDirection;
        }
      }
    });
  }

  isOppositeDirection(newDir) {
    return this.direction.x === -newDir.x && this.direction.y === -newDir.y;
  }

  update(timestamp) {
    if (this.gameOver) return;
    
    if (timestamp - this.lastUpdate > this.updateInterval) {
      this.lastUpdate = timestamp;
      
      // Move snake
      const head = {...this.snake[0]};
      head.x += this.direction.x;
      head.y += this.direction.y;
      
      // Check wall collision
      if (head.x < 0 || head.x >= this.gridSize || 
          head.y < 0 || head.y >= this.gridSize) {
        this.gameOver = true;
        return;
      }
      
      // Check self collision
      if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        this.gameOver = true;
        return;
      }
      
      this.snake.unshift(head);
      
      // Check food collision
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score++;
        this.food = this.spawnFood();
        // Speed up the game
        this.updateInterval = Math.max(50, this.updateInterval - 2);
      } else {
        this.snake.pop();
      }
    }
  }

  draw() {
    this.background.draw();
    this.renderer.drawSnake(this.snake);
    this.renderer.drawFood(this.food);

    // Draw score
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '24px "Press Start 2P"';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);

    if (this.gameOver) {
      this.drawGameOver();
    }
  }

  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
    
    this.ctx.font = '24px "Press Start 2P"';
    this.ctx.fillText(
      `Final Score: ${this.score}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
    
    this.ctx.font = '16px "Press Start 2P"';
    this.ctx.fillText(
      'Press SPACE to play again',
      this.canvas.width / 2,
      this.canvas.height / 2 + 100
    );
  }
}