import { GameCard } from '../components/GameCard.js';
import { games } from '../config/games.js';
import { SocialLinks } from '../ui/SocialLinks.js';
import { AboutSection } from '../components/AboutSection.js';

export function HomePage() {
  const container = document.createElement('div');
  container.className = 'home-container';

  // Header Section
  const header = document.createElement('div');
  header.className = 'home-header';

  const title = document.createElement('h1');
  title.className = 'game-title';
  title.textContent = 'Retro Arcade';

  const subtitle = document.createElement('p');
  subtitle.className = 'home-subtitle';
  subtitle.textContent = 'Classic games reimagined for the modern web';

  header.appendChild(title);
  header.appendChild(subtitle);

  // Games Grid
  const gamesSection = document.createElement('section');
  gamesSection.className = 'games-section';
  
  const gamesTitle = document.createElement('h2');
  gamesTitle.className = 'section-title';
  gamesTitle.textContent = 'Games';
  
  const grid = document.createElement('div');
  grid.className = 'game-grid';

  games.forEach((game, index) => {
    const card = GameCard(game);
    card.style.setProperty('--i', index); // For staggered animation
    grid.appendChild(card);
  });

  gamesSection.appendChild(gamesTitle);
  gamesSection.appendChild(grid);

  // Social Links with updated URLs
  const socialLinks = new SocialLinks({
    github: 'https://github.com/Neorex80',
    linkedin: 'https://www.linkedin.com/in/devrex/',
    email: 'mailto:contact@example.com'
  });

  // About Section
  const about = new AboutSection();

  // Assemble page
  container.appendChild(header);
  container.appendChild(socialLinks.render());
  container.appendChild(gamesSection);
  container.appendChild(about.render());

  return container;
}