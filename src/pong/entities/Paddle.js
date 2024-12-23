export class Paddle {
  constructor(x, y, side) {
    this.x = x;
    this.y = y;
    this.width = 12;
    this.height = 100;
    this.speed = 0;
    this.maxSpeed = 7;
    this.side = side;
    this.acceleration = 0.5;
    this.deceleration = 0.8;
  }

  moveUp() {
    this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed);
  }

  moveDown() {
    this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
  }

  stop() {
    this.speed *= this.deceleration;
    if (Math.abs(this.speed) < 0.1) this.speed = 0;
  }

  update(deltaTime, canvasHeight) {
    const delta = Math.min(deltaTime / 16, 2);
    this.y += this.speed * delta;
    
    // Boundary collision
    if (this.y < 0) {
      this.y = 0;
      this.speed = 0;
    }
    if (this.y + this.height > canvasHeight) {
      this.y = canvasHeight - this.height;
      this.speed = 0;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    ctx.restore();
  }
}