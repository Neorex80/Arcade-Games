export class Paddle {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width < 600 ? 80 : 100;
    this.height = 15;
    this.reset();
  }

  reset() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.targetX = this.x;
    this.speed = 0;
    this.maxSpeed = 12; // Reduced max speed for better control
    this.acceleration = 0.8; // Reduced acceleration
    this.deceleration = 0.85; // Smoother deceleration
  }

  setPosition(x) {
    // Add interpolation for smoother movement
    this.targetX = Math.max(this.width / 2, Math.min(this.canvas.width - this.width / 2, x));
  }

  update(deltaTime) {
    const delta = deltaTime / 16;
    const dx = this.targetX - this.x;
    
    // Smooth movement with easing
    if (Math.abs(dx) > 0.1) {
      const targetSpeed = Math.sign(dx) * Math.min(Math.abs(dx) * 0.2, this.maxSpeed);
      this.speed += (targetSpeed - this.speed) * this.acceleration;
    } else {
      this.speed *= this.deceleration;
    }

    this.x += this.speed * delta;
    this.x = Math.max(this.width / 2, Math.min(this.canvas.width - this.width / 2, this.x));
  }

  draw(ctx) {
    // Add visual feedback
    const gradient = ctx.createLinearGradient(
      this.x - this.width / 2, this.y,
      this.x + this.width / 2, this.y + this.height
    );
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#2E7D32');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(
      this.x - this.width / 2,
      this.y,
      this.width,
      this.height,
      5
    );
    ctx.fill();

    // Add highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(
      this.x - this.width / 2,
      this.y,
      this.width,
      this.height / 2,
      5
    );
    ctx.fill();
  }
}