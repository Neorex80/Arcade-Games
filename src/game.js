import { Bird } from './entities/Bird.js';
import { Pipe } from './entities/Pipe.js';
import { ScoreEffect } from './effects/ScoreEffect.js';
import { Background } from './background/Background.js';
import { Button } from './ui/Button.js';
import { ScorePanel } from './ui/ScorePanel.js';
import { GameSocialLinks } from './ui/GameSocialLinks.js';
import { checkCollision } from './utils/collision.js';
import { Storage } from './utils/Storage.js';
import { GameState } from './states/GameState.js';
import { TouchHandler } from './utils/TouchHandler.js';

export class FlappyBird {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.background = new Background(canvas);
    this.bird = new Bird(canvas.height);
    this.pipes = [];
    this.effects = [];
    this.scorePanel = new ScorePanel();
    this.socialLinks = new GameSocialLinks();
    this.pipeGap = 150;
    this.score = 0;
    this.highScore = Storage.getHighScore();
    this.gameState = GameState.MENU;
    this.spawnInterval = 1500;
    this.lastPipeSpawn = 0;

    // Create buttons
    const centerX = canvas.width / 2 - 100;
    this.startButton = new Button(centerX, canvas.height / 2 - 30, 200, 50, 'Start Game', () => this.startGame());
    this.restartButton = new Button(centerX, canvas.height / 2 + 40, 200, 50, 'Play Again', () => this.reset());

    this.setupEvents();
  }

  setupEvents() {
    // Mouse/Touch events
    const handleClick = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const socialLinkIndex = this.socialLinks.isInside(x, y);
      if (socialLinkIndex !== -1) {
        this.socialLinks.handleClick(socialLinkIndex);
        return;
      }

      if (this.gameState === GameState.MENU && this.startButton.isInside(x, y)) {
        this.startButton.onClick();
      } else if (this.gameState === GameState.GAME_OVER && this.restartButton.isInside(x, y)) {
        this.restartButton.onClick();
      } else if (this.gameState === GameState.PLAYING) {
        this.bird.jump();
      }
    };

    const handleMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.socialLinks.hovered = this.socialLinks.isInside(x, y);

      if (this.gameState === GameState.MENU) {
        this.startButton.hovered = this.startButton.isInside(x, y);
      } else if (this.gameState === GameState.GAME_OVER) {
        this.restartButton.hovered = this.restartButton.isInside(x, y);
      }
    };

    this.canvas.addEventListener('click', handleClick);
    this.canvas.addEventListener('mousemove', handleMove);

    // Keyboard events
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        if (this.gameState === GameState.MENU) {
          this.startGame();
        } else if (this.gameState === GameState.GAME_OVER) {
          this.reset();
        } else if (this.gameState === GameState.PLAYING) {
          this.bird.jump();
        }
      }
    });

    // Touch events
    const touchHandler = new TouchHandler(this.canvas);
    touchHandler.onTap = () => {
      if (this.gameState === GameState.PLAYING) {
        this.bird.jump();
      }
    };
  }

  startGame() {
    this.gameState = GameState.PLAYING;
    this.reset();
  }

  reset() {
    this.bird.reset(this.canvas.height);
    this.pipes = [];
    this.effects = [];
    this.score = 0;
    this.gameState = GameState.PLAYING;
    this.lastPipeSpawn = 0;
  }

  spawnPipe() {
    this.pipes.push(new Pipe(this.canvas, this.pipeGap));
  }

  update(deltaTime) {
    this.background.update(deltaTime);

    if (this.gameState !== GameState.PLAYING) return;

    this.bird.update(deltaTime);

    if (Date.now() - this.lastPipeSpawn > this.spawnInterval) {
      this.spawnPipe();
      this.lastPipeSpawn = Date.now();
    }

    this.pipes.forEach(pipe => {
      pipe.update(deltaTime);

      if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
        pipe.passed = true;
        this.score++;
        
        this.effects.push(new ScoreEffect(
          this.canvas.width / 2,
          this.canvas.height / 4
        ));

        if (Storage.updateHighScore(this.score)) {
          this.highScore = this.score;
        }
      }

      if (checkCollision(this.bird, pipe)) {
        this.gameState = GameState.GAME_OVER;
      }
    });

    this.effects = this.effects.filter(effect => effect.update());
    this.pipes = this.pipes.filter(pipe => !pipe.isOffscreen());

    if (this.bird.y < 0 || this.bird.y + this.bird.size > this.canvas.height) {
      this.gameState = GameState.GAME_OVER;
    }
  }

  draw() {
    this.background.draw(this.ctx);
    this.bird.draw(this.ctx);
    this.pipes.forEach(pipe => pipe.draw(this.ctx, this.canvas.height));
    this.effects.forEach(effect => effect.draw(this.ctx));

    // Draw score panel and social links
    this.scorePanel.draw(this.ctx, this.score, this.highScore);
    this.socialLinks.draw(this.ctx);

    if (this.gameState === GameState.MENU) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Flappy Bird', this.canvas.width / 2, this.canvas.height / 3);
      
      this.startButton.draw(this.ctx);
    } else if (this.gameState === GameState.GAME_OVER) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 3);
      
      if (this.score === this.highScore && this.score > 0) {
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '32px Arial';
        this.ctx.fillText('New High Score!', this.canvas.width / 2, this.canvas.height / 2 - 50);
      }
      
      this.restartButton.draw(this.ctx);
    }
  }
}