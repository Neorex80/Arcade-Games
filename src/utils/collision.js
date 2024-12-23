export function checkCollision(bird, pipe) {
  const birdRight = bird.x + bird.size;
  const birdLeft = bird.x;
  const pipeRight = pipe.x + pipe.width;
  const birdTop = bird.y;
  const birdBottom = bird.y + bird.size;

  if (birdRight > pipe.x && birdLeft < pipeRight) {
    if (birdTop < pipe.height || birdBottom > pipe.height + pipe.gap) {
      return true;
    }
  }
  return false;
}