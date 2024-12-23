export class GameControls {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      touchDeadzone: 10,
      touchSensitivity: 1.5,
      ...options
    };
    
    this.touches = new Set();
    this.lastX = 0;
    this.movement = 0;
    this.isPressed = false;
    
    this.onMove = null;
    this.onTap = null;
    this.onHold = null;
    
    this.setupControls();
  }

  setupControls() {
    // Mouse controls
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (this.onMove) this.onMove(x);
    });

    this.canvas.addEventListener('mousedown', () => {
      this.isPressed = true;
      if (this.onHold) this.onHold(true);
    });

    this.canvas.addEventListener('mouseup', () => {
      if (this.isPressed && this.onTap) this.onTap();
      this.isPressed = false;
      if (this.onHold) this.onHold(false);
    });

    // Touch controls
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.lastX = touch.clientX;
      this.isPressed = true;
      if (this.onHold) this.onHold(true);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.lastX;
      
      if (Math.abs(deltaX) > this.options.touchDeadzone) {
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        if (this.onMove) {
          this.onMove(x);
        }
      }
      this.lastX = touch.clientX;
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (this.isPressed && this.onTap) this.onTap();
      this.isPressed = false;
      if (this.onHold) this.onHold(false);
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Space':
          if (!this.isPressed) {
            this.isPressed = true;
            if (this.onHold) this.onHold(true);
          }
          break;
        case 'ArrowLeft':
          this.movement = -1;
          break;
        case 'ArrowRight':
          this.movement = 1;
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'Space':
          if (this.isPressed && this.onTap) this.onTap();
          this.isPressed = false;
          if (this.onHold) this.onHold(false);
          break;
        case 'ArrowLeft':
          if (this.movement < 0) this.movement = 0;
          break;
        case 'ArrowRight':
          if (this.movement > 0) this.movement = 0;
          break;
      }
    });
  }

  getMovement() {
    return this.movement;
  }

  isHolding() {
    return this.isPressed;
  }
}