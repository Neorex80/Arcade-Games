export class ScorePanel {
  constructor() {
    this.woodPattern = this.createWoodPattern();
  }

  createWoodPattern() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;

    // Create wood grain effect
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 100, 100);

    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(139, 69, 19, ${0.1 + Math.random() * 0.2})`;
      ctx.lineWidth = 10;
      ctx.moveTo(0, i * 10);
      ctx.bezierCurveTo(
        25, i * 10 + Math.random() * 10,
        75, i * 10 + Math.random() * 10,
        100, i * 10
      );
      ctx.stroke();
    }

    const pattern = ctx.createPattern(canvas, 'repeat');
    return pattern;
  }

  draw(ctx, score, highScore) {
    // Draw wooden panel background
    ctx.save();
    ctx.fillStyle = this.woodPattern;
    ctx.strokeStyle = '#4a2505';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 200, 80, 10);
    ctx.fill();
    ctx.stroke();

    // Draw scores with shadow
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 25, 45);
    ctx.fillText(`Best: ${highScore}`, 25, 75);
    ctx.restore();
  }
}