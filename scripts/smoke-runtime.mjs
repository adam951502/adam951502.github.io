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
  const relativePath = requestPath === "/"
    ? "index.html"
    : requestPath.endsWith("/")
      ? `${requestPath.replace(/^\//, "")}index.html`
      : requestPath.replace(/^\//, "");
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

async function assertSkillIconsContained(label) {
  const rows = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".skill-row")).map((row, index) => {
      const icon = row.querySelector(".skill-icon");
      if (!icon) return { index, valid: false };

      const rowRect = row.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const style = getComputedStyle(icon);
      return {
        index,
        valid: true,
        display: style.display,
        visibility: style.visibility,
        rowLeft: rowRect.left,
        rowRight: rowRect.right,
        rowTop: rowRect.top,
        rowBottom: rowRect.bottom,
        iconLeft: iconRect.left,
        iconRight: iconRect.right,
        iconTop: iconRect.top,
        iconBottom: iconRect.bottom,
        iconWidth: iconRect.width,
        iconHeight: iconRect.height
      };
    })
  );

  if (rows.length !== 4) throw new Error(`Expected 4 skill rows at ${label} viewport, got ${rows.length}`);

  for (const row of rows) {
    if (!row.valid) throw new Error(`Skill row ${row.index + 1} is missing its icon at ${label} viewport`);
    if (row.display === "none" || row.visibility === "hidden" || row.iconWidth <= 0 || row.iconHeight <= 0) {
      throw new Error(`Skill row ${row.index + 1} icon is not visibly laid out at ${label} viewport`);
    }

    const tolerance = 0.5;
    const contained =
      row.iconLeft >= row.rowLeft - tolerance &&
      row.iconRight <= row.rowRight + tolerance &&
      row.iconTop >= row.rowTop - tolerance &&
      row.iconBottom <= row.rowBottom + tolerance;

    if (!contained) {
      throw new Error(
        `Skill row ${row.index + 1} icon escapes its card at ${label} viewport: ` +
          `icon=(${row.iconLeft},${row.iconTop})-(${row.iconRight},${row.iconBottom}), ` +
          `row=(${row.rowLeft},${row.rowTop})-(${row.rowRight},${row.rowBottom})`
      );
    }
  }
}

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

  const blogNavHref = await page.locator('.site-nav a[href="./blog/"]').getAttribute("href");
  if (blogNavHref !== "./blog/") throw new Error("Main navigation is missing the Blog route");

  const marqueeStructure = await page.evaluate(() => ({
    primaryItems: document.querySelectorAll('.affiliation-marquee__group:not([aria-hidden="true"]) .affiliation-item').length,
    duplicateItems: document.querySelectorAll('.affiliation-marquee__group[aria-hidden="true"] .affiliation-item').length,
    duplicateHidden: document.querySelector('.affiliation-marquee__group[aria-hidden="true"]')?.getAttribute("aria-hidden"),
    animationName: document.querySelector('.affiliation-marquee__track')
      ? getComputedStyle(document.querySelector('.affiliation-marquee__track')).animationName
      : null
  }));
  if (marqueeStructure.primaryItems !== 6) throw new Error(`Expected 6 primary affiliation items, got ${marqueeStructure.primaryItems}`);
  if (marqueeStructure.duplicateItems !== 6) throw new Error(`Expected 6 duplicate affiliation items, got ${marqueeStructure.duplicateItems}`);
  if (marqueeStructure.duplicateHidden !== "true") throw new Error("Duplicate affiliation group is not aria-hidden");
  const heraklionLogo = page.locator('.affiliation-marquee__group:not([aria-hidden="true"]) img[alt="HERAKLION"]');
  if (await heraklionLogo.count() !== 1) throw new Error("Official HERAKLION logo is missing from the primary affiliation group");
  const heraklionSrc = await heraklionLogo.getAttribute("src");
  if (heraklionSrc !== "assets/images/logo-heraklion.gif") throw new Error(`Unexpected HERAKLION logo source: ${heraklionSrc}`);

  const emiLogo = page.locator('.affiliation-marquee__group:not([aria-hidden="true"]) img[alt="Fraunhofer EMI"]');
  if (await emiLogo.count() !== 1) throw new Error("Official Fraunhofer EMI logo is missing from the primary affiliation group");
  const emiSrc = await emiLogo.getAttribute("src");
  if (emiSrc !== "assets/images/logo-emi.png") throw new Error(`Unexpected Fraunhofer EMI logo source: ${emiSrc}`);
  if (marqueeStructure.animationName !== "affiliation-marquee-right") {
    throw new Error(`Unexpected affiliation marquee animation: ${marqueeStructure.animationName}`);
  }

  const marqueeXBefore = await page.locator('.affiliation-marquee__track').evaluate((element) => element.getBoundingClientRect().x);
  await page.waitForTimeout(300);
  const marqueeXAfter = await page.locator('.affiliation-marquee__track').evaluate((element) => element.getBoundingClientRect().x);
  if (marqueeXAfter <= marqueeXBefore) {
    throw new Error(`Affiliation marquee is not moving right: before=${marqueeXBefore}, after=${marqueeXAfter}`);
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedMotion = await page.evaluate(() => ({
    animationName: getComputedStyle(document.querySelector('.affiliation-marquee__track')).animationName,
    duplicateDisplay: getComputedStyle(document.querySelector('.affiliation-marquee__group[aria-hidden="true"]')).display
  }));
  if (reducedMotion.animationName !== "none") throw new Error("Affiliation marquee does not stop for reduced-motion users");
  if (reducedMotion.duplicateDisplay !== "none") throw new Error("Reduced-motion mode still renders the duplicate marquee group");
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const affiliationScaleInput = page.locator("[data-affiliation-scale]");
  if (await affiliationScaleInput.count() !== 1) throw new Error("Affiliation scale slider is missing");
  if (await affiliationScaleInput.inputValue() !== "100") throw new Error("Affiliation scale slider does not start at 100%");

  const logoHeightAt100 = await heraklionLogo.evaluate((element) => element.getBoundingClientRect().height);
  await affiliationScaleInput.evaluate((element) => {
    element.value = "130";
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForFunction(() => localStorage.getItem("portfolio.affiliationScale") === "130");
  const logoHeightAt130 = await heraklionLogo.evaluate((element) => element.getBoundingClientRect().height);
  if (logoHeightAt130 <= logoHeightAt100) throw new Error(`Affiliation scale did not enlarge the logo: 100%=${logoHeightAt100}, 130%=${logoHeightAt130}`);

  const desktopItemHeightVar = await page.locator(".signature-strip").evaluate((element) =>
    Number.parseFloat(element.style.getPropertyValue("--affiliation-item-height"))
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => window.matchMedia("(max-width: 720px)").matches);
  const mobileItemHeightVar = await page.locator(".signature-strip").evaluate((element) =>
    Number.parseFloat(element.style.getPropertyValue("--affiliation-item-height"))
  );
  if (!(mobileItemHeightVar > 0 && mobileItemHeightVar < desktopItemHeightVar)) {
    throw new Error(`Affiliation scale did not recalculate for mobile: desktop=${desktopItemHeightVar}, mobile=${mobileItemHeightVar}`);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelectorAll("#projectGrid .reveal-target").length === 25);
  if (await page.locator("[data-affiliation-scale]").inputValue() !== "130") throw new Error("Affiliation scale did not persist after reload");
  const storedScaleAfterReload = await page.evaluate(() => localStorage.getItem("portfolio.affiliationScale"));
  if (storedScaleAfterReload !== "130") throw new Error(`Unexpected stored affiliation scale after reload: ${storedScaleAfterReload}`);

  await page.locator("[data-affiliation-scale-reset]").click();
  if (await page.locator("[data-affiliation-scale]").inputValue() !== "100") throw new Error("Affiliation scale reset did not restore 100%");
  const storedScaleAfterReset = await page.evaluate(() => localStorage.getItem("portfolio.affiliationScale"));
  if (storedScaleAfterReset !== null) throw new Error("Affiliation scale reset did not clear localStorage");

  await assertSkillIconsContained("desktop");

  const firstProject = page.locator("#projectGrid [data-project-id]").first();
  await firstProject.evaluate((element) => element.scrollIntoView({ block: "start", inline: "nearest" }));
  await page.waitForTimeout(100);
  await firstProject.locator("summary").click();
  await page.waitForFunction(() => document.querySelector("#projectGrid [data-project-id]")?.open === true);

  const expandedProject = await firstProject.evaluate((element) => {
    const caseBody = element.querySelector(".project-case-body");
    const header = document.querySelector(".site-header");
    if (!caseBody || !header) return { valid: false };

    const caseRect = caseBody.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const style = getComputedStyle(caseBody);
    return {
      valid: true,
      open: element.open,
      caseTop: caseRect.top,
      caseWidth: caseRect.width,
      caseHeight: caseRect.height,
      headerBottom: headerRect.bottom,
      display: style.display,
      visibility: style.visibility
    };
  });

  if (!expandedProject.valid) throw new Error("Project case-study or sticky header element is missing");
  if (!expandedProject.open) throw new Error("First project did not enter the open state");
  if (expandedProject.display === "none" || expandedProject.visibility === "hidden") {
    throw new Error("Expanded project case-study is not visible");
  }
  if (expandedProject.caseWidth <= 0 || expandedProject.caseHeight <= 0) {
    throw new Error("Expanded project case-study has no visible layout box");
  }
  if (expandedProject.caseTop < expandedProject.headerBottom) {
    throw new Error(
      `Sticky navbar overlaps expanded project content: caseTop=${expandedProject.caseTop}, headerBottom=${expandedProject.headerBottom}`
    );
  }

  await page.click(".theme-toggle");
  await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");

  await page.click(".lang-toggle");
  await page.click('.lang-option[data-lang="zh"]');
  await page.waitForFunction(() => document.documentElement.lang === "zh-Hant");
  await page.waitForFunction(() => document.querySelectorAll("#projectGrid .reveal-target").length === 25);

  const translatedTitle = await page.locator("#projectGrid [data-project-id] h3").first().textContent();
  if (!translatedTitle?.trim()) throw new Error("Translated project title is empty after switching to zh");

  const translatedAffiliationTitle = await page.locator('.signature-copy [data-i18n="hero.aside.title"]').textContent();
  if (translatedAffiliationTitle?.trim() !== "跨研究與產業經歷") {
    throw new Error(`Unexpected translated affiliation heading: ${translatedAffiliationTitle}`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  await assertSkillIconsContained("mobile");

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`http://127.0.0.1:${port}/blog/`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.lang === "zh-Hant");
  const blogState = await page.evaluate(() => ({
    title: document.querySelector("h1")?.textContent?.trim(),
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    emptyState: document.querySelector("[data-blog-empty]")?.textContent?.trim(),
    theme: document.documentElement.dataset.theme,
    lang: document.documentElement.lang,
    portfolioHref: document.querySelector('.site-nav a[href="../"]')?.getAttribute("href")
  }));
  if (blogState.title !== "部落格 / 筆記") throw new Error(`Unexpected translated Blog heading: ${blogState.title}`);
  if (blogState.lang !== "zh-Hant") throw new Error(`Expected persisted Blog lang=zh-Hant, got ${blogState.lang}`);
  if (blogState.canonical !== "https://adam951502.github.io/blog/") throw new Error(`Unexpected blog canonical: ${blogState.canonical}`);
  if (!blogState.emptyState?.includes("尚未發布文章")) throw new Error("Translated Blog empty state is missing or misleading");
  if (blogState.theme !== "dark") throw new Error(`Expected persisted dark theme on Blog, got ${blogState.theme}`);
  if (blogState.portfolioHref !== "../") throw new Error("Blog page is missing its Portfolio navigation link");

  await page.click(".lang-toggle");
  await page.click('.lang-option[data-lang="en"]');
  await page.waitForFunction(() => document.documentElement.lang === "en");
  const englishBlogTitle = await page.locator("h1").textContent();
  if (englishBlogTitle?.trim() !== "Blog / Notes") throw new Error(`Blog did not switch back to English: ${englishBlogTitle}`);

  await page.click(".theme-toggle");
  await page.waitForFunction(() => document.documentElement.dataset.theme === "light");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.click(".mobile-menu-toggle");
  await page.waitForFunction(() => document.querySelector(".mobile-menu-toggle")?.getAttribute("aria-expanded") === "true");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.querySelector(".mobile-menu-toggle")?.getAttribute("aria-expanded") === "false");
  const menuFocusRestored = await page.evaluate(() => document.activeElement === document.querySelector(".mobile-menu-toggle"));
  if (!menuFocusRestored) throw new Error("Blog mobile menu did not restore focus after Escape");

  if (pageErrors.length) throw new Error(`Browser page errors:\n${pageErrors.join("\n")}`);
  if (consoleErrors.length) throw new Error(`Browser console errors:\n${consoleErrors.join("\n")}`);

  console.log(
    `Runtime smoke passed: ${initial.projects} projects, ${initial.experiences} experience entries, affiliation marquee rightward/reduced-motion-safe, skill icons contained at desktop/mobile, expanded project clear of sticky navbar, Blog shared runtime/i18n/mobile-menu/SEO/theme, theme toggle, zh-Hant translation, no browser errors.`
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
