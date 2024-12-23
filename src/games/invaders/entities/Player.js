export class Player {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = 40;
    this.height = 30;
    this.reset();
    this.projectiles = [];
    this.projectileSpeed = 8;
    this.speed = 5;
    this.shootCooldown = 250; // ms
    this.lastShot = 0;
  }

  reset() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 50;
    this.projectiles = [];
  }

  moveLeft() {
    this.x = Math.max(this.width / 2, this.x - this.speed);
  }

  moveRight() {
    this.x = Math.min(this.canvas.width - this.width / 2, this.x + this.speed);
  }

  setPosition(x) {
    this.x = Math.max(this.width / 2, Math.min(this.canvas.width - this.width / 2, x));
  }

  shoot() {
    const now = Date.now();
    if (now - this.lastShot > this.shootCooldown) {
      this.projectiles.push({
        x: this.x,
        y: this.y - this.height / 2,
        width: 3,
        height: 15
      });
      this.lastShot = now;
    }
  }

  update(deltaTime) {
    this.projectiles = this.projectiles.filter(p => p.y > 0);
    this.projectiles.forEach(p => p.y -= this.projectileSpeed);
  }

  checkCollision(projectile) {
    return projectile.x > this.x - this.width / 2 &&
           projectile.x < this.x + this.width / 2 &&
           projectile.y > this.y - this.height / 2 &&
           projectile.y < this.y + this.height / 2;
  }

  drawShip(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Ship body
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#81C784';
    ctx.beginPath();
    ctx.arc(0, 0, this.width / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  draw(ctx) {
    // Draw projectiles
    ctx.fillStyle = '#fff';
    this.projectiles.forEach(p => {
      ctx.fillRect(p.x - p.width / 2, p.y, p.width, p.height);
    });

    // Draw ship
    this.drawShip(ctx, this.x, this.y);
  }
}