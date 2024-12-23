export class ComputerPlayer {
  constructor(difficulty = 0.7) {
    this.difficulty = difficulty;
    this.reactionDelay = 100 + (1 - difficulty) * 200;
    this.lastUpdate = 0;
    this.targetY = 0;
    this.errorMargin = (1 - difficulty) * 50;
  }

  calculateMove(paddle, ball, canvasHeight) {
    const now = Date.now();
    
    // Only update target if ball is moving towards AI
    if (ball.dx > 0 && now - this.lastUpdate > this.reactionDelay) {
      // Predict ball position
      const timeToIntercept = (paddle.x - ball.x) / ball.dx;
      let predictedY = ball.y + (ball.dy * timeToIntercept);
      
      // Keep prediction in bounds
      predictedY = Math.max(0, Math.min(predictedY, canvasHeight));
      
      // Add controlled randomness
      const error = (Math.random() * 2 - 1) * this.errorMargin;
      this.targetY = predictedY + error;
      this.lastUpdate = now;
    }

    const paddleCenter = paddle.y + paddle.height / 2;
    const distance = this.targetY - paddleCenter;
    
    // Add deadzone to prevent jitter
    if (Math.abs(distance) < 10) return 0;
    return Math.sign(distance);
  }
}