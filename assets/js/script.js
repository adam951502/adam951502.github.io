(function () {
  const availableLangs = ["en", "zh"];
  const fallbackLang = "en";
  const langStorageKey = "site-lang";
  const themeStorageKey = "theme";
  const i18nBasePath = "./assets/i18n";
  const dataPaths = {
    experience: "./assets/data/experience.json",
    projects: "./assets/data/projects.bundle.json"
  };

  const translationsCache = {};
  const dataCache = {};
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const root = document.documentElement;
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const licenseButtons = Array.from(document.querySelectorAll("[data-license-filter]"));
  const licenseCards = Array.from(document.querySelectorAll("[data-license-category]"));
  const licenseCarousel = document.getElementById("licenseCarousel");
  const licenseGrid = document.getElementById("licenseGrid");
  const licenseViewport = document.querySelector(".license-viewport");
  const licensePrev = document.querySelector("[data-license-prev]");
  const licenseNext = document.querySelector("[data-license-next]");
  const licenseViewToggle = document.querySelector("[data-license-toggle]");
  const licenseViewToggleText = document.querySelector("[data-license-toggle-text]");
  const licenseDots = document.querySelector("[data-license-dots]");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
  const brandLink = document.querySelector(".brand");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const backToTop = document.getElementById("backToTop");
  const languageToggle = document.querySelector(".lang-toggle");
  const languageMenu = document.querySelector(".lang-menu");
  const languageOptions = Array.from(document.querySelectorAll(".lang-option"));
  const languageLabel = document.querySelector(".lang-label");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeToggleLabel = document.querySelector(".theme-toggle-label");
  const siteHeader = document.querySelector(".site-header");
  const siteFooter = document.querySelector(".footer");
  const mobileMenuQuery = window.matchMedia("(max-width: 1180px)");

  const savedTheme = localStorage.getItem(themeStorageKey);
  const initialTheme = savedTheme || "light";

  let currentLang = detectLanguage();
  let currentTheme = initialTheme;
  let currentTranslate = (key) => key;
  let currentProjectFilter = "all";
  let currentLicenseFilter = "all";
  let currentLicenseIndex = 0;
  let licenseExpanded = false;
  let licenseTouchStartX = null;
  let licenseResizeFrame = null;
  let licenseDragPointerId = null;
  let licenseDragStartX = 0;
  let licenseDragBaseOffset = 0;
  let licenseDragDeltaX = 0;
  let licenseDragging = false;
  let licenseSuppressClick = false;
  let licenseWheelAccumulator = 0;
  let licenseWheelGestureActive = false;
  let licenseWheelResetTimer = null;
  let licenseTrackSignature = "";
  let licenseTrackPrependCount = 0;
  let licenseLoopResetIndex = null;
  let licenseLoopResetTimer = null;
  let experienceData = [];
  let projectsData = [];
  let projectCards = [];
  let revealObserver = null;

  function detectLanguage() {
    const stored = localStorage.getItem(langStorageKey);
    return stored && availableLangs.includes(stored) ? stored : fallbackLang;
  }

  async function loadTranslations(lang) {
    if (translationsCache[lang]) return translationsCache[lang];
    try {
      const response = await fetch(`${i18nBasePath}/${lang}.json`, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Failed to load ${lang}`);
      const data = await response.json();
      translationsCache[lang] = data;
      return data;
    } catch (error) {
      console.warn(`i18n: unable to load ${lang}`, error);
      return null;
    }
  }

  async function loadJson(path) {
    if (Object.prototype.hasOwnProperty.call(dataCache, path)) return dataCache[path];
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      const data = await response.json();
      dataCache[path] = data;
      return data;
    } catch (error) {
      console.warn("data: unable to load", path, error);
      return null;
    }
  }

  async function loadData(key) {
    const path = dataPaths[key];
    if (!path) return [];
    return (await loadJson(path)) || [];
  }

  async function loadProjects() {
    const manifest = await loadData("projects");
    if (Array.isArray(manifest)) return manifest;

    const projectFiles = Array.isArray(manifest.projectFiles) ? manifest.projectFiles : [];
    const manifestUrl = new URL(dataPaths.projects, window.location.href);
    const projects = await Promise.all(
      projectFiles.map((projectFile) => loadJson(new URL(projectFile, manifestUrl).href))
    );
    return projects.filter(Boolean);
  }

  async function ensureData() {
    if (!experienceData.length) {
      experienceData = await loadData("experience");
    }
    if (!projectsData.length) {
      projectsData = [...(await loadProjects())].sort((left, right) => {
        const endDateOrder = String(right.sortEnd || "").localeCompare(String(left.sortEnd || ""));
        if (endDateOrder !== 0) return endDateOrder;
        const updatedDateOrder = String(right.sortUpdated || right.sortStart || "").localeCompare(
          String(left.sortUpdated || left.sortStart || "")
        );
        if (updatedDateOrder !== 0) return updatedDateOrder;
        return String(right.sortStart || "").localeCompare(String(left.sortStart || ""));
      });
    }
  }

  function setLanguageLabel(lang = currentLang, translateFn = currentTranslate) {
    if (!languageLabel) return;
    const key = `language.name.${lang}`;
    const fallback = lang === "zh" ? "繁中" : lang.toUpperCase();
    languageLabel.textContent = translateFn(key) || fallback;
  }

  function updateLanguageOptions(lang = currentLang, translateFn = currentTranslate) {
    languageOptions.forEach((option) => {
      const isActive = option.dataset.lang === lang;
      option.classList.toggle("active", isActive);
      option.setAttribute("aria-selected", String(isActive));
      const key = `language.name.${option.dataset.lang}`;
      const fallback = option.dataset.lang === "zh" ? "繁中" : option.dataset.lang.toUpperCase();
      option.textContent = translateFn(key) || fallback;
    });
    setLanguageLabel(lang, translateFn);
  }

  function setThemeLabel(theme = currentTheme, translateFn = currentTranslate) {
    if (!themeToggle || !themeToggleLabel) return;
    const key = theme === "light" ? "theme.light" : "theme.dark";
    const translatedLabel = translateFn(key);
    const label = translatedLabel && translatedLabel !== key
      ? translatedLabel
      : theme === "light" ? "Light" : "Dark";
    themeToggleLabel.textContent = label;

    const targetTheme = theme === "light" ? "dark" : "light";
    const targetKey = targetTheme === "light" ? "theme.light" : "theme.dark";
    const translatedTargetLabel = translateFn(targetKey);
    const targetLabel = translatedTargetLabel && translatedTargetLabel !== targetKey
      ? translatedTargetLabel
      : targetTheme === "light" ? "Light" : "Dark";
    const actionLabel = currentLang === "zh"
      ? "切換至" + targetLabel + "模式"
      : "Switch to " + targetLabel.toLowerCase() + " theme";
    themeToggle.setAttribute("aria-label", actionLabel);

    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className = theme === "light" ? "ri-sun-line" : "ri-moon-line";
    }
  }

  function applyTheme(theme) {
    currentTheme = theme;
    root.dataset.theme = theme;
    localStorage.setItem(themeStorageKey, theme);
    setThemeLabel(theme);
  }

  function closeLanguageMenu() {
    if (!languageMenu || !languageToggle) return;
    languageMenu.classList.remove("is-open");
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
  }

  function openLanguageMenu() {
    if (!languageMenu || !languageToggle) return;
    languageMenu.hidden = false;
    requestAnimationFrame(() => languageMenu.classList.add("is-open"));
    languageToggle.setAttribute("aria-expanded", "true");
  }

  function focusLanguageOption(index) {
    if (!languageOptions.length) return;
    const clampedIndex = Math.max(0, Math.min(index, languageOptions.length - 1));
    languageOptions[clampedIndex]?.focus();
  }

  function getCurrentLanguageOptionIndex() {
    const focusedIndex = languageOptions.indexOf(document.activeElement);
    if (focusedIndex >= 0) return focusedIndex;
    const selectedIndex = languageOptions.findIndex((option) => option.dataset.lang === currentLang);
    return selectedIndex >= 0 ? selectedIndex : 0;
  }

  function closeMobileMenu({ restoreFocus = false } = {}) {
    if (!mobileMenuToggle || !siteHeader) return;
    siteHeader.classList.remove("menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    const icon = mobileMenuToggle.querySelector("i");
    if (icon) icon.className = "ri-menu-3-line";
    if (restoreFocus) mobileMenuToggle.focus();
  }

  function openMobileMenu() {
    if (!mobileMenuToggle || !siteHeader) return;
    closeLanguageMenu();
    siteHeader.classList.add("menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    const icon = mobileMenuToggle.querySelector("i");
    if (icon) icon.className = "ri-close-line";
  }

  function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof textContent === "string") element.textContent = textContent;
    return element;
  }

  function setSafeTranslatedMarkup(element, markup) {
    const parsed = new DOMParser().parseFromString(String(markup || ""), "text/html");
    const allowedTags = new Set(["LI", "STRONG", "EM", "CODE", "BR"]);

    const cloneSafeNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.textContent || "");
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return null;

      const children = document.createDocumentFragment();
      node.childNodes.forEach((child) => {
        const safeChild = cloneSafeNode(child);
        if (safeChild) children.appendChild(safeChild);
      });

      if (!allowedTags.has(node.tagName)) return children;
      const clone = document.createElement(node.tagName.toLowerCase());
      clone.appendChild(children);
      return clone;
    };

    const fragment = document.createDocumentFragment();
    parsed.body.childNodes.forEach((node) => {
      const safeNode = cloneSafeNode(node);
      if (safeNode) fragment.appendChild(safeNode);
    });
    element.replaceChildren(fragment);
  }

  function formatIndex(index) {
    return String(index + 1).padStart(2, "0");
  }

  function getProjectContent(project, lang = currentLang) {
    const englishContent = project.content?.en || {};
    const localizedContent = project.content?.[lang] || {};
    return { ...englishContent, ...localizedContent };
  }

  function setProjectFilter(category) {
    currentProjectFilter = category;
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    projectCards.forEach((card) => {
      const match = category === "all" || card.dataset.category === category;
      card.hidden = !match;
    });
  }

  function getFilteredLicenseCards() {
    return licenseCards.filter((card) => !card.hidden);
  }

  function getLicenseItemsPerView() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  }

  function getLicenseText(key, fallback) {
    const value = currentTranslate(key);
    return value && value !== key ? value : fallback;
  }

  function normalizeLicenseIndex(index, total) {
    return total ? ((index % total) + total) % total : 0;
  }

  function getLicenseCarouselState() {
    const cards = getFilteredLicenseCards();
    const itemsPerView = Math.min(getLicenseItemsPerView(), Math.max(cards.length, 1));
    const canMove = !licenseExpanded && cards.length > itemsPerView;
    return { cards, itemsPerView, canMove };
  }

  function createLicenseClone(card) {
    const clone = card.cloneNode(true);
    clone.hidden = false;
    clone.dataset.licenseClone = "true";
    delete clone.dataset.licenseCategory;
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a, button").forEach((element) => element.setAttribute("tabindex", "-1"));
    return clone;
  }

  function rebuildLicenseTrack(cards, itemsPerView, canMove, forceRebuild = false) {
    const cardSignature = cards.map((card) => licenseCards.indexOf(card)).join("-");
    const nextSignature = `${licenseExpanded ? "expanded" : "carousel"}:${itemsPerView}:${cardSignature}`;
    if (!forceRebuild && nextSignature === licenseTrackSignature) return false;

    licenseGrid.querySelectorAll("[data-license-clone]").forEach((clone) => clone.remove());
    licenseTrackPrependCount = 0;

    if (canMove) {
      const prependFragment = document.createDocumentFragment();
      cards.slice(-itemsPerView).forEach((card) => prependFragment.appendChild(createLicenseClone(card)));
      licenseTrackPrependCount = itemsPerView;
      licenseGrid.insertBefore(prependFragment, licenseGrid.firstChild);
      cards.slice(0, itemsPerView).forEach((card) => licenseGrid.appendChild(createLicenseClone(card)));
    }

    licenseTrackSignature = nextSignature;
    return true;
  }

  function getVisibleLicenseTrackCards() {
    return Array.from(licenseGrid.querySelectorAll(".license:not([hidden])"));
  }

  function getLicenseTrackCard(logicalIndex) {
    return getVisibleLicenseTrackCards()[licenseTrackPrependCount + logicalIndex] || null;
  }

  function setLicenseTrackPosition(logicalIndex, animate = true) {
    const target = getLicenseTrackCard(logicalIndex);
    const offset = target ? target.offsetLeft : 0;
    const shouldAnimate = animate && !prefersReducedMotion;

    if (!shouldAnimate) {
      licenseViewport?.classList.add("is-resetting");
      licenseGrid.style.transform = `translate3d(-${offset}px, 0, 0)`;
      licenseGrid.getBoundingClientRect();
      licenseViewport?.classList.remove("is-resetting");
      return;
    }

    licenseGrid.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }

  function renderLicenseDots(positionCount, activeIndex) {
    if (!licenseDots) return;
    licenseDots.innerHTML = "";
    const dotLabel = getLicenseText("licenses.dotLabel", "Go to certification position");

    for (let index = 0; index < positionCount; index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "license-dot";
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-label", `${dotLabel} ${index + 1}`);
      if (index === activeIndex) dot.setAttribute("aria-current", "true");
      dot.addEventListener("click", () => {
        finishLicenseLoopReset();
        currentLicenseIndex = index;
        updateLicenseCarousel({ animate: true });
      });
      licenseDots.appendChild(dot);
    }
  }

  function finishLicenseLoopReset() {
    if (licenseLoopResetIndex === null) return;
    window.clearTimeout(licenseLoopResetTimer);
    currentLicenseIndex = licenseLoopResetIndex;
    licenseLoopResetIndex = null;
    updateLicenseCarousel({ animate: false });
  }

  function queueLicenseLoopReset() {
    window.clearTimeout(licenseLoopResetTimer);
    if (licenseLoopResetIndex === null) return;
    if (prefersReducedMotion) {
      requestAnimationFrame(finishLicenseLoopReset);
      return;
    }
    licenseLoopResetTimer = window.setTimeout(finishLicenseLoopReset, 480);
  }

  function updateLicenseCarousel({ animate = true, forceRebuild = false } = {}) {
    if (!licenseCarousel || !licenseGrid) return;

    const { cards, itemsPerView, canMove } = getLicenseCarouselState();
    const rebuilt = rebuildLicenseTrack(cards, itemsPerView, canMove, forceRebuild);
    if (!canMove) {
      currentLicenseIndex = 0;
      licenseLoopResetIndex = null;
    } else if (licenseLoopResetIndex === null) {
      currentLicenseIndex = normalizeLicenseIndex(currentLicenseIndex, cards.length);
    }
    const activeIndex = normalizeLicenseIndex(currentLicenseIndex, cards.length);

    licenseCarousel.classList.toggle("is-expanded", licenseExpanded);
    licenseCarousel.classList.toggle("is-single", cards.length === 1);
    licenseCarousel.classList.toggle("is-double", cards.length === 2);
    licenseCarousel.classList.toggle("is-static", !canMove);

    if (licenseExpanded) {
      licenseGrid.style.transform = "none";
    } else {
      setLicenseTrackPosition(currentLicenseIndex, animate && !rebuilt);
    }

    renderLicenseDots(canMove ? cards.length : 1, canMove ? activeIndex : 0);

    if (licensePrev) licensePrev.disabled = !canMove;
    if (licenseNext) licenseNext.disabled = !canMove;

    const trackCards = getVisibleLicenseTrackCards();
    const physicalStart = licenseTrackPrependCount + currentLicenseIndex;
    licenseGrid.querySelectorAll(".license").forEach((card) => {
      const physicalIndex = trackCards.indexOf(card);
      const isInCurrentView = physicalIndex >= physicalStart && physicalIndex < physicalStart + itemsPerView;
      const isAccessible = !card.hidden && (licenseExpanded ? !card.dataset.licenseClone : isInCurrentView);
      card.setAttribute("aria-hidden", String(!isAccessible));
      card.querySelectorAll("a, button").forEach((element) => {
        if (isAccessible) {
          element.removeAttribute("tabindex");
        } else {
          element.setAttribute("tabindex", "-1");
        }
      });
    });

    if (licenseViewport) licenseViewport.tabIndex = licenseExpanded ? -1 : 0;
    if (licenseViewToggle) licenseViewToggle.setAttribute("aria-expanded", String(licenseExpanded));
    if (licenseViewToggleText) {
      const key = licenseExpanded ? "licenses.collapseAll" : "licenses.expandAll";
      const fallback = licenseExpanded ? "Return to carousel" : "View all certifications";
      licenseViewToggleText.dataset.i18n = key;
      licenseViewToggleText.textContent = getLicenseText(key, fallback);
    }
    const toggleIcon = licenseViewToggle?.querySelector("i");
    if (toggleIcon) toggleIcon.className = licenseExpanded ? "ri-slideshow-3-line" : "ri-grid-line";
    queueLicenseLoopReset();
  }

  function getLicenseDragMetrics() {
    const { cards, itemsPerView, canMove } = getLicenseCarouselState();
    const minimumIndex = canMove ? -1 : 0;
    const maximumIndex = canMove ? cards.length : 0;
    return {
      cards,
      itemsPerView,
      canMove,
      minimumIndex,
      maximumIndex,
      currentOffset: getLicenseTrackCard(currentLicenseIndex)?.offsetLeft || 0,
      minOffset: getLicenseTrackCard(minimumIndex)?.offsetLeft || 0,
      maxOffset: getLicenseTrackCard(maximumIndex)?.offsetLeft || 0
    };
  }

  function getLicenseTrackTranslateX() {
    const transform = getComputedStyle(licenseGrid).transform;
    if (!transform || transform === "none") return 0;
    const values = transform
      .slice(transform.indexOf("(") + 1, transform.lastIndexOf(")"))
      .split(",")
      .map(Number);
    return transform.startsWith("matrix3d") ? values[12] || 0 : values[4] || 0;
  }

  function finishLicenseDrag(event, cancelled = false) {
    if (licenseDragPointerId === null || event.pointerId !== licenseDragPointerId) return;

    const pointerId = licenseDragPointerId;
    const wasDragging = licenseDragging;
    const draggedOffset = licenseDragBaseOffset - licenseDragDeltaX;

    licenseDragPointerId = null;
    licenseDragging = false;
    licenseViewport?.classList.remove("is-dragging");
    if (licenseViewport?.hasPointerCapture(pointerId)) {
      licenseViewport.releasePointerCapture(pointerId);
    }

    if (wasDragging && !cancelled) {
      const { cards, minimumIndex, maximumIndex } = getLicenseDragMetrics();
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (let index = minimumIndex; index <= maximumIndex; index += 1) {
        const target = getLicenseTrackCard(index);
        if (!target) continue;
        const distance = Math.abs(target.offsetLeft - draggedOffset);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      }
      currentLicenseIndex = nearestIndex;
      licenseLoopResetIndex = nearestIndex < 0
        ? cards.length - 1
        : nearestIndex >= cards.length
          ? 0
          : null;
      licenseSuppressClick = true;
      window.setTimeout(() => {
        licenseSuppressClick = false;
      }, 0);
    }

    licenseDragDeltaX = 0;
    updateLicenseCarousel({ animate: wasDragging });
  }

  function moveLicenseCarousel(direction) {
    if (licenseExpanded) return;
    finishLicenseLoopReset();
    const { cards, canMove } = getLicenseCarouselState();
    if (!canMove) return;
    const activeIndex = normalizeLicenseIndex(currentLicenseIndex, cards.length);

    if (direction > 0) {
      currentLicenseIndex = activeIndex + 1;
      licenseLoopResetIndex = currentLicenseIndex >= cards.length ? 0 : null;
    } else {
      currentLicenseIndex = activeIndex - 1;
      licenseLoopResetIndex = currentLicenseIndex < 0 ? cards.length - 1 : null;
    }
    updateLicenseCarousel({ animate: true });
  }

  function setLicenseFilter(category) {
    currentLicenseFilter = category;
    currentLicenseIndex = 0;
    licenseLoopResetIndex = null;
    licenseButtons.forEach((button) => {
      const isActive = button.dataset.licenseFilter === category;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    licenseCards.forEach((card) => {
      const match = category === "all" || card.dataset.licenseCategory === category;
      card.hidden = !match;
    });
    updateLicenseCarousel({ animate: false, forceRebuild: true });
  }

  function registerReveal(elements) {
    const revealTargets = elements
      ? Array.from(elements)
      : Array.from(document.querySelectorAll(".reveal, .reveal-target, .card, .timeline-card, .skill-card, .license"));

    if (prefersReducedMotion) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.02, rootMargin: "0px 0px -5% 0px" }
      );
    }

    revealTargets.forEach((element) => {
      if (element.dataset.revealBound === "true" || element.classList.contains("is-visible")) return;
      element.dataset.revealBound = "true";
      revealObserver.observe(element);
    });
  }

  async function renderExperience(translateFn = currentTranslate) {
    await ensureData();
    const container = document.getElementById("experienceList");
    if (!container) return;

    container.innerHTML = "";

    experienceData.forEach((item, index) => {
      const details = createElement("details", "timeline-card reveal-target");
      if (item.open) details.open = true;

      const summary = document.createElement("summary");

      const head = createElement("div", "timeline-head");
      const indexEl = createElement("span", "timeline-index", formatIndex(index));

      const summaryText = createElement("div", "summary-text");
      const dateEl = createElement("p", "label", translateFn(item.datesKey) || "");
      const titleEl = createElement("h3", "", translateFn(item.titleKey) || "");
      summaryText.append(dateEl, titleEl);
      head.append(indexEl, summaryText);

      const summaryIcons = createElement("div", "summary-icons");
      if (item.pillIcon) {
        const iconWrap = createElement("span", "icon-badge small");
        const icon = document.createElement("i");
        icon.className = item.pillIcon;
        icon.setAttribute("aria-hidden", "true");
        iconWrap.appendChild(icon);
        summaryIcons.appendChild(iconWrap);
      }
      const pill = createElement("span", "pill", translateFn(item.pillKey) || "");
      summaryIcons.appendChild(pill);

      summary.append(head, summaryIcons);

      const body = createElement("div", "disclosure-body");
      const desc = createElement("p", "muted", translateFn(item.descKey) || "");

      const inline = createElement("details", "inline-details");
      if (item.inlineOpen) inline.open = true;
      const inlineSummary = createElement("summary", "", translateFn("common.keyWork") || "Key work");
      const list = createElement("ul", "mini-list");
      const listHtml = translateFn(item.listKey);
      if (listHtml) setSafeTranslatedMarkup(list, listHtml);
      inline.append(inlineSummary, list);

      body.append(desc, inline);
      details.append(summary, body);
      container.appendChild(details);
    });

    registerReveal(container.querySelectorAll(".reveal-target"));
  }

  async function renderProjects(translateFn = currentTranslate) {
    await ensureData();
    const container = document.getElementById("projectGrid");
    if (!container) return;

    container.innerHTML = "";
    projectCards = [];

    projectsData.forEach((project, index) => {
      const content = getProjectContent(project);
      const titleText = content.title || project.id;
      const card = createElement("details", "project card-surface reveal-target");
      card.dataset.category = project.category;
      card.dataset.projectId = project.id;

      const summary = createElement("summary", "project-summary");
      const media = createElement("div", "project-media");
      const image = document.createElement("img");
      image.className = "project-img";
      image.src = project.image;
      image.alt = `${titleText} — ${translateFn("projects.imageAlt") || "representative project view"}`;
      if (project.imageFit === "contain") {
        image.classList.add("is-contain");
        image.style.objectFit = "contain";
      }
      image.loading = index < 2 ? "eager" : "lazy";
      image.decoding = "async";
      media.appendChild(image);

      const body = createElement("div", "project-summary-body");
      const kicker = createElement("div", "project-kicker");
      const projectIconWrap = createElement("span", "project-card-icon");
      const projectIcon = createElement("i", project.icon || "ri-layout-grid-line");
      projectIcon.setAttribute("aria-hidden", "true");
      projectIconWrap.appendChild(projectIcon);
      const projectIndex = createElement("span", "project-index", formatIndex(index));
      const pill = createElement("span", "pill", translateFn(project.pillKey) || "");
      const status = createElement("span", "project-status", content.status || "");
      kicker.append(projectIconWrap, projectIndex, pill, status);

      const dates = createElement("p", "label project-dates");
      const dateIcon = createElement("i", "ri-calendar-line");
      dateIcon.setAttribute("aria-hidden", "true");
      dates.append(dateIcon, createElement("span", "", content.dates || ""));
      const title = createElement("h3", "", titleText);
      const desc = createElement("p", "project-desc", content.summary || "");

      const chips = project.chips || [];
      const chipsWrap = createElement("div", "chips project-chips");
      chips.forEach((chip, chipIndex) => {
        const className = chipIndex >= 2 ? "chip project-chip-extra" : "chip";
        chipsWrap.appendChild(createElement("span", className, chip));
      });
      if (chips.length > 2) {
        chipsWrap.appendChild(createElement("span", "chip project-chip-count", `+${chips.length - 2}`));
      }

      const summaryAction = createElement("span", "project-summary-action");
      const summaryActionText = createElement(
        "span",
        "project-summary-action-text",
        translateFn("projects.toggle.open") || "Open case study"
      );
      const summaryActionIcon = createElement("i", "ri-arrow-down-s-line");
      summaryActionIcon.setAttribute("aria-hidden", "true");
      summaryAction.append(summaryActionText, summaryActionIcon);

      body.append(kicker, dates, title, desc, chipsWrap, summaryAction);
      summary.append(media, body);

      const caseBody = createElement("div", "project-case-body");
      const meta = createElement("div", "project-case-meta");
      const createIconLabel = (labelKey, fallback, iconClass, className = "project-detail-label") => {
        const label = createElement("p", className);
        const icon = createElement("i", iconClass);
        icon.setAttribute("aria-hidden", "true");
        label.append(icon, createElement("span", "", translateFn(labelKey) || fallback));
        return label;
      };
      const roleBlock = createElement("div", "project-meta-block");
      roleBlock.append(
        createIconLabel("projects.detail.role", "Role & ownership", "ri-user-star-line"),
        createElement("p", "project-meta-value", content.role || "")
      );
      const statusBlock = createElement("div", "project-meta-block");
      statusBlock.append(
        createIconLabel("projects.detail.status", "Status", "ri-checkbox-circle-line"),
        createElement("p", "project-meta-value", content.status || "")
      );
      meta.append(roleBlock, statusBlock);

      const createList = (items, className = "project-detail-list") => {
        const list = createElement("ul", className);
        (items || []).forEach((item) => list.appendChild(createElement("li", "", item)));
        return list;
      };

      const createSection = (labelKey, fallback, iconClass, className = "project-detail-card") => {
        const section = createElement("section", className);
        const heading = createElement("h4", "project-detail-title");
        const icon = createElement("i", iconClass);
        icon.setAttribute("aria-hidden", "true");
        heading.append(icon, createElement("span", "", translateFn(labelKey) || fallback));
        section.appendChild(heading);
        return section;
      };

      const narrativeGrid = createElement("div", "project-narrative-grid");
      const challengeSection = createSection("projects.detail.challenge", "Problem to solve", "ri-question-line");
      challengeSection.appendChild(createElement("p", "", content.challenge || ""));
      const contributionSection = createSection("projects.detail.contribution", "What I built", "ri-hammer-line");
      contributionSection.appendChild(createList(content.contribution));
      const technicalSection = createSection("projects.detail.technical", "Technical implementation", "ri-code-box-line");
      technicalSection.appendChild(createList(content.technical));
      narrativeGrid.append(challengeSection, contributionSection, technicalSection);

      const architectureSection = createSection(
        "projects.detail.architecture",
        "Architecture path",
        "ri-node-tree",
        "project-architecture-section"
      );
      if (project.architectureImage) {
        const architectureFigure = createElement("figure", "project-architecture-figure");
        const architectureImage = document.createElement("img");
        architectureImage.src = project.architectureImage;
        architectureImage.alt = `${titleText} — ${translateFn("projects.detail.architectureImage") || "technical architecture diagram"}`;
        architectureImage.loading = "lazy";
        architectureImage.decoding = "async";
        architectureFigure.appendChild(architectureImage);
        architectureSection.appendChild(architectureFigure);
      }
      const architectureFlow = createElement("ol", "architecture-flow");
      (content.architecture || []).forEach((step) => {
        const item = createElement("li", "architecture-step");
        item.append(
          createElement("span", "architecture-step-index", formatIndex(architectureFlow.children.length)),
          createElement("strong", "", step.label || ""),
          createElement("p", "", step.detail || "")
        );
        architectureFlow.appendChild(item);
      });
      architectureSection.appendChild(architectureFlow);

      const evidenceGrid = createElement("div", "project-evidence-grid");
      const outcomesSection = createSection("projects.detail.outcomes", "Outcome & evidence", "ri-line-chart-line");
      outcomesSection.appendChild(createList(content.outcomes, "project-outcome-list"));
      evidenceGrid.appendChild(outcomesSection);

      if (project.links && project.links.length) {
        const linksSection = createSection("projects.detail.links", "Project links", "ri-links-line");
        const linksWrap = createElement("div", "project-links");
        project.links.forEach((link) => {
          const anchor = createElement("a", "project-link");
          anchor.href = link.url;
          anchor.target = "_blank";
          anchor.rel = "noopener";
          const linkIcon = createElement("i", link.icon || "ri-external-link-line");
          linkIcon.setAttribute("aria-hidden", "true");
          anchor.append(linkIcon, createElement("span", "", link.label || "View project"));
          linksWrap.appendChild(anchor);
        });
        linksSection.appendChild(linksWrap);
        evidenceGrid.appendChild(linksSection);
      }

      card.addEventListener("toggle", () => {
        const expanded = card.open;
        summaryActionText.textContent = expanded
          ? translateFn("projects.toggle.close") || "Close case study"
          : translateFn("projects.toggle.open") || "Open case study";
        summaryActionIcon.className = expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line";
      });

      caseBody.append(meta, narrativeGrid, architectureSection, evidenceGrid);
      card.append(summary, caseBody);
      container.appendChild(card);
      projectCards.push(card);
    });

    setProjectFilter(currentProjectFilter);
    registerReveal(container.querySelectorAll(".reveal-target"));
  }

  async function applyTranslations(lang = currentLang) {
    const resolvedLang = availableLangs.includes(lang) ? lang : fallbackLang;
    const primary = (await loadTranslations(resolvedLang)) || {};
    const fallbackDict = resolvedLang === fallbackLang ? primary : (await loadTranslations(fallbackLang)) || {};

    currentLang = resolvedLang;
    localStorage.setItem(langStorageKey, currentLang);
    document.documentElement.lang = currentLang === "zh" ? "zh-Hant" : currentLang;

    const translateFn = (key) => primary[key] ?? fallbackDict[key] ?? "";
    currentTranslate = translateFn;

    const pageTitle = translateFn("page.title");
    if (pageTitle) document.title = pageTitle;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (!key) return;
      const value = translateFn(key);
      if (!value) return;
      if (element.dataset.i18nHtml === "true") {
        setSafeTranslatedMarkup(element, value);
      } else {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const key = element.dataset.i18nAriaLabel;
      const value = key ? translateFn(key) : "";
      if (value) element.setAttribute("aria-label", value);
    });

    await ensureData();
    await Promise.all([renderExperience(translateFn), renderProjects(translateFn)]);
    updateLanguageOptions(currentLang, translateFn);
    setThemeLabel(currentTheme, translateFn);
    setLicenseFilter(currentLicenseFilter);
  }

  function smoothScrollTo(target) {
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }

  const navSections = navLinks
    .map((link) => {
      const selector = link.getAttribute("href");
      const target = selector ? document.querySelector(selector) : null;
      if (!target) return null;
      return { link, target };
    })
    .filter(Boolean);

  function highlightSection() {
    const scrollPosition = window.scrollY + 180;
    let activeLink = null;

    navSections.forEach(({ link, target }) => {
      const top = target.offsetTop;
      const bottom = top + target.offsetHeight;
      if (scrollPosition >= top && scrollPosition < bottom) {
        activeLink = link;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link === activeLink);
    });
  }

  function handleScroll() {
    siteHeader?.classList.toggle("scrolled", window.scrollY > 10);
    highlightSection();
    if (backToTop) {
      const footerVisible = siteFooter && siteFooter.getBoundingClientRect().top < window.innerHeight - 12;
      backToTop.hidden = window.scrollY < 260 || footerVisible;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setProjectFilter(button.dataset.filter || "all"));
  });

  licenseButtons.forEach((button) => {
    button.addEventListener("click", () => setLicenseFilter(button.dataset.licenseFilter || "all"));
  });

  licensePrev?.addEventListener("click", () => moveLicenseCarousel(-1));
  licenseNext?.addEventListener("click", () => moveLicenseCarousel(1));

  licenseViewToggle?.addEventListener("click", () => {
    finishLicenseLoopReset();
    licenseExpanded = !licenseExpanded;
    currentLicenseIndex = 0;
    licenseLoopResetIndex = null;
    updateLicenseCarousel({ animate: false, forceRebuild: true });
  });

  licenseViewport?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveLicenseCarousel(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveLicenseCarousel(1);
    }
  });

  licenseViewport?.addEventListener(
    "touchstart",
    (event) => {
      licenseTouchStartX = event.touches[0]?.clientX ?? null;
    },
    { passive: true }
  );

  licenseViewport?.addEventListener(
    "touchend",
    (event) => {
      if (licenseTouchStartX === null) return;
      const touchEndX = event.changedTouches[0]?.clientX ?? licenseTouchStartX;
      const delta = touchEndX - licenseTouchStartX;
      licenseTouchStartX = null;
      if (Math.abs(delta) >= 44) {
        moveLicenseCarousel(delta < 0 ? 1 : -1);
      }
    },
    { passive: true }
  );

  licenseViewport?.addEventListener("pointerdown", (event) => {
    if (licenseExpanded || event.pointerType !== "mouse" || event.button !== 0) return;
    finishLicenseLoopReset();
    const { canMove, currentOffset, minOffset, maxOffset } = getLicenseDragMetrics();
    if (!canMove) return;
    const transformX = getLicenseTrackTranslateX();
    const visualOffset = transformX ? -transformX : currentOffset;
    licenseDragPointerId = event.pointerId;
    licenseDragStartX = event.clientX;
    licenseDragBaseOffset = Math.min(Math.max(visualOffset, minOffset), maxOffset);
    licenseDragDeltaX = 0;
    licenseDragging = false;
    licenseViewport.classList.add("is-dragging");
    licenseGrid.style.transform = `translate3d(-${licenseDragBaseOffset}px, 0, 0)`;
    licenseViewport.setPointerCapture(event.pointerId);
  });

  licenseViewport?.addEventListener("pointermove", (event) => {
    if (event.pointerId !== licenseDragPointerId) return;
    licenseDragDeltaX = event.clientX - licenseDragStartX;
    if (!licenseDragging && Math.abs(licenseDragDeltaX) < 6) return;
    licenseDragging = true;
    event.preventDefault();

    const { minOffset, maxOffset } = getLicenseDragMetrics();
    let nextOffset = licenseDragBaseOffset - licenseDragDeltaX;
    if (nextOffset < minOffset) nextOffset = minOffset + (nextOffset - minOffset) * 0.24;
    if (nextOffset > maxOffset) nextOffset = maxOffset + (nextOffset - maxOffset) * 0.24;
    licenseGrid.style.transform = `translate3d(-${nextOffset}px, 0, 0)`;
  });

  licenseViewport?.addEventListener("pointerup", (event) => finishLicenseDrag(event));
  licenseViewport?.addEventListener("pointercancel", (event) => finishLicenseDrag(event, true));
  licenseViewport?.addEventListener("lostpointercapture", (event) => finishLicenseDrag(event, true));

  licenseGrid?.addEventListener("transitionend", (event) => {
    if (event.propertyName === "transform") finishLicenseLoopReset();
  });

  licenseViewport?.addEventListener(
    "wheel",
    (event) => {
      if (licenseExpanded) return;
      const horizontalDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.shiftKey
            ? event.deltaY
            : 0;
      if (!horizontalDelta) return;
      event.preventDefault();

      window.clearTimeout(licenseWheelResetTimer);
      licenseWheelResetTimer = window.setTimeout(() => {
        licenseWheelAccumulator = 0;
        licenseWheelGestureActive = false;
      }, 180);

      if (licenseWheelGestureActive) return;
      licenseWheelAccumulator += horizontalDelta;
      if (Math.abs(licenseWheelAccumulator) < 28) return;
      licenseWheelGestureActive = true;
      moveLicenseCarousel(licenseWheelAccumulator > 0 ? 1 : -1);
    },
    { passive: false }
  );

  licenseViewport?.addEventListener(
    "click",
    (event) => {
      if (!licenseSuppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      licenseSuppressClick = false;
    },
    true
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      closeMobileMenu();
      smoothScrollTo(target);
    });
  });

  brandLink?.addEventListener("click", (event) => {
    event.preventDefault();
    closeMobileMenu();
    smoothScrollTo(document.querySelector("#hero"));
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });

  mobileMenuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  themeToggle?.addEventListener("click", () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  });

  languageToggle?.addEventListener("click", () => {
    const isOpen = languageToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeLanguageMenu();
    } else {
      openLanguageMenu();
    }
  });

  languageToggle?.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    openLanguageMenu();
    const selectedIndex = getCurrentLanguageOptionIndex();
    const targetIndex = event.key === "ArrowUp" || event.key === "End"
      ? languageOptions.length - 1
      : event.key === "Home" ? 0 : selectedIndex;
    requestAnimationFrame(() => focusLanguageOption(targetIndex));
  });

  languageMenu?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeLanguageMenu();
      languageToggle?.focus();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = getCurrentLanguageOptionIndex();
    const targetIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? languageOptions.length - 1
        : event.key === "ArrowDown"
          ? Math.min(currentIndex + 1, languageOptions.length - 1)
          : Math.max(currentIndex - 1, 0);
    focusLanguageOption(targetIndex);
  });

  languageOptions.forEach((button) => {
    button.addEventListener("click", async () => {
      await applyTranslations(button.dataset.lang || fallbackLang);
      closeLanguageMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (languageMenu && languageToggle && !languageMenu.hidden) {
      if (!languageMenu.contains(target) && !languageToggle.contains(target)) {
        closeLanguageMenu();
      }
    }

    if (siteHeader?.classList.contains("menu-open") && !siteHeader.contains(target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeLanguageMenu();
    if (siteHeader?.classList.contains("menu-open")) {
      closeMobileMenu({ restoreFocus: true });
    }
  });

  mobileMenuQuery.addEventListener("change", (event) => {
    if (!event.matches) closeMobileMenu();
  });

  applyTheme(initialTheme);
  setLicenseFilter(currentLicenseFilter);
  registerReveal();
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => {
    if (licenseResizeFrame) cancelAnimationFrame(licenseResizeFrame);
    licenseResizeFrame = requestAnimationFrame(() => {
      licenseResizeFrame = null;
      finishLicenseLoopReset();
      updateLicenseCarousel({ animate: false, forceRebuild: true });
    });
  });
  applyTranslations(currentLang).then(() => {
    registerReveal();
    highlightSection();
  });
})();
