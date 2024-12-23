export class AboutSection {
  constructor() {
    this.technologies = [
      {
        category: 'Core Technologies',
        items: [
          { name: 'JavaScript', icon: '🟨' },
          { name: 'HTML5 Canvas', icon: '🎨' },
          { name: 'CSS3', icon: '🎯' }
        ]
      },
      {
        category: 'Development Tools',
        items: [
          { name: 'Vite', icon: '⚡' },
          { name: 'WebContainer', icon: '📦' }
        ]
      },
      {
        category: 'Game Features',
        items: [
          { name: 'Particle Systems', icon: '✨' },
          { name: 'Physics Engine', icon: '🎮' },
          { name: 'Collision Detection', icon: '💥' },
          { name: 'Touch Controls', icon: '👆' }
        ]
      }
    ];
  }

  render() {
    const section = document.createElement('section');
    section.className = 'about-section';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'About';

    const content = document.createElement('div');
    content.className = 'about-content';

    // Description
    const description = document.createElement('div');
    description.className = 'about-description';
    description.innerHTML = `
      <p>
        Welcome to our Retro Arcade collection! This project brings classic arcade games to life
        using modern web technologies. Each game has been carefully crafted with attention to
        detail, smooth animations, and responsive controls for both desktop and mobile devices.
      </p>
    `;

    // Technologies
    const techSection = document.createElement('div');
    techSection.className = 'technologies';

    this.technologies.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'tech-category';

      const categoryTitle = document.createElement('h3');
      categoryTitle.textContent = category.category;
      categoryDiv.appendChild(categoryTitle);

      const itemsGrid = document.createElement('div');
      itemsGrid.className = 'tech-items';

      category.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'tech-item';
        itemDiv.innerHTML = `
          <span class="tech-icon">${item.icon}</span>
          <span class="tech-name">${item.name}</span>
        `;
        itemsGrid.appendChild(itemDiv);
      });

      categoryDiv.appendChild(itemsGrid);
      techSection.appendChild(categoryDiv);
    });

    content.appendChild(description);
    content.appendChild(techSection);

    section.appendChild(title);
    section.appendChild(content);

    return section;
  }
}