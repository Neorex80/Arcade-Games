import { Ball } from './entities/Ball.js';
import { Paddle } from './entities/Paddle.js';
import { ComputerPlayer } from './ai/ComputerPlayer.js';
import { HomeButton } from '../ui/HomeButton.js';
import { ScorePanel } from './ui/ScorePanel.js';

export class PongGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Game objects
    this.playerPaddle = new Paddle(50, canvas.height / 2 - 50, 'left');
    this.computerPaddle = new Paddle(canvas.width - 50, canvas.height / 2 - 50, 'right');
    this.ball = new Ball(canvas.width / 2, canvas.height / 2);
    this.ai = new ComputerPlayer();
    
    // UI elements
    this.homeButton = new HomeButton();
    this.scorePanel = new ScorePanel();
    
    // Game state
    this.playerScore = 0;
    this.computerScore = 0;
    this.isPaused = false;
    
    this.bindControls();
  }

  bindControls() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'w' || e.key === 'W') this.playerPaddle.moveUp();
      if (e.key === 's' || e.key === 'S') this.playerPaddle.moveDown();
      if (e.key === 'Escape') this.isPaused = !this.isPaused;
    });

    window.addEventListener('keyup', (e) => {
      if ((e.key === 'w' || e.key === 'W') && this.playerPaddle.speed < 0) this.playerPaddle.stop();
      if ((e.key === 's' || e.key === 'S') && this.playerPaddle.speed > 0) this.playerPaddle.stop();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      
      // Update home button hover state
      const mouseX = e.clientX - rect.left;
      this.homeButton.hovered = this.homeButton.isInside(mouseX, mouseY);
      
      // Update paddle position
      if (!this.isPaused) {
        this.playerPaddle.y = mouseY - this.playerPaddle.height / 2;
      }
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.homeButton.isInside(
        e.clientX - rect.left,
        e.clientY - rect.top
      )) {
        window.location.href = '/';
      }
    });
  }

  update(deltaTime) {
    if (this.isPaused) return;

    // Update paddles
    this.playerPaddle.update(deltaTime, this.canvas.height);
    
    // Update AI
    const aiMove = this.ai.calculateMove(this.computerPaddle, this.ball, this.canvas.height);
    if (aiMove > 0) this.computerPaddle.moveDown();
    else if (aiMove < 0) this.computerPaddle.moveUp();
    else this.computerPaddle.stop();
    
    this.computerPaddle.update(deltaTime, this.canvas.height);

    // Update ball
    this.ball.update(deltaTime);

    // Check collisions
    if (this.ball.y - this.ball.size <= 0 || 
        this.ball.y + this.ball.size >= this.canvas.height) {
      this.ball.reverseY();
    }

    // Paddle collisions
    if (this.ball.checkPaddleCollision(this.playerPaddle) || 
        this.ball.checkPaddleCollision(this.computerPaddle)) {
      this.ball.reverseX();
      this.ball.increaseSpeed();
    }

    // Score points
    if (this.ball.x < 0) {
      this.computerScore++;
      this.ball.reset(this.canvas.width / 2, this.canvas.height / 2);
    } else if (this.ball.x > this.canvas.width) {
      this.playerScore++;
      this.ball.reset(this.canvas.width / 2, this.canvas.height / 2);
    }
  }

  draw() {
    // Clear canvas with gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw center line
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.setLineDash([10, 10]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw game objects
    this.playerPaddle.draw(this.ctx);
    this.computerPaddle.draw(this.ctx);
    this.ball.draw(this.ctx);
    
    // Draw UI
    this.homeButton.draw(this.ctx);
    this.scorePanel.draw(this.ctx, this.playerScore, this.computerScore);

    // Draw pause overlay
    if (this.isPaused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '48px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    }
  }
}