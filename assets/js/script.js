(function () {
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const projectCards = Array.from(document.querySelectorAll('#projectGrid .project'));

  const setFilter = (category) => {
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.filter === category));

    projectCards.forEach((card) => {
      const match = category === 'all' || card.dataset.category === category;
      card.hidden = !match;
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // License filters
  const licenseButtons = Array.from(document.querySelectorAll('[data-license-filter]'));
  const licenseCards = Array.from(document.querySelectorAll('[data-license-category]'));

  const setLicenseFilter = (category) => {
    licenseButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.licenseFilter === category));
    licenseCards.forEach((card) => {
      const match = category === 'all' || card.dataset.licenseCategory === category;
      card.hidden = !match;
    });
  };

  licenseButtons.forEach((btn) => {
    btn.addEventListener('click', () => setLicenseFilter(btn.dataset.licenseFilter));
  });

  // Project cards: default to a compact view with toggle
  const projectToggleCards = Array.from(document.querySelectorAll('.card.project'));
  projectToggleCards.forEach((card) => {
    card.classList.add('collapsed');
    const body = card.querySelector('.project-body');
    if (!body) return;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'toggle-details';
    toggle.textContent = 'More';

    toggle.addEventListener('click', () => {
      const expanded = card.classList.toggle('expanded');
      card.classList.toggle('collapsed', !expanded);
      toggle.textContent = expanded ? 'Less' : 'More';
    });

    body.appendChild(toggle);
  });

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const themeToggleLabel = document.querySelector('.theme-toggle-label');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    if (themeToggleLabel && themeToggle) {
      const isLight = theme === 'light';
      themeToggleLabel.textContent = isLight ? 'Light' : 'Dark';
      themeToggle.querySelector('i').className = isLight ? 'ri-sun-line' : 'ri-moon-line';
    }
  };

  applyTheme(initialTheme);

  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  const handleScroll = () => {
    if (!backToTop) return;
    backToTop.hidden = window.scrollY < 200;
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll);

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
