(function () {
  const availableLangs = ['en', 'zh', 'de'];
  const fallbackLang = 'en';
  const langStorageKey = 'site-lang';
  const i18nBasePath = './assets/i18n';
  const dataPaths = {
    experience: './assets/data/experience.json',
    projects: './assets/data/projects.json'
  };

  const translationsCache = {};
  const dataCache = {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
  const licenseButtons = Array.from(document.querySelectorAll('[data-license-filter]'));
  const licenseCards = Array.from(document.querySelectorAll('[data-license-category]'));
  const languageToggle = document.querySelector('.lang-toggle');
  const languageMenu = document.querySelector('.lang-menu');
  const languageOptions = Array.from(document.querySelectorAll('.lang-option'));
  const languageLabel = document.querySelector('.lang-label');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeToggleLabel = document.querySelector('.theme-toggle-label');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');
  const projectToggleButtons = [];

  let projectCards = [];
  let currentTheme = initialTheme;
  let currentLang = detectLanguage();
  let currentTranslate = () => '';
  let experienceData = [];
  let projectsData = [];
  let hasAnimatedOnce = false;

  function detectLanguage() {
    const stored = localStorage.getItem(langStorageKey);
    if (stored && availableLangs.includes(stored)) return stored;
    return fallbackLang;
  }

  const loadTranslations = async (lang) => {
    if (translationsCache[lang]) return translationsCache[lang];
    try {
      const response = await fetch(`${i18nBasePath}/${lang}.json`, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Failed to load ${lang}`);
      const data = await response.json();
      translationsCache[lang] = data;
      return data;
    } catch (error) {
      console.warn(`i18n: unable to load ${lang}`, error);
      return null;
    }
  };

  const loadData = async (key) => {
    const path = dataPaths[key];
    if (!path) return [];
    if (dataCache[path]) return dataCache[path];
    try {
      const response = await fetch(path, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      const data = await response.json();
      dataCache[path] = data;
      return data;
    } catch (error) {
      console.warn('data: unable to load', path, error);
      return [];
    }
  };

  const setThemeLabel = (theme, translateFn = currentTranslate) => {
    if (!themeToggleLabel) return;
    const key = theme === 'light' ? 'theme.light' : 'theme.dark';
    const label = translateFn(key) || (theme === 'light' ? 'Light' : 'Dark');
    themeToggleLabel.textContent = label;
  };

  const setProjectToggleLabel = (button, expanded, translateFn = currentTranslate) => {
    const key = expanded ? 'projects.toggle.less' : 'projects.toggle.more';
    const label = translateFn(key) || (expanded ? 'Less' : 'More');
    button.textContent = label;
  };

  const refreshProjectToggleLabels = (translateFn = currentTranslate) => {
    projectToggleButtons.forEach((btn) => {
      const card = btn.closest('.card.project');
      const expanded = card?.classList.contains('expanded');
      setProjectToggleLabel(btn, Boolean(expanded), translateFn);
    });
  };

  const setLanguageLabel = (lang = currentLang, translateFn = currentTranslate) => {
    if (!languageLabel) return;
    const key = `language.name.${lang}`;
    const fallback = lang === 'zh' ? '中文' : lang.toUpperCase();
    languageLabel.textContent = translateFn(key) || fallback;
  };

  const updateLanguageOptions = (lang = currentLang, translateFn = currentTranslate) => {
    languageOptions.forEach((opt) => {
      const isActive = opt.dataset.lang === lang;
      opt.classList.toggle('active', isActive);
      opt.setAttribute('aria-selected', String(isActive));
      const key = `language.name.${opt.dataset.lang}`;
      const fallback = opt.dataset.lang === 'zh' ? '中文' : opt.dataset.lang.toUpperCase();
      opt.textContent = translateFn(key) || fallback;
    });
    setLanguageLabel(lang, translateFn);
  };

  const closeLanguageMenu = () => {
    if (!languageMenu || !languageToggle) return;
    languageMenu.classList.remove('is-open');
    languageMenu.hidden = true;
    languageToggle.setAttribute('aria-expanded', 'false');
  };

  const openLanguageMenu = () => {
    if (!languageMenu || !languageToggle) return;
    languageMenu.hidden = false;
    requestAnimationFrame(() => languageMenu.classList.add('is-open'));
    languageToggle.setAttribute('aria-expanded', 'true');
  };

  const ensureData = async () => {
    if (!experienceData.length) {
      experienceData = await loadData('experience');
    }
    if (!projectsData.length) {
      projectsData = await loadData('projects');
    }
  };

  const renderExperience = async (translateFn = currentTranslate) => {
    await ensureData();
    const container = document.getElementById('experienceList');
    if (!container) return;
    container.innerHTML = '';
    experienceData.forEach((item) => {
      const details = document.createElement('details');
      details.className = 'timeline-card';
      if (item.open) details.setAttribute('open', '');

      const summary = document.createElement('summary');
      const summaryText = document.createElement('div');
      summaryText.className = 'summary-text';
      const dateEl = document.createElement('p');
      dateEl.className = 'label';
      dateEl.textContent = translateFn(item.datesKey) || '';
      const titleEl = document.createElement('h3');
      titleEl.textContent = translateFn(item.titleKey) || '';
      summaryText.append(dateEl, titleEl);

      const summaryIcons = document.createElement('div');
      summaryIcons.className = 'summary-icons';
      if (item.pillIcon) {
        const icon = document.createElement('i');
        icon.className = `${item.pillIcon} icon-badge small`;
        icon.setAttribute('aria-hidden', 'true');
        summaryIcons.appendChild(icon);
      }
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = translateFn(item.pillKey) || '';
      summaryIcons.appendChild(pill);

      summary.append(summaryText, summaryIcons);

      const desc = document.createElement('p');
      desc.className = 'muted';
      desc.textContent = translateFn(item.descKey) || '';

      const inline = document.createElement('details');
      inline.className = 'inline-details';
      if (item.inlineOpen) inline.setAttribute('open', '');
      const inlineSummary = document.createElement('summary');
      inlineSummary.textContent = translateFn('common.keyWork') || 'Key work';
      const list = document.createElement('ul');
      list.className = 'mini-list';
      const listHtml = translateFn(item.listKey);
      if (listHtml) list.innerHTML = listHtml;
      inline.append(inlineSummary, list);

      details.append(summary, desc, inline);
      container.appendChild(details);
    });
  };

  const renderProjects = async (translateFn = currentTranslate) => {
    await ensureData();
    const container = document.getElementById('projectGrid');
    if (!container) return;
    container.innerHTML = '';
    projectCards = [];
    projectToggleButtons.length = 0;

    projectsData.forEach((project) => {
      const card = document.createElement('article');
      card.className = 'card project collapsed';
      card.dataset.category = project.category;

      const img = document.createElement('div');
      img.className = 'project-img';
      img.style.backgroundImage = `url('${project.image}')`;

      const body = document.createElement('div');
      body.className = 'project-body';

      const top = document.createElement('div');
      top.className = 'project-top';
      const icon = document.createElement('i');
      icon.className = `${project.icon || 'ri-robot-2-line'} project-icon`;
      icon.setAttribute('aria-hidden', 'true');
      const pill = document.createElement('div');
      pill.className = 'pill';
      pill.textContent = translateFn(project.pillKey) || '';
      top.append(icon, pill);

      const title = document.createElement('h3');
      title.textContent = translateFn(project.titleKey) || '';
      const desc = document.createElement('p');
      desc.className = 'project-desc';
      desc.textContent = translateFn(project.descKey) || '';
      const label = document.createElement('p');
      label.className = 'label';
      label.textContent = translateFn(project.datesKey) || '';

      const chipsWrap = document.createElement('div');
      chipsWrap.className = 'chips';
      (project.chips || []).forEach((chip) => {
        const chipEl = document.createElement('span');
        chipEl.className = 'chip';
        chipEl.textContent = chip;
        chipsWrap.appendChild(chipEl);
      });

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'toggle-details';
      projectToggleButtons.push(toggle);
      setProjectToggleLabel(toggle, false, translateFn);
      toggle.addEventListener('click', () => {
        const expanded = card.classList.toggle('expanded');
        card.classList.toggle('collapsed', !expanded);
        setProjectToggleLabel(toggle, expanded, translateFn);
      });

      body.append(top, title, desc, label, chipsWrap, toggle);
      card.append(img, body);
      container.appendChild(card);
      projectCards.push(card);
    });
  };

  const applyTranslations = async (lang = currentLang) => {
    const resolvedLang = availableLangs.includes(lang) ? lang : fallbackLang;
    const primary = (await loadTranslations(resolvedLang)) || {};
    const fallbackDict = resolvedLang === fallbackLang ? primary : (await loadTranslations(fallbackLang)) || {};
    currentLang = resolvedLang;
    localStorage.setItem(langStorageKey, currentLang);
    document.documentElement.lang = currentLang === 'zh' ? 'zh-Hant' : currentLang;

    const translateFn = (key) => primary[key] ?? fallbackDict[key] ?? '';
    currentTranslate = translateFn;

    const pageTitle = translateFn('page.title');
    if (pageTitle) document.title = pageTitle;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (!key) return;
      const value = translateFn(key);
      if (!value) return;
      if (el.dataset.i18nHtml === 'true') {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    await Promise.all([renderExperience(translateFn), renderProjects(translateFn)]);
    refreshProjectToggleLabels(translateFn);
    updateLanguageOptions(currentLang, translateFn);
    setThemeLabel(document.documentElement.dataset.theme || currentTheme, translateFn);
  };

  const pulseLanguageToggle = () => {
    if (!languageToggle) return;
    languageToggle.classList.add('lang-changed');
    window.setTimeout(() => languageToggle.classList.remove('lang-changed'), 450);
  };

  const setLanguage = async (lang, animate = true) => {
    await applyTranslations(lang);
    if (animate && hasAnimatedOnce) {
      pulseLanguageToggle();
    }
    hasAnimatedOnce = true;
  };

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

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const navSections = navLinks
    .map((link) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return null;
      return { link, target };
    })
    .filter(Boolean);

  const highlightSection = () => {
    if (!navSections.length) return;
    const scrollPos = window.scrollY + 140;
    let activeLink = null;

    navSections.forEach(({ link, target }) => {
      const top = target.offsetTop;
      const bottom = top + target.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        activeLink = link;
      }
    });

    navLinks.forEach((link) => link.classList.toggle('active', link === activeLink));
  };

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

  const applyTheme = (theme) => {
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    const isLight = theme === 'light';
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = isLight ? 'ri-sun-line' : 'ri-moon-line';
      }
    }
    setThemeLabel(theme);
  };

  applyTheme(initialTheme);

  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  const heroCard = document.querySelector('.hero-card');
  const heroGrid = document.querySelector('.hero-grid');
  const glowLayer = heroCard?.querySelector('.glow');

  if (heroCard && heroGrid && !prefersReducedMotion) {
    const resetTilt = () => {
      heroCard.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      if (glowLayer) {
        glowLayer.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    heroGrid.addEventListener('pointermove', (event) => {
      const rect = heroGrid.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateY = x * 12;
      const rotateX = -y * 10;
      heroCard.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
      if (glowLayer) {
        glowLayer.style.transform = `translate3d(${x * 16}px, ${y * 16}px, 0)`;
      }
    });

    heroGrid.addEventListener('pointerleave', resetTilt);
  }

  const siteHeader = document.querySelector('.site-header');
  const backToTop = document.getElementById('backToTop');
  const handleScroll = () => {
    siteHeader?.classList.toggle('scrolled', window.scrollY > 12);
    highlightSection();
    if (backToTop) {
      backToTop.hidden = window.scrollY < 200;
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const bookmarkToggle = document.querySelector('.bookmark-toggle');
  const bookmarkMenu = document.getElementById('bookmarkMenu');
  const bookmarkLinks = bookmarkMenu ? Array.from(bookmarkMenu.querySelectorAll('a')) : [];
  let bookmarkCloseTimer;

  const closeBookmarkMenu = () => {
    if (!bookmarkMenu || !bookmarkToggle) return;
    bookmarkMenu.classList.remove('is-visible');
    bookmarkToggle.setAttribute('aria-expanded', 'false');
    if (bookmarkCloseTimer) {
      clearTimeout(bookmarkCloseTimer);
    }
    bookmarkCloseTimer = window.setTimeout(() => {
      bookmarkMenu.hidden = true;
    }, 250);
  };

  const openBookmarkMenu = () => {
    if (!bookmarkMenu || !bookmarkToggle) return;
    if (bookmarkCloseTimer) {
      clearTimeout(bookmarkCloseTimer);
    }
    bookmarkMenu.hidden = false;
    requestAnimationFrame(() => {
      bookmarkMenu.classList.add('is-visible');
      bookmarkToggle.setAttribute('aria-expanded', 'true');
    });
  };

  bookmarkToggle?.addEventListener('click', () => {
    if (!bookmarkMenu) return;
    const isOpen = bookmarkToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeBookmarkMenu();
    } else {
      openBookmarkMenu();
    }
  });

  bookmarkLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeBookmarkMenu();
    });
  });

  document.addEventListener('click', (event) => {
    if (!bookmarkMenu || !bookmarkToggle) return;
    if (bookmarkMenu.hidden) return;
    const clickTarget = event.target;
    if (!bookmarkMenu.contains(clickTarget) && !bookmarkToggle.contains(clickTarget)) {
      closeBookmarkMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeBookmarkMenu();
    }
  });

  const adjustBookmarkPosition = () => {
    const toTop = document.getElementById('backToTop');
    if (!bookmarkMenu || !bookmarkToggle || !toTop) return;
    const toggleRect = bookmarkToggle.getBoundingClientRect();
    const toTopRect = toTop.getBoundingClientRect();
    const overlap = toggleRect.bottom > toTopRect.top - 8 && Math.abs(toggleRect.right - toTopRect.right) < 80;
    if (overlap) {
      bookmarkToggle.style.bottom = '84px';
      bookmarkMenu.style.bottom = '138px';
    }
  };

  adjustBookmarkPosition();
  window.addEventListener('resize', adjustBookmarkPosition);

  languageOptions.forEach((btn) => {
    btn.addEventListener('click', () => {
      languageOptions.forEach((opt) => opt.classList.remove('lang-anim'));
      btn.classList.add('lang-anim');
      window.setTimeout(() => btn.classList.remove('lang-anim'), 450);
      setLanguage(btn.dataset.lang, true);
      closeLanguageMenu();
      languageToggle?.focus({ preventScroll: true });
    });
  });

  languageToggle?.addEventListener('click', () => {
    const isOpen = languageMenu?.classList.contains('is-open');
    if (isOpen) {
      closeLanguageMenu();
    } else {
      openLanguageMenu();
      languageMenu?.querySelector('.lang-option')?.focus({ preventScroll: true });
    }
  });

  document.addEventListener('click', (event) => {
    if (!languageMenu || !languageToggle) return;
    if (languageMenu.hidden) return;
    const target = event.target;
    if (!languageMenu.contains(target) && !languageToggle.contains(target)) {
      closeLanguageMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLanguageMenu();
      languageToggle?.focus({ preventScroll: true });
    }
  });

  setLanguage(currentLang, false);
})();
