import { setSafeTranslatedMarkup } from "./shared.js";

export function createI18nController({ onApply }) {
  const availableLangs = ["en", "zh"];
  const fallbackLang = "en";
  const langStorageKey = "site-lang";
  const i18nBasePath = "./assets/i18n";
  const translationsCache = {};

  const languageToggle = document.querySelector(".lang-toggle");
  const languageMenu = document.querySelector(".lang-menu");
  const languageOptions = Array.from(document.querySelectorAll(".lang-option"));
  const languageLabel = document.querySelector(".lang-label");

  let currentLang = detectLanguage();
  let currentTranslate = (key) => key;

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

  function closeMenu() {
    if (!languageMenu || !languageToggle) return;
    languageMenu.classList.remove("is-open");
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
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
      if (element.dataset.i18nHtml === "true") setSafeTranslatedMarkup(element, value);
      else element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const key = element.dataset.i18nAriaLabel;
      const value = key ? translateFn(key) : "";
      if (value) element.setAttribute("aria-label", value);
    });

    await onApply({ lang: currentLang, translate: translateFn });
    updateLanguageOptions(currentLang, translateFn);
  }

  function bind() {
    languageToggle?.addEventListener("click", () => {
      const isOpen = languageToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMenu();
      else openMenu();
    });

    languageToggle?.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      openMenu();
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
        closeMenu();
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
        closeMenu();
      });
    });

    document.addEventListener("click", (event) => {
      if (languageMenu && languageToggle && !languageMenu.hidden) {
        if (!languageMenu.contains(event.target) && !languageToggle.contains(event.target)) closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  return {
    bind,
    applyTranslations,
    closeMenu,
    getCurrentLang: () => currentLang,
    getTranslate: () => currentTranslate
  };
}
