from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


# 1) Add the controller module.
module = '''const DEFAULT_SCALE = 100;
const MIN_SCALE = 80;
const MAX_SCALE = 140;
const STORAGE_KEY = "portfolio.affiliationScale";

const BASE_METRICS = {
  desktop: {
    itemMinWidth: 184,
    itemHeight: 88,
    logoMaxWidth: 215,
    logoMaxHeight: 48,
    relationshipMinWidth: 292,
    duration: 42
  },
  mobile: {
    itemMinWidth: 154,
    itemHeight: 72,
    logoMaxWidth: 176,
    logoMaxHeight: 38,
    relationshipMinWidth: 252,
    duration: 38
  }
};

function normalizeScale(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_SCALE;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(parsed / 5) * 5));
}

function safeRead(storage) {
  try {
    return normalizeScale(storage?.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_SCALE;
  }
}

function safeWrite(storage, value) {
  try {
    storage?.setItem(STORAGE_KEY, String(value));
  } catch {
    // Persistence is optional when storage is blocked.
  }
}

function safeRemove(storage) {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // Persistence is optional when storage is blocked.
  }
}

export function createAffiliationScaleController({
  root,
  input,
  output,
  resetButton,
  storage = window.localStorage,
  mobileQuery = window.matchMedia("(max-width: 720px)")
}) {
  let currentScale = DEFAULT_SCALE;
  let isBound = false;

  function metricsForViewport() {
    return mobileQuery.matches ? BASE_METRICS.mobile : BASE_METRICS.desktop;
  }

  function setMetric(name, value, unit = "px") {
    root?.style.setProperty(name, `${value.toFixed(2)}${unit}`);
  }

  function applyScale(value, { persist = false } = {}) {
    if (!root || !input || !output) return DEFAULT_SCALE;

    currentScale = normalizeScale(value);
    const ratio = currentScale / DEFAULT_SCALE;
    const metrics = metricsForViewport();

    setMetric("--affiliation-item-min-width", metrics.itemMinWidth * ratio);
    setMetric("--affiliation-item-height", metrics.itemHeight * ratio);
    setMetric("--affiliation-logo-max-width", metrics.logoMaxWidth * ratio);
    setMetric("--affiliation-logo-max-height", metrics.logoMaxHeight * ratio);
    setMetric("--affiliation-relationship-min-width", metrics.relationshipMinWidth * ratio);
    setMetric("--affiliation-duration", metrics.duration * ratio, "s");

    input.value = String(currentScale);
    input.setAttribute("aria-valuetext", `${currentScale}%`);
    output.value = `${currentScale}%`;
    output.textContent = `${currentScale}%`;

    if (persist) safeWrite(storage, currentScale);
    return currentScale;
  }

  function applyInitial() {
    return applyScale(safeRead(storage));
  }

  function bind() {
    if (isBound || !root || !input || !output) return;
    isBound = true;

    input.addEventListener("input", () => applyScale(input.value, { persist: true }));
    resetButton?.addEventListener("click", () => {
      safeRemove(storage);
      applyScale(DEFAULT_SCALE);
      input.focus();
    });

    mobileQuery.addEventListener?.("change", () => applyScale(currentScale));
  }

  return {
    applyInitial,
    applyScale,
    bind,
    getCurrentScale: () => currentScale,
    storageKey: STORAGE_KEY
  };
}
'''
Path("assets/js/affiliation-scale.js").write_text(module)

# 2) Insert the control markup.
index_path = Path("index.html")
html = index_path.read_text()
old_signature = '''      <div class="signature-copy">\n        <p class="eyebrow" data-i18n="hero.aside.title">Experience across research &amp; industry</p>\n        <p class="muted" data-i18n="hero.aside.body">Organizations and research ecosystems from my professional journey.</p>\n      </div>'''
new_signature = '''      <div class="signature-copy">\n        <p class="eyebrow" data-i18n="hero.aside.title">Experience across research &amp; industry</p>\n        <p class="muted" data-i18n="hero.aside.body">Organizations and research ecosystems from my professional journey.</p>\n        <div class="affiliation-scale-control">\n          <div class="affiliation-scale-control__header">\n            <label class="affiliation-scale-label" for="affiliationScale" data-i18n="hero.aside.scaleLabel">Logo size</label>\n            <output id="affiliationScaleValue" class="affiliation-scale-value" for="affiliationScale">100%</output>\n          </div>\n          <div class="affiliation-scale-control__row">\n            <i class="ri-subtract-line" aria-hidden="true"></i>\n            <input id="affiliationScale" class="affiliation-scale-range" type="range" min="80" max="140" step="5" value="100" data-affiliation-scale aria-describedby="affiliationScaleHint">\n            <i class="ri-add-line" aria-hidden="true"></i>\n            <button type="button" class="affiliation-scale-reset" data-affiliation-scale-reset data-i18n="hero.aside.scaleReset">Reset</button>\n          </div>\n          <p id="affiliationScaleHint" class="affiliation-scale-hint" data-i18n="hero.aside.scaleHint">Saved on this device.</p>\n        </div>\n      </div>'''
html = replace_once(html, old_signature, new_signature, "signature control markup")
index_path.write_text(html)

