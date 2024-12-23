export class TouchHandler {
  constructor(element) {
    this.element = element;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.onTouchMove = null;
    this.onTap = null;
    this.tapThreshold = 200; // ms
    this.moveThreshold = 10; // pixels

    element.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.touchStartTime = Date.now();
    });

    element.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.onTouchMove) {
        const touch = e.touches[0];
        const rect = element.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        
        // Only trigger move if exceeded threshold
        if (Math.abs(touch.clientX - this.touchStartX) > this.moveThreshold) {
          this.onTouchMove(x);
        }
      }
    });

    element.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - this.touchStartTime;
      
      // Detect tap
      if (touchDuration < this.tapThreshold && this.onTap) {
        this.onTap();
      }
    });
  }
}