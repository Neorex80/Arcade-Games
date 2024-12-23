export class ScoreEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.scale = 1;
    this.lifetime = 1000; // milliseconds
    this.created = Date.now();
  }

  update() {
    const age = Date.now() - this.created;
    const progress = age / this.lifetime;
    this.opacity = 1 - progress;
    this.scale = 1 + progress;
    this.y -= 1;
    return progress < 1;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#fff';
    ctx.font = `${24 * this.scale}px Arial`;
    ctx.fillText('+1', this.x, this.y);
    ctx.restore();
  }
}