export class GameSocialLinks {
  constructor() {
    this.links = [
      { icon: '🏠', url: '/games', text: 'Home' },
      { icon: '👨‍💻', url: 'https://github.com/yourusername', text: 'GitHub' },
      { icon: '💼', url: 'https://linkedin.com/in/yourusername', text: 'LinkedIn' }
    ];
    this.buttonWidth = 50;
    this.buttonHeight = 50;
    this.padding = 10;
    this.hovered = -1;
  }

  isInside(x, y) {
    const startX = 800 - (this.links.length * (this.buttonWidth + this.padding));
    
    for (let i = 0; i < this.links.length; i++) {
      const buttonX = startX + (i * (this.buttonWidth + this.padding));
      if (x >= buttonX && x <= buttonX + this.buttonWidth &&
          y >= 10 && y <= 10 + this.buttonHeight) {
        return i;
      }
    }
    return -1;
  }

  draw(ctx) {
    const startX = ctx.canvas.width - (this.links.length * (this.buttonWidth + this.padding));

    this.links.forEach((link, i) => {
      const x = startX + (i * (this.buttonWidth + this.padding));
      const isHovered = this.hovered === i;

      // Draw button background
      ctx.save();
      ctx.fillStyle = isHovered ? '#4CAF50' : '#2ecc71';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, 10, this.buttonWidth, this.buttonHeight, 10);
      ctx.fill();
      ctx.stroke();

      // Draw icon
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(link.icon, x + this.buttonWidth / 2, 35);
      ctx.restore();
    });
  }

  handleClick(index) {
    if (index >= 0 && index < this.links.length) {
      const link = this.links[index];
      if (link.url === '/games') {
        window.location.href = '/games';
      } else {
        window.open(link.url, '_blank');
      }
    }
  }
}