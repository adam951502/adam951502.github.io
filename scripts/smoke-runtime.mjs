import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const repoRoot = process.cwd();
const port = 4173;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml"
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\//, "");
  const absolutePath = path.resolve(repoRoot, relativePath);

  if (!absolutePath.startsWith(repoRoot + path.sep) && absolutePath !== path.join(repoRoot, "index.html")) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(absolutePath, (error, body) => {
    if (error) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(absolutePath).toLowerCase()] || "application/octet-stream" });
    response.end(body);
  });
});

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

const executableCandidates = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);
const executablePath = executableCandidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) {
  server.close();
  throw new Error(`Chrome/Chromium executable not found. Checked: ${executableCandidates.join(", ")}`);
}

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
const consoleErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});

try {
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelectorAll("#projectGrid .reveal-target").length === 25);
  await page.waitForFunction(() => document.querySelectorAll("#experienceList .reveal-target").length === 10);

  const initial = await page.evaluate(() => ({
    projects: document.querySelectorAll("#projectGrid [data-project-id]").length,
    experiences: document.querySelectorAll("#experienceList .timeline-card").length,
    lang: document.documentElement.lang,
    theme: document.documentElement.dataset.theme
  }));
  if (initial.projects !== 25) throw new Error(`Expected 25 projects, got ${initial.projects}`);
  if (initial.experiences !== 10) throw new Error(`Expected 10 experience entries, got ${initial.experiences}`);
  if (initial.lang !== "en") throw new Error(`Expected initial lang=en, got ${initial.lang}`);
  if (initial.theme !== "light") throw new Error(`Expected initial theme=light, got ${initial.theme}`);

  await page.click(".theme-toggle");
  await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");

  await page.click(".lang-toggle");
  await page.click('.lang-option[data-lang="zh"]');
  await page.waitForFunction(() => document.documentElement.lang === "zh-Hant");
  await page.waitForFunction(() => document.querySelectorAll("#projectGrid .reveal-target").length === 25);

  const translatedTitle = await page.locator("#projectGrid [data-project-id] h3").first().textContent();
  if (!translatedTitle?.trim()) throw new Error("Translated project title is empty after switching to zh");

  if (pageErrors.length) throw new Error(`Browser page errors:\n${pageErrors.join("\n")}`);
  if (consoleErrors.length) throw new Error(`Browser console errors:\n${consoleErrors.join("\n")}`);

  console.log(`Runtime smoke passed: ${initial.projects} projects, ${initial.experiences} experience entries, theme toggle, zh-Hant translation, no browser errors.`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