# 3) Wire the module into app.js.
app_path = Path("assets/js/app.js")
app = app_path.read_text()
app = replace_once(
    app,
    'import { createCarouselController } from "./carousel.js";\n',
    'import { createAffiliationScaleController } from "./affiliation-scale.js";\nimport { createCarouselController } from "./carousel.js";\n',
    "app import"
)
app = replace_once(
    app,
    'const themeToggleLabel = document.querySelector(".theme-toggle-label");\n',
    'const themeToggleLabel = document.querySelector(".theme-toggle-label");\nconst affiliationScaleRoot = document.querySelector(".signature-strip");\nconst affiliationScaleInput = document.querySelector("[data-affiliation-scale]");\nconst affiliationScaleOutput = document.getElementById("affiliationScaleValue");\nconst affiliationScaleReset = document.querySelector("[data-affiliation-scale-reset]");\n',
    "app DOM bindings"
)
app = replace_once(
    app,
    'const dataStore = createDataStore(dataPaths);\n',
    'const dataStore = createDataStore(dataPaths);\nconst affiliationScaleController = createAffiliationScaleController({\n  root: affiliationScaleRoot,\n  input: affiliationScaleInput,\n  output: affiliationScaleOutput,\n  resetButton: affiliationScaleReset\n});\n',
    "app controller"
)
app = replace_once(
    app,
    'projectsController.bind();\n',
    'affiliationScaleController.bind();\nprojectsController.bind();\n',
    "app bind"
)
app = replace_once(
    app,
    'themeController.applyInitial();\n',
    'affiliationScaleController.applyInitial();\nthemeController.applyInitial();\n',
    "app initial apply"
)
app_path.write_text(app)

# 4) Add bilingual strings without reformatting the JSON files.
for path, body_line, additions in [
    (
        Path("assets/i18n/en.json"),
        '  "hero.aside.body": "Organizations and research ecosystems from my professional journey.",\n',
        '  "hero.aside.body": "Organizations and research ecosystems from my professional journey.",\n'
        '  "hero.aside.scaleLabel": "Logo size",\n'
        '  "hero.aside.scaleReset": "Reset",\n'
        '  "hero.aside.scaleHint": "Saved on this device.",\n'
    ),
    (
        Path("assets/i18n/zh.json"),
        '  "hero.aside.body": "來自職涯、研究與產品實作歷程中的機構與產業生態系。",\n',
        '  "hero.aside.body": "來自職涯、研究與產品實作歷程中的機構與產業生態系。",\n'
        '  "hero.aside.scaleLabel": "標誌尺寸",\n'
        '  "hero.aside.scaleReset": "重設",\n'
        '  "hero.aside.scaleHint": "設定會儲存在此裝置。",\n'
    ),
]:
    text = path.read_text()
    text = replace_once(text, body_line, additions, f"translations {path}")
    path.write_text(text)

