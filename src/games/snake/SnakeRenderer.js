export class SnakeRenderer {
  constructor(ctx, tileSize) {
    this.ctx = ctx;
    this.tileSize = tileSize;
  }

  drawSnake(snake) {
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      
      // Snake body gradient
      const gradient = this.ctx.createLinearGradient(
        segment.x * this.tileSize,
        segment.y * this.tileSize,
        (segment.x + 1) * this.tileSize,
        (segment.y + 1) * this.tileSize
      );
      gradient.addColorStop(0, isHead ? '#66bb6a' : '#4CAF50');
      gradient.addColorStop(1, isHead ? '#43a047' : '#388e3c');
      
      this.ctx.fillStyle = gradient;
      
      // Draw segment with rounded corners
      this.ctx.beginPath();
      this.ctx.roundRect(
        segment.x * this.tileSize + 1,
        segment.y * this.tileSize + 1,
        this.tileSize - 2,
        this.tileSize - 2,
        isHead ? 8 : 4
      );
      this.ctx.fill();

      // Add scales effect
      if (!isHead) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.beginPath();
        this.ctx.ellipse(
          segment.x * this.tileSize + this.tileSize / 2,
          segment.y * this.tileSize + this.tileSize / 2,
          this.tileSize / 4,
          this.tileSize / 6,
          0,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }

      // Draw eyes for head
      if (isHead) {
        this.drawEyes(segment);
      }
    });
  }

  drawEyes(head) {
    const eyeSize = this.tileSize / 6;
    const eyeOffset = this.tileSize / 4;
    
    // Eyes
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(
      head.x * this.tileSize + eyeOffset,
      head.y * this.tileSize + eyeOffset,
      eyeSize,
      0,
      Math.PI * 2
    );
    this.ctx.arc(
      head.x * this.tileSize + this.tileSize - eyeOffset,
      head.y * this.tileSize + eyeOffset,
      eyeSize,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Pupils
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(
      head.x * this.tileSize + eyeOffset,
      head.y * this.tileSize + eyeOffset,
      eyeSize / 2,
      0,
      Math.PI * 2
    );
    this.ctx.arc(
      head.x * this.tileSize + this.tileSize - eyeOffset,
      head.y * this.tileSize + eyeOffset,
      eyeSize / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawFood(food) {
    const x = (food.x + 0.5) * this.tileSize;
    const y = (food.y + 0.5) * this.tileSize;
    
    // Glow effect
    this.ctx.shadowColor = '#ff6b6b';
    this.ctx.shadowBlur = 15;
    
    // Apple shape
    this.ctx.fillStyle = '#ff4757';
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.tileSize / 2.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Leaf
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.beginPath();
    this.ctx.ellipse(
      x + 2,
      y - this.tileSize / 3,
      this.tileSize / 6,
      this.tileSize / 4,
      Math.PI / 4,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    this.ctx.shadowBlur = 0;
  }
}