export class AlienGrid {
  constructor(canvas) {
    this.canvas = canvas;
    this.projectiles = [];
    this.reset(1);
  }

  reset(level) {
    // Start with fewer rows and columns
    this.rows = Math.min(2 + Math.floor((level - 1) / 2), 5);
    this.cols = Math.min(6 + Math.floor((level - 1) / 2), 10);
    this.aliens = [];
    this.direction = 1;
    this.dropDistance = 20;
    
    // Gradually increase difficulty
    this.baseSpeed = 0.5 + (level * 0.1); // Slower initial speed
    this.speed = this.baseSpeed;
    this.shootInterval = Math.max(2000 - (level * 100), 500); // Less frequent shooting
    this.lastShot = Date.now();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.aliens.push({
          x: col * 50 + 50,
          y: row * 50 + 50,
          width: 40,
          height: 40,
          alive: true,
          type: Math.min(Math.floor(row / 2), 2)
        });
      }
    }
  }

  update(deltaTime) {
    const delta = deltaTime / 16;
    let shouldDrop = false;
    
    // Move aliens
    const moveAmount = this.speed * this.direction * delta;
    let reachedEdge = false;

    this.aliens.forEach(alien => {
      if (!alien.alive) return;
      alien.x += moveAmount;
      
      if (this.direction > 0 && alien.x + alien.width > this.canvas.width - 20) {
        reachedEdge = true;
      } else if (this.direction < 0 && alien.x < 20) {
        reachedEdge = true;
      }
    });

    if (reachedEdge) {
      this.direction *= -1;
      shouldDrop = true;
    }

    if (shouldDrop) {
      this.aliens.forEach(alien => {
        if (alien.alive) {
          alien.y += this.dropDistance;
        }
      });
    }

    // Update projectiles
    this.projectiles.forEach(p => p.y += 5);
    this.projectiles = this.projectiles.filter(p => p.y < this.canvas.height);

    // Random shooting
    if (Date.now() - this.lastShot > this.shootInterval) {
      const shootingAliens = this.aliens.filter(a => a.alive);
      if (shootingAliens.length > 0) {
        const shooter = shootingAliens[Math.floor(Math.random() * shootingAliens.length)];
        this.projectiles.push({
          x: shooter.x + shooter.width / 2,
          y: shooter.y + shooter.height,
          width: 3,
          height: 10
        });
        this.lastShot = Date.now();
      }
    }
  }

  draw(ctx) {
    // Draw aliens
    this.aliens.forEach(alien => {
      if (!alien.alive) return;
      
      ctx.fillStyle = ['#e74c3c', '#e67e22', '#f1c40f'][alien.type];
      ctx.beginPath();
      ctx.roundRect(
        alien.x - alien.width / 2,
        alien.y - alien.height / 2,
        alien.width,
        alien.height,
        5
      );
      ctx.fill();
    });

    // Draw projectiles
    ctx.fillStyle = '#ff0000';
    this.projectiles.forEach(p => {
      ctx.fillRect(p.x - p.width / 2, p.y, p.width, p.height);
    });
  }

  checkCollision(projectile) {
    for (let alien of this.aliens) {
      if (!alien.alive) continue;
      
      if (projectile.x > alien.x - alien.width / 2 &&
          projectile.x < alien.x + alien.width / 2 &&
          projectile.y > alien.y - alien.height / 2 &&
          projectile.y < alien.y + alien.height / 2) {
        alien.alive = false;
        return true;
      }
    }
    return false;
  }

  isEmpty() {
    return !this.aliens.some(alien => alien.alive);
  }

  hasReachedBottom() {
    return this.aliens.some(alien => 
      alien.alive && alien.y + alien.height / 2 > this.canvas.height - 100
    );
  }
}