export class Pipe {
  constructor(canvas, gap) {
    this.x = canvas.width;
    this.width = 50;
    this.gap = gap;
    this.passed = false;
    this.speed = 3;
    
    const minHeight = 50;
    const maxHeight = canvas.height - gap - minHeight;
    this.height = Math.random() * (maxHeight - minHeight) + minHeight;
  }

  update(deltaTime) {
    const delta = deltaTime / 16;
    this.x -= this.speed * delta;
  }

  draw(ctx, canvasHeight) {
    const gradient = ctx.createLinearGradient(
      this.x, 0,
      this.x + this.width, 0
    );
    gradient.addColorStop(0, '#2ecc71');
    gradient.addColorStop(1, '#27ae60');

    ctx.fillStyle = gradient;
    
    // Top pipe
    this.drawPipe(ctx, 0, this.height);
    // Bottom pipe
    this.drawPipe(ctx, this.height + this.gap, canvasHeight - this.height - this.gap);
  }

  drawPipe(ctx, y, height) {
    ctx.fillRect(this.x, y, this.width, height);
    
    // Add pipe cap
    ctx.fillStyle = '#27ae60';
    const capHeight = 10;
    const capWidth = this.width + 10;
    ctx.fillRect(
      this.x - 5,
      y + (y === 0 ? height - capHeight : 0),
      capWidth,
      capHeight
    );
  }

  isOffscreen() {
    return this.x + this.width < 0;
  }
}