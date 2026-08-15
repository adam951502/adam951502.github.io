import fs from "node:fs";

const cssPath = "assets/css/style.css";
const source = fs.readFileSync(cssPath, "utf8");
const deadClasses = [
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

function containsDeadSelector(selector) {
  return deadClasses.some((className) => {
    const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\.${escaped}(?![A-Za-z0-9_-])`).test(selector);
  });
}

function findNextOpenBrace(text, start) {
  let quote = null;
  let comment = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (comment) {
      if (char === "*" && next === "/") {
        comment = false;
        index += 1;
      }
      continue;
    }
    if (!quote && char === "/" && next === "*") {
      comment = true;
      index += 1;
      continue;
    }
    if (quote) {
      if (char === "\\") index += 1;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "{") return index;
  }
  return -1;
}

function findMatchingBrace(text, openIndex) {
  let depth = 0;
  let quote = null;
  let comment = false;
  for (let index = openIndex; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (comment) {
      if (char === "*" && next === "/") {
        comment = false;
        index += 1;
      }
      continue;
    }
    if (!quote && char === "/" && next === "*") {
      comment = true;
      index += 1;
      continue;
    }
    if (quote) {
      if (char === "\\") index += 1;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error(`Unmatched CSS brace at ${openIndex}`);
}

function cleanStylesheet(text) {
  let cursor = 0;
  let output = "";

  while (cursor < text.length) {
    const open = findNextOpenBrace(text, cursor);
    if (open < 0) {
      output += text.slice(cursor);
      break;
    }
    const close = findMatchingBrace(text, open);
    const prefix = text.slice(cursor, open);
    const body = text.slice(open + 1, close);
    const trimmed = prefix.trim();

    if (!trimmed) {
      output += text.slice(cursor, close + 1);
      cursor = close + 1;
      continue;
    }

    if (trimmed.startsWith("@media")) {
      output += prefix + "{" + cleanStylesheet(body) + "}";
      cursor = close + 1;
      continue;
    }

    if (trimmed.startsWith("@") || !containsDeadSelector(trimmed)) {
      output += text.slice(cursor, close + 1);
      cursor = close + 1;
      continue;
    }

    const selectors = trimmed.split(",").map((selector) => selector.trim()).filter(Boolean);
    const keptSelectors = selectors.filter((selector) => !containsDeadSelector(selector));
    if (keptSelectors.length) {
      const leading = prefix.slice(0, prefix.indexOf(trimmed));
      output += leading + keptSelectors.join(",\n") + " {" + body + "}";
    }
    cursor = close + 1;
  }

  return output;
}

const cleaned = cleanStylesheet(source);
for (const className of deadClasses) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (new RegExp(`\\.${escaped}(?![A-Za-z0-9_-])`).test(cleaned)) {
    throw new Error(`Dead selector remains after cleanup: .${className}`);
  }
}
for (const required of [".skill-stack", ".skill-row", ".skill-branch-index", ".skill-cluster"]) {
  if (!cleaned.includes(required)) throw new Error(`Current skill selector was lost: ${required}`);
}

fs.writeFileSync(cssPath, cleaned);
console.log(`Removed dead skill-tree selectors while preserving current skill-row/shared selectors (${source.length - cleaned.length} characters removed).`);
