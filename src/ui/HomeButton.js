export class HomeButton {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.padding = 10;
    this.hovered = false;
    this.updatePosition(800, 600);
  }

  updatePosition(canvasWidth, canvasHeight) {
    // Position in top-right corner with padding
    this.x = canvasWidth - this.width - this.padding;
    this.y = this.padding;
  }

  isInside(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }

  draw(ctx) {
    // Update position based on current canvas size
    this.updatePosition(ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    
    // Semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.roundRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4, 10);
    ctx.fill();

    // Button background
    ctx.fillStyle = this.hovered ? '#4CAF50' : '#2ecc71';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 8);
    ctx.fill();
    ctx.stroke();

    // Home icon
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏠', this.x + this.width / 2, this.y + this.height / 2);
    
    ctx.restore();
  }
}