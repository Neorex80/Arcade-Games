import { Paddle } from './entities/Paddle.js';
import { Ball } from './entities/Ball.js';
import { BlockGrid } from './entities/BlockGrid.js';
import { Background } from './Background.js';
import { ParticleSystem } from './effects/ParticleSystem.js';
import { HomeButton } from '../../ui/HomeButton.js';
import { TouchHandler } from '../../utils/TouchHandler.js';

export class BreakoutGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.background = new Background(canvas);
    this.paddle = new Paddle(canvas);
    this.ball = new Ball(canvas);
    this.blocks = new BlockGrid(canvas);
    this.particles = new ParticleSystem();
    this.homeButton = new HomeButton();
    
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    this.paused = false;
    
    this.setupControls();
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        this.paused = !this.paused;
        return;
      }
      if (this.gameOver || this.paused) return;
      if (e.code === 'Space' && !this.ball.isMoving) {
        this.ball.launch();
      }
    });

    // Mouse/Touch controls
    const touchHandler = new TouchHandler(this.canvas);
    touchHandler.onTouchMove = (x) => {
      if (!this.gameOver && !this.paused) {
        this.paddle.setPosition(x);
        if (!this.ball.isMoving) {
          this.ball.setPosition(x);
        }
      }
    };
    touchHandler.onTap = () => {
      if (!this.gameOver && !this.paused && !this.ball.isMoving) {
        this.ball.launch();
      }
    };
  }

  update(deltaTime) {
    if (this.gameOver || this.paused) return;

    this.background.update(deltaTime);
    this.paddle.update(deltaTime);
    this.ball.update(deltaTime);
    this.particles.update(deltaTime);

    // Ball-Paddle collision
    if (this.ball.checkPaddleCollision(this.paddle)) {
      this.ball.bounceOffPaddle(this.paddle);
    }

    // Ball-Block collisions
    const hitBlock = this.blocks.checkCollision(this.ball);
    if (hitBlock) {
      this.score += hitBlock.points;
      this.particles.createExplosion(hitBlock.x, hitBlock.y, hitBlock.color);
    }

    // Check if ball is lost
    if (this.ball.isLost()) {
      this.lives--;
      if (this.lives <= 0) {
        this.gameOver = true;
      } else {
        this.resetBall();
      }
    }

    // Check level completion
    if (this.blocks.isEmpty()) {
      this.level++;
      this.blocks.reset(this.level);
      this.resetBall();
    }
  }

  draw() {
    this.background.draw(this.ctx);
    this.blocks.draw(this.ctx);
    this.paddle.draw(this.ctx);
    this.ball.draw(this.ctx);
    this.particles.draw(this.ctx);
    this.homeButton.draw(this.ctx);

    // Draw HUD
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px "Press Start 2P"';
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);
    this.ctx.fillText(`Level: ${this.level}`, this.canvas.width - 150, 40);
    
    // Draw lives
    for (let i = 0; i < this.lives; i++) {
      this.ctx.fillStyle = '#f00';
      this.ctx.beginPath();
      this.ctx.arc(60 + i * 30, 60, 8, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if (this.gameOver) {
      this.drawGameOver();
    } else if (this.paused) {
      this.drawPaused();
    }
  }

  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
    
    this.ctx.font = '24px "Press Start 2P"';
    this.ctx.fillText(
      `Final Score: ${this.score}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 60
    );
  }

  drawPaused() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
  }

  resetBall() {
    this.ball.reset();
    this.ball.setPosition(this.paddle.x);
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    this.paused = false;
    this.paddle.reset();
    this.resetBall();
    this.blocks.reset(this.level);
    this.particles.clear();
  }
}