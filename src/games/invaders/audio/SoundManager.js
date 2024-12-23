export class SoundManager {
  constructor() {
    this.sounds = {
      shoot: new Audio('/sounds/shoot.wav'),
      explosion: new Audio('/sounds/explosion.wav'),
      playerHit: new Audio('/sounds/player-hit.wav'),
      levelUp: new Audio('/sounds/level-up.wav'),
      bgm: new Audio('/sounds/space-invaders-bgm.mp3')
    };

    // Set up background music
    this.sounds.bgm.loop = true;
    this.sounds.bgm.volume = 0.3;

    // Set up sound effects volume
    Object.values(this.sounds).forEach(sound => {
      if (sound !== this.sounds.bgm) {
        sound.volume = 0.5;
      }
    });
  }

  playShoot() {
    this._playSound('shoot');
  }

  playExplosion() {
    this._playSound('explosion');
  }

  playPlayerHit() {
    this._playSound('playerHit');
  }

  playLevelUp() {
    this._playSound('levelUp');
  }

  playBackgroundMusic() {
    this.sounds.bgm.play().catch(() => {
      // Autoplay was prevented
      console.log('Background music autoplay prevented');
    });
  }

  // Changed from 'private playSound' to '_playSound'
  _playSound(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Sound play was prevented
        console.log(`${name} sound play prevented`);
      });
    }
  }
}