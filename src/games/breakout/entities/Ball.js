export class Ball {
  constructor(canvas) {
    this.canvas = canvas;
    this.size = 8;
    this.baseSpeed = 4; // Reduced initial speed
    this.speedIncrease = 0.05; // Smaller speed increase
    this.maxSpeed = 8;
    this.reset();
  }

  reset() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 50;
    this.dx = 0;
    this.dy = 0;
    this.isMoving = false;
    this.speed = this.baseSpeed;
  }

  setPosition(x) {
    if (!this.isMoving) {
      this.x = x;
    }
  }

  launch() {
    if (!this.isMoving) {
      this.isMoving = true;
      // Launch at a more predictable angle
      const angle = -Math.PI / 3; // 60 degrees upward
      this.dx = Math.cos(angle) * this.speed;
      this.dy = Math.sin(angle) * this.speed;
    }
  }

  update(deltaTime) {
    if (!this.isMoving) return;

    const delta = deltaTime / 16;
    this.x += this.dx * delta;
    this.y += this.dy * delta;

    // Wall collisions
    if (this.x - this.size < 0 || this.x + this.size > this.canvas.width) {
      this.dx = -this.dx;
      this.x = Math.max(this.size, Math.min(this.canvas.width - this.size, this.x));
    }
    if (this.y - this.size < 0) {
      this.dy = -this.dy;
      this.y = this.size;
    }
  }

  bounceOffPaddle(paddle) {
    // Calculate relative position for angle
    const relativeX = (this.x - paddle.x) / (paddle.width / 2);
    const angle = relativeX * Math.PI / 3; // Max 60 degree bounce
    
    this.speed = Math.min(this.speed + this.speedIncrease, this.maxSpeed);
    this.dx = Math.sin(angle) * this.speed;
    this.dy = -Math.cos(angle) * this.speed;
    
    // Ensure minimum vertical velocity
    if (Math.abs(this.dy) < this.speed * 0.5) {
      this.dy = -this.speed * 0.5 * Math.sign(this.dy);
    }
  }

  checkPaddleCollision(paddle) {
    return this.y + this.size > paddle.y &&
           this.y - this.size < paddle.y + paddle.height &&
           this.x + this.size > paddle.x - paddle.width / 2 &&
           this.x - this.size < paddle.x + paddle.width / 2;
  }

  isLost() {
    return this.y - this.size > this.canvas.height;
  }

  draw(ctx) {
    // Add trail effect
    ctx.save();
    for (let i = 0; i < 3; i++) {
      const alpha = 0.3 - i * 0.1;
      const offset = i * 4;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(
        this.x - this.dx * offset,
        this.y - this.dy * offset,
        this.size - i,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Main ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}