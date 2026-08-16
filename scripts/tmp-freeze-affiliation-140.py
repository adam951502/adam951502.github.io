from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


# index.html: remove the temporary tuning UI and make marquee logos eager.
index_path = Path("index.html")
html = index_path.read_text()
control = '''        <div class="affiliation-scale-control">\n          <div class="affiliation-scale-control__header">\n            <label class="affiliation-scale-label" for="affiliationScale" data-i18n="hero.aside.scaleLabel">Logo size</label>\n            <output id="affiliationScaleValue" class="affiliation-scale-value" for="affiliationScale">100%</output>\n          </div>\n          <div class="affiliation-scale-control__row">\n            <i class="ri-subtract-line" aria-hidden="true"></i>\n            <input id="affiliationScale" class="affiliation-scale-range" type="range" min="80" max="140" step="5" value="100" data-affiliation-scale aria-describedby="affiliationScaleHint">\n            <i class="ri-add-line" aria-hidden="true"></i>\n            <button type="button" class="affiliation-scale-reset" data-affiliation-scale-reset data-i18n="hero.aside.scaleReset">Reset</button>\n          </div>\n          <p id="affiliationScaleHint" class="affiliation-scale-hint" data-i18n="hero.aside.scaleHint">Saved on this device.</p>\n        </div>\n'''
html = replace_once(html, control, "", "affiliation scale control")

start = html.index('      <div class="affiliation-marquee"')
end = html.index('    </section>', start)
marquee = html[start:end]
if marquee.count('loading="lazy"') != 12:
    raise SystemExit(f"Expected 12 lazy affiliation images, found {marquee.count('loading=\"lazy\"')}")
marquee = marquee.replace('loading="lazy"', 'loading="eager" decoding="async"')
html = html[:start] + marquee + html[end:]
index_path.write_text(html)

# app.js: remove the temporary scale controller entirely.
app_path = Path("assets/js/app.js")
app = app_path.read_text()
app = replace_once(app, 'import { createAffiliationScaleController } from "./affiliation-scale.js";\n', '', 'scale import')
app = replace_once(app,
'''const affiliationScaleRoot = document.querySelector(".signature-strip");\nconst affiliationScaleInput = document.querySelector("[data-affiliation-scale]");\nconst affiliationScaleOutput = document.getElementById("affiliationScaleValue");\nconst affiliationScaleReset = document.querySelector("[data-affiliation-scale-reset]");\n''', '', 'scale DOM bindings')
app = replace_once(app,
'''const affiliationScaleController = createAffiliationScaleController({\n  root: affiliationScaleRoot,\n  input: affiliationScaleInput,\n  output: affiliationScaleOutput,\n  resetButton: affiliationScaleReset\n});\n''', '', 'scale controller')
app = replace_once(app, 'affiliationScaleController.bind();\n', '', 'scale bind')
app = replace_once(app, 'affiliationScaleController.applyInitial();\n', '', 'scale initial apply')
app_path.write_text(app)

# Remove the now-unused controller module.
Path("assets/js/affiliation-scale.js").unlink()

# Remove temporary bilingual tuning labels.
for path, lines in [
    (Path("assets/i18n/en.json"), [
        '  "hero.aside.scaleLabel": "Logo size",\n',
        '  "hero.aside.scaleReset": "Reset",\n',
        '  "hero.aside.scaleHint": "Saved on this device.",\n',
    ]),
    (Path("assets/i18n/zh.json"), [
        '  "hero.aside.scaleLabel": "標誌尺寸",\n',
        '  "hero.aside.scaleReset": "重設",\n',
        '  "hero.aside.scaleHint": "設定會儲存在此裝置。",\n',
    ]),
]:
    text = path.read_text()
    for line in lines:
        if text.count(line) != 1:
            raise SystemExit(f"{path}: expected translation line once: {line.strip()}")
        text = text.replace(line, "", 1)
    path.write_text(text)

# CSS: remove tuning UI and freeze the exact former 140% values.
css_path = Path("assets/css/style.css")
css = css_path.read_text()
control_start = css.index("/* Issue #43: persistent affiliation display tuning */")
marquee_marker = css.index("/* Issue #38: continuous affiliation marquee */", control_start)
css = css[:control_start] + css[marquee_marker:]

replacements = [
    ('animation: affiliation-marquee-right var(--affiliation-duration, 42s) linear infinite;', 'animation: affiliation-marquee-right 58.8s linear infinite;'),
    ('min-width: var(--affiliation-item-min-width, 184px);\n  height: var(--affiliation-item-height, 88px);', 'min-width: 257.6px;\n  height: 123.2px;'),
    ('max-width: var(--affiliation-logo-max-width, 215px);\n  max-height: var(--affiliation-logo-max-height, 48px);', 'max-width: 301px;\n  max-height: 67.2px;'),
    ('min-width: var(--affiliation-relationship-min-width, 292px);', 'min-width: 408.8px;'),
    ('animation-duration: var(--affiliation-duration, 38s);', 'animation-duration: 53.2s;'),
    ('min-width: var(--affiliation-item-min-width, 154px);\n    height: var(--affiliation-item-height, 72px);', 'min-width: 215.6px;\n    height: 100.8px;'),
    ('max-width: var(--affiliation-logo-max-width, 176px);\n    max-height: var(--affiliation-logo-max-height, 38px);', 'max-width: 246.4px;\n    max-height: 53.2px;'),
    ('min-width: var(--affiliation-relationship-min-width, 252px);', 'min-width: 352.8px;'),
]
for old, new in replacements:
    css = replace_once(css, old, new, f"CSS freeze {old[:40]}")
