export class Background {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = this.createStars();
    this.nebulas = this.createNebulas();
    this.scanlines = true;
  }

  createStars() {
    return Array(200).fill().map(() => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 2 + 1,
      twinkleSpeed: Math.random() * 0.1 + 0.05,
      twinklePhase: Math.random() * Math.PI * 2
    }));
  }

  createNebulas() {
    return Array(3).fill().map(() => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 200 + 100,
      color: [
        '#ff006660',
        '#00ff8860',
        '#0066ff60'
      ][Math.floor(Math.random() * 3)],
      drift: {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2
      }
    }));
  }

  update(deltaTime) {
    // Update stars twinkle
    this.stars.forEach(star => {
      star.twinklePhase += star.twinkleSpeed * deltaTime;
    });

    // Update nebula positions
    this.nebulas.forEach(nebula => {
      nebula.x += nebula.drift.x;
      nebula.y += nebula.drift.y;

      // Wrap around screen
      if (nebula.x < -nebula.size) nebula.x = this.canvas.width + nebula.size;
      if (nebula.x > this.canvas.width + nebula.size) nebula.x = -nebula.size;
      if (nebula.y < -nebula.size) nebula.y = this.canvas.height + nebula.size;
      if (nebula.y > this.canvas.height + nebula.size) nebula.y = -nebula.size;
    });
  }

  draw(ctx) {
    // Create space gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.5, '#000022');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw nebulas
    this.nebulas.forEach(nebula => {
      const gradient = ctx.createRadialGradient(
        nebula.x, nebula.y, 0,
        nebula.x, nebula.y, nebula.size
      );
      gradient.addColorStop(0, nebula.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });

    // Draw stars with twinkle effect
    this.stars.forEach(star => {
      const brightness = (Math.sin(star.twinklePhase) + 1) / 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + brightness * 0.5})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * brightness, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add scanlines effect
    if (this.scanlines) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < this.canvas.height; i += 4) {
        ctx.fillRect(0, i, this.canvas.width, 2);
      }
    }

    // Add vignette effect
    const vignette = ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 1.5
    );
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}