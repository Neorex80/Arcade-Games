export class DifficultyManager {
  constructor(options = {}) {
    this.options = {
      baseSpeed: 1,
      speedIncrease: 0.1,
      maxSpeed: 2,
      startLevel: 1,
      ...options
    };
    
    this.reset();
  }

  reset() {
    this.level = this.options.startLevel;
    this.score = 0;
    this.speed = this.options.baseSpeed;
    this.difficulty = 0;
  }

  getCurrentSpeed() {
    return Math.min(
      this.options.baseSpeed + (this.level - 1) * this.options.speedIncrease,
      this.options.maxSpeed
    );
  }

  getSpawnRate() {
    return Math.max(1000 - (this.level - 1) * 50, 400);
  }

  getDensity() {
    return Math.min(0.5 + (this.level - 1) * 0.05, 0.9);
  }

  getHealth() {
    return Math.min(Math.ceil(this.level / 3), 3);
  }

  addScore(points) {
    this.score += points;
    this.difficulty = Math.floor(this.score / 1000);
    return this.score;
  }

  levelUp() {
    this.level++;
    this.speed = this.getCurrentSpeed();
    return this.level;
  }
}