css_path.write_text(css)

# Module architecture validator: return to the pre-slider module set.
validator_path = Path("scripts/validate-js-modules.mjs")
validator = validator_path.read_text()
validator = replace_once(validator, '  "affiliation-scale.js",\n', '', 'validator module')
validator = replace_once(validator, '  "./affiliation-scale.js",\n', '', 'validator import')
validator = replace_once(validator, '  "affiliation-scale.js": ["createAffiliationScaleController", "portfolio.affiliationScale", "localStorage", "matchMedia"],\n', '', 'validator responsibility')
validator_path.write_text(validator)

# Runtime smoke: remove slider persistence test and replace it with fixed 140% + eager-load coverage.
smoke_path = Path("scripts/smoke-runtime.mjs")
smoke = smoke_path.read_text()
block_start = smoke.index('  const affiliationScaleInput = page.locator("[data-affiliation-scale]");')
block_end = smoke.index('  await assertSkillIconsContained("desktop");', block_start)
new_checks = '''  if (await page.locator("[data-affiliation-scale]").count() !== 0) throw new Error("Affiliation scale slider still exists after freezing the design");\n  if (await page.locator("[data-affiliation-scale-reset]").count() !== 0) throw new Error("Affiliation scale reset still exists after freezing the design");\n\n  const affiliationLogos = page.locator(".affiliation-marquee img");\n  if (await affiliationLogos.count() !== 12) throw new Error(`Expected 12 affiliation logo nodes, got ${await affiliationLogos.count()}`);\n  const logoLoadingModes = await affiliationLogos.evaluateAll((images) => images.map((image) => image.getAttribute("loading")));\n  if (logoLoadingModes.some((mode) => mode !== "eager")) throw new Error(`Affiliation logos are not all eager-loaded: ${logoLoadingModes.join(",")}`);\n  await page.waitForFunction(() => Array.from(document.querySelectorAll(".affiliation-marquee img")).every((image) => image.complete && image.naturalWidth > 0));\n\n  const desktopAffiliationMetrics = await page.evaluate(() => {\n    const item = document.querySelector('.affiliation-marquee__group:not([aria-hidden="true"]) .affiliation-item');\n    const image = item?.querySelector("img");\n    const track = document.querySelector(".affiliation-marquee__track");\n    return {\n      itemHeight: item ? Number.parseFloat(getComputedStyle(item).height) : 0,\n      logoMaxHeight: image ? Number.parseFloat(getComputedStyle(image).maxHeight) : 0,\n      duration: track ? Number.parseFloat(getComputedStyle(track).animationDuration) : 0\n    };\n  });\n  if (Math.abs(desktopAffiliationMetrics.itemHeight - 123.2) > 0.6) throw new Error(`Unexpected fixed desktop affiliation height: ${desktopAffiliationMetrics.itemHeight}`);\n  if (Math.abs(desktopAffiliationMetrics.logoMaxHeight - 67.2) > 0.6) throw new Error(`Unexpected fixed desktop logo max-height: ${desktopAffiliationMetrics.logoMaxHeight}`);\n  if (Math.abs(desktopAffiliationMetrics.duration - 58.8) > 0.2) throw new Error(`Unexpected fixed desktop marquee duration: ${desktopAffiliationMetrics.duration}`);\n\n  await page.setViewportSize({ width: 390, height: 844 });\n  const mobileAffiliationMetrics = await page.evaluate(() => {\n    const item = document.querySelector('.affiliation-marquee__group:not([aria-hidden="true"]) .affiliation-item');\n    const image = item?.querySelector("img");\n    const track = document.querySelector(".affiliation-marquee__track");\n    return {\n      itemHeight: item ? Number.parseFloat(getComputedStyle(item).height) : 0,\n      logoMaxHeight: image ? Number.parseFloat(getComputedStyle(image).maxHeight) : 0,\n      duration: track ? Number.parseFloat(getComputedStyle(track).animationDuration) : 0\n    };\n  });\n  if (Math.abs(mobileAffiliationMetrics.itemHeight - 100.8) > 0.6) throw new Error(`Unexpected fixed mobile affiliation height: ${mobileAffiliationMetrics.itemHeight}`);\n  if (Math.abs(mobileAffiliationMetrics.logoMaxHeight - 53.2) > 0.6) throw new Error(`Unexpected fixed mobile logo max-height: ${mobileAffiliationMetrics.logoMaxHeight}`);\n  if (Math.abs(mobileAffiliationMetrics.duration - 53.2) > 0.2) throw new Error(`Unexpected fixed mobile marquee duration: ${mobileAffiliationMetrics.duration}`);\n  await page.setViewportSize({ width: 1440, height: 1000 });\n\n'''
smoke = smoke[:block_start] + new_checks + smoke[block_end:]
smoke_path.write_text(smoke)