# 5) Make marquee dimensions controller-driven and add control styling.
css_path = Path("assets/css/style.css")
css = css_path.read_text()
css = replace_once(
    css,
    'animation: affiliation-marquee-right 42s linear infinite;',
    'animation: affiliation-marquee-right var(--affiliation-duration, 42s) linear infinite;',
    "desktop marquee duration"
)
css = replace_once(
    css,
    '  min-width: 184px;\n  height: 88px;',
    '  min-width: var(--affiliation-item-min-width, 184px);\n  height: var(--affiliation-item-height, 88px);',
    "desktop item metrics"
)
css = replace_once(
    css,
    '  max-width: 215px;\n  max-height: 48px;',
    '  max-width: var(--affiliation-logo-max-width, 215px);\n  max-height: var(--affiliation-logo-max-height, 48px);',
    "desktop logo metrics"
)
css = replace_once(
    css,
    '  min-width: 292px;',
    '  min-width: var(--affiliation-relationship-min-width, 292px);',
    "desktop relationship width"
)
css = replace_once(
    css,
    '    animation-duration: 38s;',
    '    animation-duration: var(--affiliation-duration, 38s);',
    "mobile marquee duration"
)
css = replace_once(
    css,
    '    min-width: 154px;\n    height: 72px;',
    '    min-width: var(--affiliation-item-min-width, 154px);\n    height: var(--affiliation-item-height, 72px);',
    "mobile item metrics"
)
css = replace_once(
    css,
    '    max-width: 176px;\n    max-height: 38px;',
    '    max-width: var(--affiliation-logo-max-width, 176px);\n    max-height: var(--affiliation-logo-max-height, 38px);',
    "mobile logo metrics"
)
css = replace_once(
    css,
    '    min-width: 252px;',
    '    min-width: var(--affiliation-relationship-min-width, 252px);',
    "mobile relationship width"
)

marker = '/* Issue #38: continuous affiliation marquee */\n'
control_css = '''/* Issue #43: persistent affiliation display tuning */
.affiliation-scale-control {
  width: min(100%, 340px);
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 28px rgba(82, 60, 40, 0.05);
}

.affiliation-scale-control__header,
.affiliation-scale-control__row {
  display: flex;
  align-items: center;
}

.affiliation-scale-control__header {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.affiliation-scale-label,
.affiliation-scale-value,
.affiliation-scale-reset,
.affiliation-scale-hint {
  font-family: var(--font-mono);
}

.affiliation-scale-label {
  color: var(--text);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.affiliation-scale-value {
  color: var(--accent);
  font-size: 0.72rem;
  font-weight: 700;
}

.affiliation-scale-control__row {
  gap: 8px;
}

.affiliation-scale-control__row > i {
  flex: 0 0 auto;
  color: var(--muted-soft);
  font-size: 0.9rem;
}

.affiliation-scale-range {
  min-width: 0;
  flex: 1 1 auto;
  accent-color: var(--accent);
  cursor: pointer;
}

.affiliation-scale-reset {
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--panel-strong);
  color: var(--muted);
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.affiliation-scale-reset:hover,
.affiliation-scale-reset:focus-visible {
  color: var(--accent);
  border-color: var(--border-strong);
  transform: translateY(-1px);
}

.affiliation-scale-hint {
  margin: 7px 0 0;
  color: var(--muted-soft);
  font-size: 0.62rem;
  line-height: 1.35;
}

:root[data-theme="dark"] .affiliation-scale-control {
  background: rgba(255, 255, 255, 0.035);
}

'''
css = replace_once(css, marker, control_css + marker, "control CSS marker")
css_path.write_text(css)

# 6) Update module architecture validation.
validator_path = Path("scripts/validate-js-modules.mjs")
validator = validator_path.read_text()
validator = replace_once(
    validator,
    'const expectedModules = [\n  "app.js",',
    'const expectedModules = [\n  "affiliation-scale.js",\n  "app.js",',
    "validator expected module"
)
validator = replace_once(
    validator,
    'const requiredAppImports = [\n  "./carousel.js",',
    'const requiredAppImports = [\n  "./affiliation-scale.js",\n  "./carousel.js",',
    "validator app import"
)
validator = replace_once(
    validator,
    'const responsibilityChecks = {\n  "data.js":',
    'const responsibilityChecks = {\n  "affiliation-scale.js": ["createAffiliationScaleController", "portfolio.affiliationScale", "localStorage", "matchMedia"],\n  "data.js":',
    "validator responsibility"
)
validator_path.write_text(validator)

# 7) Extend browser regression coverage for live scaling + persistence + reset + mobile recalculation.
smoke_path = Path("scripts/smoke-runtime.mjs")
smoke = smoke_path.read_text()
marker = '  await page.emulateMedia({ reducedMotion: "no-preference" });\n\n  await assertSkillIconsContained("desktop");\n'
addition = '''  await page.emulateMedia({ reducedMotion: "no-preference" });

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
'''
smoke = replace_once(smoke, marker, addition, "smoke insertion")
smoke_path.write_text(smoke)
