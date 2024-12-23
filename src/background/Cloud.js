export class Cloud {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
    this.x = Math.random() * canvas.width;
  }

  reset() {
    this.x = this.canvas.width;
    this.y = Math.random() * (this.canvas.height / 2);
    this.speed = 0.5 + Math.random() * 0.5;
    this.size = 30 + Math.random() * 20;
  }

  update() {
    this.x -= this.speed;
    if (this.x + this.size < 0) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.arc(this.x + this.size * 0.5, this.y - this.size * 0.2, this.size * 0.7, 0, Math.PI * 2);
    ctx.arc(this.x + this.size * 0.8, this.y, this.size * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}