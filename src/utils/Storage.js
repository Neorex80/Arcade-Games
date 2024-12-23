export class Storage {
  static getHighScore() {
    return parseInt(localStorage.getItem('flappyHighScore') || '0');
  }

  static setHighScore(score) {
    localStorage.setItem('flappyHighScore', score.toString());
  }

  static updateHighScore(currentScore) {
    const highScore = this.getHighScore();
    if (currentScore > highScore) {
      this.setHighScore(currentScore);
      return true;
    }
    return false;
  }
}