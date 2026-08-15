import fs from "node:fs";
import path from "node:path";

const runtimeRoot = path.join("assets", "js");
const runtime = fs.readdirSync(runtimeRoot)
  .filter((file) => file.endsWith(".js"))
  .sort()
  .map((file) => fs.readFileSync(path.join(runtimeRoot, file), "utf8"))
  .join("\n");
const indexHtml = fs.readFileSync("index.html", "utf8");
const blogHtml = fs.readFileSync("blog/index.html", "utf8");
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
  'event.key === "Escape"',
  "createMobileMenuController",
  "closeMobileMenu({ restoreFocus: true })"
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

const requiredBlogFragments = [
  'class="lang-toggle"',
  'class="lang-menu"',
  'data-i18n="blog.title"',
  'data-i18n="blog.empty.title"',
  'data-i18n-aria-label="blog.areasLabel"',
  '<script type="module" src="../assets/js/blog.js"></script>'
];
for (const fragment of requiredBlogFragments) {
  if (!blogHtml.includes(fragment)) errors.push(`Missing Blog accessibility/i18n guard: ${fragment}`);
}
if (blogHtml.includes("(() => {")) {
  errors.push("Blog must not maintain a separate inline runtime IIFE");
}

if (errors.length) {
  console.error("Accessibility/runtime validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Accessibility/runtime validation passed across portfolio + Blog modules: safe translated markup, action-oriented theme labels, keyboard language/mobile navigation, Blog i18n, ${translatedMarkupElements.length} translated list containers.`);
