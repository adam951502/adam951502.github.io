import fs from "node:fs";
import path from "node:path";

const jsRoot = path.join("assets", "js");
const expectedModules = [
  "app.js",
  "carousel.js",
  "data.js",
  "experience.js",
  "i18n.js",
  "navigation.js",
  "projects.js",
  "script.js",
  "shared.js",
  "theme.js"
];
const files = fs.readdirSync(jsRoot).filter((file) => file.endsWith(".js")).sort();
const errors = [];

for (const expected of expectedModules) {
  if (!files.includes(expected)) errors.push(`Missing runtime module: assets/js/${expected}`);
}

const unexpected = files.filter((file) => !expectedModules.includes(file));
if (unexpected.length) errors.push(`Unexpected runtime JS files: ${unexpected.join(", ")}`);

const sources = Object.fromEntries(
  files.map((file) => [file, fs.readFileSync(path.join(jsRoot, file), "utf8")])
);

if ((sources["script.js"] || "").length > 1200) {
  errors.push("assets/js/script.js must remain a small compatibility/bootstrap entry (<= 1200 characters)");
}
if (!(sources["script.js"] || "").includes('import("./app.js")')) {
  errors.push("assets/js/script.js must dynamically import ./app.js");
}
if ((sources["script.js"] || "").includes("(function ()")) {
  errors.push("The legacy monolithic IIFE must not return to assets/js/script.js");
}

const requiredAppImports = [
  "./carousel.js",
  "./data.js",
  "./experience.js",
  "./i18n.js",
  "./navigation.js",
  "./projects.js",
  "./shared.js",
  "./theme.js"
];
for (const modulePath of requiredAppImports) {
  if (!(sources["app.js"] || "").includes(modulePath)) {
    errors.push(`assets/js/app.js must explicitly import ${modulePath}`);
  }
}

const responsibilityChecks = {
  "data.js": ["createDataStore", "ensureData", "loadJson"],
  "i18n.js": ["createI18nController", "applyTranslations", "languageToggle"],
  "projects.js": ["createProjectsController", "render", "setFilter"],
  "experience.js": ["renderExperience"],
  "carousel.js": ["createCarouselController", "licenseViewport", "setFilter"],
  "navigation.js": ["createNavigationController", "highlightSection", "closeMobileMenu"],
  "theme.js": ["createThemeController", "themeStorageKey", "aria-label"],
  "shared.js": ["setSafeTranslatedMarkup", "createRevealController", "createElement"]
};

for (const [file, fragments] of Object.entries(responsibilityChecks)) {
  for (const fragment of fragments) {
    if (!(sources[file] || "").includes(fragment)) {
      errors.push(`${file} is missing expected responsibility marker: ${fragment}`);
    }
  }
}

for (const [file, source] of Object.entries(sources)) {
  if (file === "script.js") continue;
  const size = Buffer.byteLength(source);
  if (size > 24 * 1024) errors.push(`${file} is ${Math.ceil(size / 1024)} KiB; keep feature modules below 24 KiB`);
}

if (errors.length) {
  console.error("Runtime module validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Runtime module validation passed: ${files.length} focused JS files with explicit app imports and a small bootstrap entry.`);
