import './src/styles/index.css';
import { HomePage } from './src/pages/HomePage.js';
import { FlappyBird } from './src/game.js';
import { PongGame } from './src/pong/game.js';
import { SnakeGame } from './src/games/snake/SnakeGame.js';
import { TetrisGame } from './src/games/tetris/TetrisGame.js';
import { SpaceInvadersGame } from './src/games/invaders/SpaceInvadersGame.js';
import { BreakoutGame } from './src/games/breakout/BreakoutGame.js';

// Initialize the application
function initApp() {
  const app = document.querySelector('#app');
  const path = window.location.pathname;

  // Simple router
  if (path === '/' || path === '/games') {
    app.innerHTML = ''; // Clear existing content
    app.appendChild(HomePage());
  } else if (path === '/flappy') {
    app.innerHTML = `
      <div class="game-container">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        <div class="instructions">
          <p>Press Space or Touch to jump</p>
        </div>
      </div>
    `;

    const canvas = document.getElementById('gameCanvas');
    const game = new FlappyBird(canvas);
    gameLoop(game);
  } else if (path === '/pong') {
    app.innerHTML = `
      <div class="game-container">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        <div class="instructions">
          <p>Use W/S keys or swipe to move paddle</p>
          <p>Press ESC to pause</p>
        </div>
      </div>
    `;

    const canvas = document.getElementById('gameCanvas');
    const game = new PongGame(canvas);
    gameLoop(game);
  } else if (path === '/snake') {
    app.innerHTML = `
      <div class="game-container">
        <canvas id="gameCanvas" width="600" height="600"></canvas>
        <div class="instructions">
          <p>Use Arrow keys or Swipe to change direction</p>
        </div>
      </div>
    `;

    const canvas = document.getElementById('gameCanvas');
    const game = new SnakeGame(canvas);
    gameLoop(game);
  } else if (path === '/tetris') {
    app.innerHTML = `
      <div class="game-container">
        <canvas id="gameCanvas" width="600" height="700"></canvas>
        <div class="instructions">
          <p>Arrow keys to move/rotate</p>
          <p>Space for hard drop</p>
        </div>
      </div>
    `;

    const canvas = document.getElementById('gameCanvas');
    const game = new TetrisGame(canvas);
    gameLoop(game);
  } else if (path === '/invaders') {
    app.innerHTML = `
      <div class="game-container">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        <div class="instructions">
          <p>Arrow keys or touch to move</p>
          <p>Space or tap to shoot</p>
        </div>
      </div>
    `;

    const canvas = document.getElementById('gameCanvas');
    const game = new SpaceInvadersGame(canvas);
    gameLoop(game);
  } else if (path === '/breakout') {
    app.innerHTML = `
      <div class="game-container">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        <div class="instructions">
          <p>Move paddle with mouse/touch</p>
          <p>Space or tap to launch ball</p>
        </div>
      </div>
    `;

    const canvas = document.getElementById('gameCanvas');
    const game = new BreakoutGame(canvas);
    gameLoop(game);
  }
}

// Game loop function
function gameLoop(game) {
  let lastTime = 0;
  
  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);