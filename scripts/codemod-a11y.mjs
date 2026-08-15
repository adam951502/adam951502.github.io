import fs from "node:fs";

const scriptPath = "assets/js/script.js";
let source = fs.readFileSync(scriptPath, "utf8");

function replaceExact(label, before, after) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly one match, found ${count}`);
  source = source.replace(before, after);
}

replaceExact(
  "theme action label",
`  function setThemeLabel(theme = currentTheme, translateFn = currentTranslate) {
    if (!themeToggle || !themeToggleLabel) return;
    const key = theme === "light" ? "theme.light" : "theme.dark";
    const label = translateFn(key) || (theme === "light" ? "Light" : "Dark");
    themeToggleLabel.textContent = label;
    themeToggle.setAttribute("aria-label", label);

    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className = theme === "light" ? "ri-sun-line" : "ri-moon-line";
    }
  }
`,
`  function setThemeLabel(theme = currentTheme, translateFn = currentTranslate) {
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
`
);

replaceExact(
  "safe translated markup helper",
`  function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof textContent === "string") element.textContent = textContent;
    return element;
  }

  function formatIndex(index) {
`,
`  function createElement(tag, className, textContent) {
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
`
);

replaceExact(
  "experience translated list",
`      const listHtml = translateFn(item.listKey);
      if (listHtml) list.innerHTML = listHtml;
`,
`      const listHtml = translateFn(item.listKey);
      if (listHtml) setSafeTranslatedMarkup(list, listHtml);
`
);

replaceExact(
  "generic translated markup",
`      if (element.dataset.i18nHtml === "true") {
        element.innerHTML = value;
      } else {
        element.textContent = value;
      }
`,
`      if (element.dataset.i18nHtml === "true") {
        setSafeTranslatedMarkup(element, value);
      } else {
        element.textContent = value;
      }
`
);

replaceExact(
  "language option focus helper",
`  function openLanguageMenu() {
    if (!languageMenu || !languageToggle) return;
    languageMenu.hidden = false;
    requestAnimationFrame(() => languageMenu.classList.add("is-open"));
    languageToggle.setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu({ restoreFocus = false } = {}) {
`,
`  function openLanguageMenu() {
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
`
);

replaceExact(
  "language menu keyboard controls",
`  languageToggle?.addEventListener("click", () => {
    const isOpen = languageToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeLanguageMenu();
    } else {
      openLanguageMenu();
    }
  });

  languageOptions.forEach((button) => {
`,
`  languageToggle?.addEventListener("click", () => {
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
`
);

fs.writeFileSync(scriptPath, source);
console.log("Applied guarded i18n/accessibility runtime codemod.");
