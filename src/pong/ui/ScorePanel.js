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

    return ctx.createPattern(canvas, 'repeat');
  }

  draw(ctx, playerScore, computerScore) {
    ctx.save();
    
    // Draw wooden score panels
    ctx.fillStyle = this.woodPattern;
    ctx.strokeStyle = '#4a2505';
    ctx.lineWidth = 4;

    // Player score panel
    ctx.beginPath();
    ctx.roundRect(ctx.canvas.width/4 - 50, 20, 100, 80, 10);
    ctx.fill();
    ctx.stroke();

    // Computer score panel
    ctx.beginPath();
    ctx.roundRect(3 * ctx.canvas.width/4 - 50, 20, 100, 80, 10);
    ctx.fill();
    ctx.stroke();

    // Draw scores with glow effect
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#4CAF50';
    ctx.shadowBlur = 10;
    ctx.font = '48px "Press Start 2P"';
    ctx.textAlign = 'center';
    
    ctx.fillText(playerScore.toString(), ctx.canvas.width/4, 80);
    ctx.fillText(computerScore.toString(), 3 * ctx.canvas.width/4, 80);
    
    ctx.restore();
  }
}