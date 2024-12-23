import { Cloud } from './Cloud.js';

export class Background {
  constructor(canvas) {
    this.canvas = canvas;
    this.clouds = Array.from({ length: 5 }, () => new Cloud(canvas));
    this.groundOffset = 0;
    this.groundSpeed = 2;
  }

  update(deltaTime) {
    this.clouds.forEach(cloud => cloud.update());
    this.groundOffset = (this.groundOffset - this.groundSpeed) % 20;
  }

  draw(ctx) {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Clouds
    this.clouds.forEach(cloud => cloud.draw(ctx));

    // Ground
    const groundHeight = 50;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, this.canvas.height - groundHeight, this.canvas.width, groundHeight);

    // Ground pattern
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    for (let x = this.groundOffset; x < this.canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, this.canvas.height - groundHeight);
      ctx.lineTo(x + 10, this.canvas.height - groundHeight + 10);
      ctx.stroke();
    }
  }
}