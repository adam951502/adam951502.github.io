export function createThemeController({ root, themeToggle, themeToggleLabel, getCurrentLang }) {
  const themeStorageKey = "theme";
  const savedTheme = localStorage.getItem(themeStorageKey);
  const initialTheme = savedTheme || "light";
  let currentTheme = initialTheme;
  let currentTranslate = (key) => key;

  function setLabel(translateFn = currentTranslate) {
    currentTranslate = translateFn;
    if (!themeToggle || !themeToggleLabel) return;
    const key = currentTheme === "light" ? "theme.light" : "theme.dark";
    const translatedLabel = translateFn(key);
    const label = translatedLabel && translatedLabel !== key
      ? translatedLabel
      : currentTheme === "light" ? "Light" : "Dark";
    themeToggleLabel.textContent = label;

    const targetTheme = currentTheme === "light" ? "dark" : "light";
    const targetKey = targetTheme === "light" ? "theme.light" : "theme.dark";
    const translatedTargetLabel = translateFn(targetKey);
    const targetLabel = translatedTargetLabel && translatedTargetLabel !== targetKey
      ? translatedTargetLabel
      : targetTheme === "light" ? "Light" : "Dark";
    const actionLabel = getCurrentLang() === "zh"
      ? "切換至" + targetLabel + "模式"
      : "Switch to " + targetLabel.toLowerCase() + " theme";
    themeToggle.setAttribute("aria-label", actionLabel);

    const icon = themeToggle.querySelector("i");
    if (icon) icon.className = currentTheme === "light" ? "ri-sun-line" : "ri-moon-line";
  }

  function apply(theme) {
    currentTheme = theme;
    root.dataset.theme = theme;
    localStorage.setItem(themeStorageKey, theme);
    setLabel(currentTranslate);
  }

  function bind() {
    themeToggle?.addEventListener("click", () => {
      apply(currentTheme === "light" ? "dark" : "light");
    });
  }

  return {
    bind,
    applyInitial: () => apply(initialTheme),
    setLabel,
    getCurrentTheme: () => currentTheme
  };
}
