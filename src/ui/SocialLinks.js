export class SocialLinks {
  constructor(links = {}) {
    this.links = [
      {
        icon: '👨‍💻',
        url: links.github || 'https://github.com',
        label: 'GitHub'
      },
      {
        icon: '💼',
        url: links.linkedin || 'https://linkedin.com',
        label: 'LinkedIn'
      },
      {
        icon: '📧',
        url: links.email || 'mailto:contact@example.com',
        label: 'Email'
      }
    ];
  }

  render() {
    const container = document.createElement('div');
    container.className = 'social-links';
    
    this.links.forEach(link => {
      const button = document.createElement('a');
      button.href = link.url;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.className = 'social-button';
      button.innerHTML = `
        <span class="social-icon">${link.icon}</span>
        <span class="social-label">${link.label}</span>
      `;
      container.appendChild(button);
    });

    return container;
  }
}