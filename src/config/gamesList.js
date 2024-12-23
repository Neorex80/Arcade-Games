export const games = [
  {
    title: 'Flappy Bird',
    description: 'Navigate through pipes in this classic arcade game!',
    path: '/flappy',
    preview: {
      type: 'canvas',
      render: (ctx, width, height, time) => {
        // Bird
        const birdY = height/2 + Math.sin(time/500) * 30;
        ctx.fillStyle = '#f4d03f';
        ctx.beginPath();
        ctx.ellipse(width/3, birdY, 20, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Wing
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.ellipse(width/3 - 5, birdY - 5, 12, 8, Math.PI/4 + Math.sin(time/200) * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Pipes
        const pipeX = (width/2 + time/2) % width;
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(pipeX, 0, 40, height/2 - 70);
        ctx.fillRect(pipeX, height/2 + 70, 40, height/2 - 70);
      }
    }
  },
  {
    title: 'Pong',
    description: 'Classic table tennis game for two players!',
    path: '/pong',
    preview: {
      type: 'canvas',
      render: (ctx, width, height, time) => {
        // Center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2, height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Paddles
        ctx.fillStyle = '#fff';
        ctx.fillRect(30, height/2 - 30, 10, 60);
        ctx.fillRect(width - 40, height/2 - 30 + Math.sin(time/500) * 30, 10, 60);
        
        // Ball
        const ballX = width/2 + Math.cos(time/500) * 50;
        const ballY = height/2 + Math.sin(time/700) * 30;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  {
    title: 'Snake',
    description: 'Grow your snake by eating food, but don\'t hit the walls or yourself!',
    path: '/snake',
    preview: {
      type: 'canvas',
      render: (ctx, width, height, time) => {
        const tileSize = 20;
        const snake = [
          {x: width/2, y: height/2},
          {x: width/2 - tileSize, y: height/2},
          {x: width/2 - tileSize * 2, y: height/2}
        ];
        
        ctx.fillStyle = '#4CAF50';
        snake.forEach((segment, i) => {
          const x = segment.x + Math.cos(time/500 + i) * 5;
          const y = segment.y + Math.sin(time/500 + i) * 5;
          ctx.beginPath();
          ctx.roundRect(x, y, tileSize, tileSize, 5);
          ctx.fill();
        });
        
        ctx.fillStyle = '#ff4757';
        ctx.beginPath();
        ctx.arc(
          width/2 + 50 + Math.cos(time/300) * 20,
          height/2 + Math.sin(time/300) * 20,
          tileSize/2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  },
  {
    title: 'Tetris',
    description: 'Clear lines by stacking blocks in this timeless puzzle game!',
    path: '/tetris',
    preview: {
      type: 'canvas',
      render: (ctx, width, height, time) => {
        const blockSize = 25;
        const pieces = [
          [[1, 1], [1, 1]], // Square
          [[1, 1, 1, 1]], // Line
          [[1, 1, 1], [0, 1, 0]] // T
        ];
        
        pieces.forEach((piece, i) => {
          const offsetX = width/4 + (i * width/3);
          const offsetY = height/2 + Math.sin(time/1000 + i) * 50;
          
          ctx.fillStyle = ['#f1c40f', '#3498db', '#e74c3c'][i];
          piece.forEach((row, y) => {
            row.forEach((cell, x) => {
              if (cell) {
                ctx.beginPath();
                ctx.roundRect(
                  offsetX + x * blockSize,
                  offsetY + y * blockSize,
                  blockSize - 2,
                  blockSize - 2,
                  4
                );
                ctx.fill();
              }
            });
          });
        });
      }
    }
  },
  {
    title: 'Breakout',
    description: 'Break all the blocks with your paddle and ball!',
    path: '/breakout',
    preview: {
      type: 'canvas',
      render: (ctx, width, height, time) => {
        // Draw blocks
        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db'];
        const blockWidth = width / 8;
        const blockHeight = 20;
        
        colors.forEach((color, row) => {
          for (let col = 0; col < 8; col++) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(
              col * blockWidth + 2,
              row * blockHeight + 2,
              blockWidth - 4,
              blockHeight - 4,
              4
            );
            ctx.fill();
          }
        });

        // Draw paddle
        const paddleX = width/2 + Math.cos(time/1000) * width/4;
        ctx.fillStyle = '#fff';
        ctx.fillRect(paddleX - 40, height - 20, 80, 10);

        // Draw ball
        const ballX = width/2 + Math.cos(time/500) * 100;
        const ballY = height/2 + Math.sin(time/500) * 50;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  {
    title: 'Space Invaders',
    description: 'Defend Earth from alien invasion in this arcade classic!',
    path: '/invaders',
    preview: {
      type: 'canvas',
      render: (ctx, width, height, time) => {
        // Draw player ship
        const shipX = width/2 + Math.cos(time/1000) * width/4;
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(shipX, height - 20);
        ctx.lineTo(shipX - 20, height);
        ctx.lineTo(shipX + 20, height);
        ctx.closePath();
        ctx.fill();

        // Draw aliens
        const aliens = [];
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 6; col++) {
            aliens.push({
              x: col * 50 + width/4,
              y: row * 40 + 40 + Math.sin(time/1000 + col) * 10
            });
          }
        }

        aliens.forEach(alien => {
          ctx.fillStyle = '#e74c3c';
          ctx.beginPath();
          ctx.roundRect(
            alien.x - 15,
            alien.y - 15,
            30,
            30,
            5
          );
          ctx.fill();
        });

        // Draw laser
        if (Math.sin(time/200) > 0) {
          ctx.strokeStyle = '#f1c40f';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(shipX, height - 20);
          ctx.lineTo(shipX, height/2 + Math.random() * height/4);
          ctx.stroke();
        }
      }
    }
  }
];