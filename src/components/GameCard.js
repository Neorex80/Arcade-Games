export function GameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  let animationFrame;
  const animate = (timestamp) => {
    // Clear canvas with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render game preview
    game.preview.render(ctx, canvas.width, canvas.height, timestamp);
    
    animationFrame = requestAnimationFrame(animate);
  };

  card.innerHTML = `
    <div class="game-card-inner">
      <h2>${game.title}</h2>
      <p>${game.description}</p>
    </div>
  `;

  card.insertBefore(canvas, card.firstChild);

  card.addEventListener('mouseenter', () => {
    animate(performance.now());
  });

  card.addEventListener('mouseleave', () => {
    cancelAnimationFrame(animationFrame);
    // Render one last frame to keep static preview
    game.preview.render(ctx, canvas.width, canvas.height, 0);
  });

  card.addEventListener('click', () => {
    window.location.href = game.path;
  });

  // Initial render
  game.preview.render(ctx, canvas.width, canvas.height, 0);

  return card;
}