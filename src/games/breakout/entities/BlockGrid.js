export class BlockGrid {
  constructor(canvas) {
    this.canvas = canvas;
    this.blockColors = [
      { color: '#e74c3c', points: 100 },
      { color: '#e67e22', points: 80 },
      { color: '#f1c40f', points: 60 },
      { color: '#2ecc71', points: 40 }
    ];
    this.reset(1);
  }

  reset(level) {
    // Start with fewer rows and increase gradually
    this.rows = Math.min(3 + Math.floor((level - 1) / 2), 8);
    this.cols = 8;
    this.blocks = [];
    this.blockWidth = (this.canvas.width - 100) / this.cols;
    this.blockHeight = 30;

    // Start with lower density and increase gradually
    const density = Math.min(0.5 + (level - 1) * 0.05, 0.9);
    const maxHealth = Math.min(Math.ceil(level / 4), 3);

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (Math.random() < density) {
          const colorIndex = Math.min(Math.floor(row / 2), 3);
          // First level blocks have 1 health
          const health = level === 1 ? 1 : Math.min(maxHealth, Math.ceil((this.rows - row) / 2));
          
          this.blocks.push({
            x: col * this.blockWidth + 50 + this.blockWidth / 2,
            y: row * this.blockHeight + 50 + this.blockHeight / 2,
            width: this.blockWidth - 4,
            height: this.blockHeight - 4,
            color: this.blockColors[colorIndex].color,
            points: this.blockColors[colorIndex].points * health,
            health: health
          });
        }
      }
    }
  }

  checkCollision(ball) {
    for (let i = this.blocks.length - 1; i >= 0; i--) {
      const block = this.blocks[i];
      
      // Check if ball collides with block
      if (ball.x + ball.size > block.x - block.width / 2 &&
          ball.x - ball.size < block.x + block.width / 2 &&
          ball.y + ball.size > block.y - block.height / 2 &&
          ball.y - ball.size < block.y + block.height / 2) {
        
        // Determine bounce direction
        const dx = ball.x - block.x;
        const dy = ball.y - block.y;
        
        if (Math.abs(dx / (block.width / 2)) > Math.abs(dy / (block.height / 2))) {
          ball.dx = -ball.dx; // Horizontal bounce
        } else {
          ball.dy = -ball.dy; // Vertical bounce
        }

        // Reduce block health
        block.health--;
        
        // If block is destroyed, remove it
        if (block.health <= 0) {
          const hitBlock = this.blocks[i];
          this.blocks.splice(i, 1);
          return hitBlock;
        }
        
        // Block was hit but not destroyed
        return { x: block.x, y: block.y, color: block.color, points: 10 };
      }
    }
    return null;
  }

  isEmpty() {
    return this.blocks.length === 0;
  }

  draw(ctx) {
    this.blocks.forEach(block => {
      // Create gradient for 3D effect
      const gradient = ctx.createLinearGradient(
        block.x - block.width / 2,
        block.y - block.height / 2,
        block.x + block.width / 2,
        block.y + block.height / 2
      );
      gradient.addColorStop(0, block.color);
      gradient.addColorStop(1, this.darkenColor(block.color));

      // Draw block body
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(
        block.x - block.width / 2,
        block.y - block.height / 2,
        block.width,
        block.height,
        4
      );
      ctx.fill();

      // Add highlight for 3D effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.roundRect(
        block.x - block.width / 2,
        block.y - block.height / 2,
        block.width,
        block.height / 2,
        4
      );
      ctx.fill();

      // Show health indicator for blocks with more than 1 health
      if (block.health > 1) {
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(block.health.toString(), block.x, block.y);
      }
    });
  }

  darkenColor(color) {
    const r = parseInt(color.substr(1,2), 16);
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);
    return `rgb(${r*0.7},${g*0.7},${b*0.7})`;
  }
}