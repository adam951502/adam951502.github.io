import fs from "node:fs";

const runtime = fs.readFileSync("assets/js/script.js", "utf8");
const indexHtml = fs.readFileSync("index.html", "utf8");
const errors = [];

const requiredRuntimeFragments = [
  "function setSafeTranslatedMarkup(element, markup)",
  'const allowedTags = new Set(["LI", "STRONG", "EM", "CODE", "BR"]);',
  "setSafeTranslatedMarkup(list, listHtml)",
  "setSafeTranslatedMarkup(element, value)",
  '"Switch to " + targetLabel.toLowerCase() + " theme"',
  '"切換至" + targetLabel + "模式"',
  'languageToggle?.addEventListener("keydown"',
  'languageMenu?.addEventListener("keydown"',
  '["ArrowDown", "ArrowUp", "Home", "End"]',
  'event.key === "Escape"'
];

for (const fragment of requiredRuntimeFragments) {
  if (!runtime.includes(fragment)) errors.push(`Missing runtime accessibility guard: ${fragment}`);
}

const forbiddenRuntimeFragments = [
  "element.innerHTML = value",
  "list.innerHTML = listHtml"
];
for (const fragment of forbiddenRuntimeFragments) {
  if (runtime.includes(fragment)) errors.push(`Unsafe translated markup assignment returned: ${fragment}`);
}

const translatedMarkupElements = [...indexHtml.matchAll(/<([a-z0-9-]+)[^>]*data-i18n-html="true"/gi)];
for (const match of translatedMarkupElements) {
  if (!["ul", "ol"].includes(match[1].toLowerCase())) {
    errors.push(`data-i18n-html is only allowed on list containers; found <${match[1]}>`);
  }
}

if (!translatedMarkupElements.length) {
  errors.push("Expected translated list markup in index.html but found none");
}

if (errors.length) {
  console.error("Accessibility/runtime validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Accessibility/runtime validation passed: safe translated markup, action-oriented theme label, keyboard language navigation, ${translatedMarkupElements.length} translated list containers.`);
