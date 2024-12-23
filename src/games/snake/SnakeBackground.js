export class SnakeBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.grassPattern = this.createGrassPattern();
  }

  createGrassPattern() {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    patternCanvas.width = 20;
    patternCanvas.height = 20;

    // Base color
    patternCtx.fillStyle = '#2d5a27';
    patternCtx.fillRect(0, 0, 20, 20);

    // Grass details
    patternCtx.strokeStyle = '#1e401a';
    patternCtx.lineWidth = 1;
    
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 20;
      const y = Math.random() * 20;
      patternCtx.beginPath();
      patternCtx.moveTo(x, y);
      patternCtx.lineTo(x + 3, y - 5);
      patternCtx.stroke();
    }

    return this.ctx.createPattern(patternCanvas, 'repeat');
  }

  draw() {
    // Draw grass background
    this.ctx.fillStyle = this.grassPattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Add ambient lighting
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 1.5
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}