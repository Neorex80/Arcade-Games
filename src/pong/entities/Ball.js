export class Ball {
  constructor(x, y) {
    this.reset(x, y);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.baseSpeed = 5;
    this.speed = this.baseSpeed;
    this.maxSpeed = 8;
    this.speedIncrement = 0.1;
    
    // Ensure initial direction is not too vertical
    const angle = (Math.random() * 0.5 + 0.25) * Math.PI;
    this.dx = Math.cos(angle) * this.speed * (Math.random() < 0.5 ? 1 : -1);
    this.dy = Math.sin(angle) * this.speed * (Math.random() < 0.5 ? 1 : -1);
  }

  update(deltaTime) {
    const delta = Math.min(deltaTime / 16, 2);
    this.x += this.dx * delta;
    this.y += this.dy * delta;
  }

  reverseX() {
    this.dx = -this.dx;
  }

  reverseY() {
    this.dy = -this.dy;
  }

  increaseSpeed() {
    if (this.speed < this.maxSpeed) {
      this.speed += this.speedIncrement;
      const angle = Math.atan2(this.dy, this.dx);
      this.dx = Math.cos(angle) * this.speed;
      this.dy = Math.sin(angle) * this.speed;
    }
  }

  checkPaddleCollision(paddle) {
    if (this.dx > 0 && paddle.side === 'left') return false;
    if (this.dx < 0 && paddle.side === 'right') return false;

    const paddleLeft = paddle.x - paddle.width / 2;
    const paddleRight = paddle.x + paddle.width / 2;
    const paddleTop = paddle.y;
    const paddleBottom = paddle.y + paddle.height;
    
    const testX = Math.max(paddleLeft, Math.min(this.x, paddleRight));
    const testY = Math.max(paddleTop, Math.min(this.y, paddleBottom));
    
    const distX = this.x - testX;
    const distY = this.y - testY;
    
    return (distX * distX + distY * distY) <= (this.size * this.size);
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}