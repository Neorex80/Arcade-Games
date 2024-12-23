import { Player } from './entities/Player.js';
import { AlienGrid } from './entities/AlienGrid.js';
import { Background } from './Background.js';
import { ParticleSystem } from './effects/ParticleSystem.js';
import { SoundManager } from './audio/SoundManager.js';
import { HomeButton } from '../../ui/HomeButton.js';
import { TouchHandler } from '../../utils/TouchHandler.js';

export class SpaceInvadersGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.background = new Background(canvas);
    this.player = new Player(canvas);
    this.alienGrid = new AlienGrid(canvas);
    this.particles = new ParticleSystem();
    this.sounds = new SoundManager();
    this.homeButton = new HomeButton();
    
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    this.paused = false;
    
    this.setupControls();
    this.sounds.playBackgroundMusic();
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      if (this.gameOver) {
        if (e.code === 'Space') this.reset();
        return;
      }

      if (e.code === 'Escape') {
        this.paused = !this.paused;
        return;
      }

      if (this.paused) return;

      switch (e.code) {
        case 'ArrowLeft':
          this.player.moveLeft();
          break;
        case 'ArrowRight':
          this.player.moveRight();
          break;
        case 'Space':
          this.player.shoot();
          this.sounds.playShoot();
          break;
      }
    });

    // Touch controls
    const touchHandler = new TouchHandler(this.canvas);
    touchHandler.onTouchMove = (x) => {
      if (!this.gameOver && !this.paused) {
        this.player.setPosition(x);
      }
    };
    touchHandler.onTap = () => {
      if (!this.gameOver && !this.paused) {
        this.player.shoot();
        this.sounds.playShoot();
      }
    };
  }

  update(deltaTime) {
    if (this.gameOver || this.paused) return;

    this.background.update(deltaTime);
    this.player.update(deltaTime);
    this.alienGrid.update(deltaTime);
    this.particles.update(deltaTime);

    // Check collisions
    this.player.projectiles.forEach((projectile, pIndex) => {
      if (this.alienGrid.checkCollision(projectile)) {
        this.player.projectiles.splice(pIndex, 1);
        this.score += 100;
        this.sounds.playExplosion();
        this.particles.createExplosion(projectile.x, projectile.y);
      }
    });

    // Check alien projectiles
    this.alienGrid.projectiles.forEach((projectile, index) => {
      if (this.player.checkCollision(projectile)) {
        this.alienGrid.projectiles.splice(index, 1);
        this.lives--;
        this.sounds.playPlayerHit();
        this.particles.createExplosion(this.player.x, this.player.y);
        
        if (this.lives <= 0) {
          this.gameOver = true;
        }
      }
    });

    // Check level completion
    if (this.alienGrid.isEmpty()) {
      this.level++;
      this.alienGrid.reset(this.level);
      this.sounds.playLevelUp();
    }

    // Check game over
    if (this.alienGrid.hasReachedBottom()) {
      this.gameOver = true;
    }
  }

  draw() {
    this.background.draw(this.ctx);
    this.player.draw(this.ctx);
    this.alienGrid.draw(this.ctx);
    this.particles.draw(this.ctx);
    this.homeButton.draw(this.ctx);

    // Draw HUD
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px "Press Start 2P"';
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);
    this.ctx.fillText(`Level: ${this.level}`, this.canvas.width - 150, 40);
    
    // Draw lives
    for (let i = 0; i < this.lives; i++) {
      this.player.drawShip(this.ctx, 80 + i * 40, 60, 0.5);
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
    
    this.ctx.font = '16px "Press Start 2P"';
    this.ctx.fillText(
      'Press SPACE to play again',
      this.canvas.width / 2,
      this.canvas.height / 2 + 120
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

  reset() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    this.paused = false;
    this.player.reset();
    this.alienGrid.reset(this.level);
    this.particles.clear();
  }
}