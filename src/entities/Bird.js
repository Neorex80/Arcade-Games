export class Bird {
  constructor(canvasHeight) {
    this.x = 50;
    this.y = canvasHeight / 2;
    this.velocity = 0;
    this.gravity = 0.4;
    this.jumpStrength = -7;
    this.size = 30;
    this.rotation = 0;
    this.targetRotation = 0;
    this.wingAngle = 0;
    this.wingSpeed = 0.15;
  }

  update(deltaTime) {
    const delta = deltaTime / 16;
    this.velocity += this.gravity * delta;
    this.y += this.velocity * delta;

    // Rotate bird based on velocity
    this.targetRotation = Math.min(Math.max(this.velocity * 0.1, -0.5), 0.5);
    this.rotation += (this.targetRotation - this.rotation) * 0.1;

    // Animate wings
    this.wingAngle = Math.sin(Date.now() * this.wingSpeed) * 0.3;
  }

  jump() {
    this.velocity = this.jumpStrength;
    this.rotation = -0.5;
  }

  reset(canvasHeight) {
    this.y = canvasHeight / 2;
    this.velocity = 0;
    this.rotation = 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
    ctx.rotate(this.rotation);

    // Body
    ctx.fillStyle = '#f4d03f';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size / 1.5, this.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = '#e67e22';
    ctx.save();
    ctx.rotate(this.wingAngle);
    ctx.beginPath();
    ctx.ellipse(-5, -this.size / 4, this.size / 3, this.size / 4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.size / 4, -this.size / 6, this.size / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.size / 4, -this.size / 6, this.size / 12, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.moveTo(this.size / 2, 0);
    ctx.lineTo(this.size, -this.size / 8);
    ctx.lineTo(this.size, this.size / 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}