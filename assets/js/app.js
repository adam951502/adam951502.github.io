import { createCarouselController } from "./carousel.js";
import { createDataStore } from "./data.js";
import { renderExperience } from "./experience.js";
import { createI18nController } from "./i18n.js";
import { createNavigationController } from "./navigation.js";
import { createProjectsController } from "./projects.js";
import { createRevealController } from "./shared.js";
import { createThemeController } from "./theme.js";

const config = window.__PORTFOLIO_CONFIG__ || {};
const dataPaths = config.dataPaths || {
  experience: "./assets/data/experience.json",
  projects: "./assets/data/projects.bundle.json"
};
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleLabel = document.querySelector(".theme-toggle-label");

const dataStore = createDataStore(dataPaths);
const revealController = createRevealController({ prefersReducedMotion });
let i18nController;

const themeController = createThemeController({
  root: document.documentElement,
  themeToggle,
  themeToggleLabel,
  getCurrentLang: () => i18nController?.getCurrentLang() || "en"
});

const projectsController = createProjectsController({
  filterButtons,
  getCurrentLang: () => i18nController?.getCurrentLang() || "en",
  registerReveal: revealController.register
});

const carouselController = createCarouselController({
  prefersReducedMotion,
  getTranslate: () => i18nController?.getTranslate() || ((key) => key),
  licenseButtons,
  licenseCards,
  licenseCarousel,
  licenseGrid,
  licenseViewport,
  licensePrev,
  licenseNext,
  licenseViewToggle,
  licenseViewToggleText,
  licenseDots
});

const navigationController = createNavigationController({
  prefersReducedMotion,
  closeLanguageMenu: () => i18nController?.closeMenu()
});

i18nController = createI18nController({
  onApply: async ({ translate }) => {
    await dataStore.ensureData();
    await Promise.all([
      Promise.resolve(renderExperience({
        experienceData: dataStore.getExperienceData(),
        translateFn: translate,
        registerReveal: revealController.register
      })),
      Promise.resolve(projectsController.render(dataStore.getProjectsData(), translate))
    ]);
    themeController.setLabel(translate);
    carouselController.refreshLanguage();
  }
});

projectsController.bind();
carouselController.bind();
navigationController.bind();
themeController.bind();
i18nController.bind();

themeController.applyInitial();
carouselController.setFilter("all");
revealController.register();
navigationController.handleScroll();
window.addEventListener("resize", carouselController.handleResize);

i18nController.applyTranslations(i18nController.getCurrentLang()).then(() => {
  revealController.register();
  navigationController.highlightSection();
});
