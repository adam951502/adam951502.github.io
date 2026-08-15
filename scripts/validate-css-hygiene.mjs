import fs from "node:fs";

const css = fs.readFileSync("assets/css/style.css", "utf8");
const indexHtml = fs.readFileSync("index.html", "utf8");
const errors = [];

const forbiddenClasses = [
  "skill-tree",
  "skill-tree-root",
  "skill-root-copy",
  "skill-root-icon",
  "skill-root-kicker",
  "skill-root-note",
  "skill-root-signals",
  "skill-delivery-path",
  "skill-path-label",
  "skill-path-steps",
  "skill-path-index",
  "skill-tree-trunk",
  "skill-tree-hint",
  "skill-branches",
  "skill-branch",
  "skill-branch-heading",
  "skill-branch-meta",
  "skill-branch-body"
];

for (const className of forbiddenClasses) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const selectorPattern = new RegExp(`\\.${escaped}(?![A-Za-z0-9_-])`);
  if (selectorPattern.test(css)) errors.push(`Legacy CSS selector returned: .${className}`);
  const classPattern = new RegExp(`class=["'][^"']*\\b${escaped}\\b`);
  if (classPattern.test(indexHtml)) errors.push(`Legacy skill class unexpectedly appears in HTML: ${className}`);
}

for (const required of ["skill-stack", "skill-row", "skill-branch-index", "skill-cluster"]) {
  if (!indexHtml.includes(required)) errors.push(`Current skill markup is missing: ${required}`);
  if (!css.includes(`.${required}`)) errors.push(`Current skill CSS is missing: .${required}`);
}

if (errors.length) {
  console.error("CSS hygiene validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("CSS hygiene passed: legacy skill-tree selectors are absent and current skill-row/shared selectors remain.");
