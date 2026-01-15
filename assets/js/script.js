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
  const projectCards = Array.from(document.querySelectorAll('.card.project'));
  projectCards.forEach((card) => {
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
})();
