import { createI18nController } from "./i18n.js";
import { createMobileMenuController } from "./mobile-menu.js";
import { createThemeController } from "./theme.js";

const themeToggle = document.querySelector(".theme-toggle");
const themeToggleLabel = document.querySelector(".theme-toggle-label");
let i18nController;

const themeController = createThemeController({
  root: document.documentElement,
  themeToggle,
  themeToggleLabel,
  getCurrentLang: () => i18nController?.getCurrentLang() || "en"
});

const mobileMenuController = createMobileMenuController({
  closeLanguageMenu: () => i18nController?.closeMenu()
});

i18nController = createI18nController({
  i18nBasePath: "../assets/i18n/blog",
  pageTitleKey: "blog.page.title",
  onApply: async ({ translate }) => {
    themeController.setLabel(translate);
  }
});

mobileMenuController.bind();
themeController.bind();
i18nController.bind();
themeController.applyInitial();
i18nController.applyTranslations(i18nController.getCurrentLang());
