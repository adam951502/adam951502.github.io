from pathlib import Path
import json

ROOT = Path('.')

# --- index.html: mobile language pill + trust strip + journey ---
index = ROOT / 'index.html'
text = index.read_text()

header_end = '  </header>\n\n  <main class="page">'
mobile_pill = '''  </header>\n\n  <div class="mobile-lang-pill" role="group" aria-label="Language quick switch">\n    <button class="lang-quick-option active" type="button" data-lang="en" aria-pressed="true">EN</button>\n    <span aria-hidden="true">/</span>\n    <button class="lang-quick-option" type="button" data-lang="zh" aria-pressed="false">繁中</button>\n  </div>\n\n  <main class="page">'''
if 'class="mobile-lang-pill"' not in text:
    if header_end not in text:
        raise SystemExit('header insertion marker not found')
    text = text.replace(header_end, mobile_pill, 1)

hero_to_signature = '    </section>\n\n    <section class="section signature-strip reveal" aria-label="Experience across research and industry">'
trust_journey = '''    </section>\n\n    <section class="section recruiter-overview reveal" aria-label="Professional overview">\n      <div class="trust-strip" role="list" aria-label="Professional trust signals">\n        <article class="trust-item" role="listitem">\n          <i class="ri-time-line" aria-hidden="true"></i>\n          <div><strong data-i18n="trust.years.title">5+ years</strong><span data-i18n="trust.years.body">industry engineering experience</span></div>\n        </article>\n        <article class="trust-item" role="listitem">\n          <i class="ri-building-4-line" aria-hidden="true"></i>\n          <div><strong data-i18n="trust.fraunhofer.title">Fraunhofer EMI</strong><span data-i18n="trust.fraunhofer.body">applied research in Europe's Fraunhofer network</span></div>\n        </article>\n        <article class="trust-item" role="listitem">\n          <i class="ri-code-s-slash-line" aria-hidden="true"></i>\n          <div><strong data-i18n="trust.freelance.title">Freelance AI &amp; Software Engineer</strong><span data-i18n="trust.freelance.body">client systems + independent products</span></div>\n        </article>\n        <article class="trust-item" role="listitem">\n          <i class="ri-global-line" aria-hidden="true"></i>\n          <div><strong data-i18n="trust.global.title">Taiwan / Europe</strong><span data-i18n="trust.global.body">cross-cultural, global engineering experience</span></div>\n        </article>\n        <article class="trust-item trust-item--accent" role="listitem">\n          <i class="ri-shake-hands-line" aria-hidden="true"></i>\n          <div><strong data-i18n="trust.available.title">Available to collaborate</strong><span data-i18n="trust.available.body">projects, product builds &amp; tech advising</span></div>\n        </article>\n      </div>\n\n      <div class="journey-shell card-surface">\n        <div class="journey-heading">\n          <div>\n            <p class="eyebrow" data-i18n="journey.eyebrow">My journey</p>\n            <h2 data-i18n="journey.title">From engineering fundamentals to applied AI products.</h2>\n          </div>\n          <p class="muted" data-i18n="journey.body">A quick map first. Open the sections below only when you want the details.</p>\n        </div>\n        <ol class="journey-track">\n          <li class="journey-step">\n            <span class="journey-icon"><i class="ri-tools-line" aria-hidden="true"></i></span>\n            <span class="journey-year">01</span>\n            <strong data-i18n="journey.step1.title">Mechanical Engineering</strong>\n            <span data-i18n="journey.step1.body">systems, controls &amp; numerical thinking</span>\n          </li>\n          <li class="journey-step">\n            <span class="journey-icon"><i class="ri-leaf-line" aria-hidden="true"></i></span>\n            <span class="journey-year">02</span>\n            <strong data-i18n="journey.step2.title">Sustainable Systems</strong>\n            <span data-i18n="journey.step2.body">research, modeling &amp; data analysis</span>\n          </li>\n          <li class="journey-step">\n            <span class="journey-icon"><i class="ri-building-line" aria-hidden="true"></i></span>\n            <span class="journey-year">03</span>\n            <strong data-i18n="journey.step3.title">Fraunhofer EMI</strong>\n            <span data-i18n="journey.step3.body">applied software, data &amp; AI engineering</span>\n          </li>\n          <li class="journey-step">\n            <span class="journey-icon"><i class="ri-node-tree" aria-hidden="true"></i></span>\n            <span class="journey-year">04</span>\n            <strong data-i18n="journey.step4.title">Graphs → RAG → Agents</strong>\n            <span data-i18n="journey.step4.body">knowledge systems evolved into GenAI workflows</span>\n          </li>\n          <li class="journey-step journey-step--current">\n            <span class="journey-icon"><i class="ri-rocket-2-line" aria-hidden="true"></i></span>\n            <span class="journey-year">05</span>\n            <strong data-i18n="journey.step5.title">Taiwan · Build &amp; Advise</strong>\n            <span data-i18n="journey.step5.body">freelance delivery, products &amp; applied R&amp;D</span>\n          </li>\n        </ol>\n      </div>\n    </section>\n\n    <section class="section signature-strip reveal" aria-label="Experience across research and industry">'''
if 'class="section recruiter-overview reveal"' not in text:
    if hero_to_signature not in text:
        raise SystemExit('hero/signature insertion marker not found')
    text = text.replace(hero_to_signature, trust_journey, 1)
index.write_text(text)

# --- Experience: details hidden by default ---
exp_path = ROOT / 'assets/data/experience.json'
experience = json.loads(exp_path.read_text())
for item in experience:
    item['open'] = False
    item['inlineOpen'] = False
exp_path.write_text(json.dumps(experience, ensure_ascii=False, indent=2) + '\n')

# --- translations ---
translations = {
'en': {
    'trust.years.title': '5+ years',
    'trust.years.body': 'industry engineering experience',
    'trust.fraunhofer.title': 'Fraunhofer EMI',
    'trust.fraunhofer.body': "applied research in Europe's Fraunhofer network",
    'trust.freelance.title': 'Freelance AI & Software Engineer',
    'trust.freelance.body': 'client systems + independent products',
    'trust.global.title': 'Taiwan / Europe',
    'trust.global.body': 'cross-cultural, global engineering experience',
    'trust.available.title': 'Available to collaborate',
    'trust.available.body': 'projects, product builds & tech advising',
    'journey.eyebrow': 'My journey',
    'journey.title': 'From engineering fundamentals to applied AI products.',
    'journey.body': 'A quick map first. Open the sections below only when you want the details.',
    'journey.step1.title': 'Mechanical Engineering',
    'journey.step1.body': 'systems, controls & numerical thinking',
    'journey.step2.title': 'Sustainable Systems',
    'journey.step2.body': 'research, modeling & data analysis',
    'journey.step3.title': 'Fraunhofer EMI',
    'journey.step3.body': 'applied software, data & AI engineering',
    'journey.step4.title': 'Graphs → RAG → Agents',
    'journey.step4.body': 'knowledge systems evolved into GenAI workflows',
    'journey.step5.title': 'Taiwan · Build & Advise',
    'journey.step5.body': 'freelance delivery, products & applied R&D'
},
'zh': {
    'trust.years.title': '5+ 年',
    'trust.years.body': '產業工程實務經驗',
    'trust.fraunhofer.title': 'Fraunhofer EMI',
    'trust.fraunhofer.body': '歐洲 Fraunhofer 應用研究體系經歷',
    'trust.freelance.title': '自由接案 AI 與軟體工程師',
    'trust.freelance.body': '客戶系統 + 獨立產品開發',
    'trust.global.title': '台灣 / 歐洲',
    'trust.global.body': '跨文化、全球工程合作經驗',
    'trust.available.title': '開放合作',
    'trust.available.body': '專案、產品開發與技術顧問',
    'journey.eyebrow': '我的旅程',
    'journey.title': '從工程基礎，一路走到應用 AI 產品。',
    'journey.body': '先快速看懂我的路徑；想深入時，再展開下方細節。',
    'journey.step1.title': '機械工程',
    'journey.step1.body': '系統、控制與數值思維',
    'journey.step2.title': '永續系統',
    'journey.step2.body': '研究、建模與資料分析',
    'journey.step3.title': 'Fraunhofer EMI',
    'journey.step3.body': '應用軟體、資料與 AI 工程',
    'journey.step4.title': 'Graph → RAG → Agents',
    'journey.step4.body': '從知識系統演進到 GenAI workflow',
    'journey.step5.title': '台灣 · 開發與顧問',
    'journey.step5.body': '自由接案、產品開發與應用研發'
}}
for lang, additions in translations.items():
    p = ROOT / f'assets/i18n/{lang}.json'
    data = json.loads(p.read_text())
    data.update(additions)
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

# --- i18n controller: support fixed quick language pill ---
i18n_path = ROOT / 'assets/js/i18n.js'
i18n = i18n_path.read_text()
i18n = i18n.replace(
'  const languageOptions = Array.from(document.querySelectorAll(".lang-option"));\n  const languageLabel = document.querySelector(".lang-label");',
'  const languageOptions = Array.from(document.querySelectorAll(".lang-option"));\n  const quickLanguageOptions = Array.from(document.querySelectorAll(".lang-quick-option"));\n  const languageLabel = document.querySelector(".lang-label");'
)
i18n = i18n.replace(
'    setLanguageLabel(lang, translateFn);\n  }',
'''    quickLanguageOptions.forEach((option) => {\n      const isActive = option.dataset.lang === lang;\n      option.classList.toggle("active", isActive);\n      option.setAttribute("aria-pressed", String(isActive));\n    });\n    setLanguageLabel(lang, translateFn);\n  }''', 1
)
needle = '''    languageOptions.forEach((button) => {\n      button.addEventListener("click", async () => {\n        await applyTranslations(button.dataset.lang || fallbackLang);\n        closeMenu();\n      });\n    });'''
replacement = needle + '''\n\n    quickLanguageOptions.forEach((button) => {\n      button.addEventListener("click", async () => {\n        await applyTranslations(button.dataset.lang || fallbackLang);\n        closeMenu();\n      });\n    });'''
if 'quickLanguageOptions.forEach((button)' not in i18n:
    if needle not in i18n:
        raise SystemExit('i18n bind marker not found')
    i18n = i18n.replace(needle, replacement, 1)
i18n_path.write_text(i18n)

# --- CSS: append scoped UX styles ---
css_path = ROOT / 'assets/css/style.css'
css = css_path.read_text()
marker = '/* Recruiter-first UX: issue #57 */'
if marker not in css:
    css += '''\n\n/* Recruiter-first UX: issue #57 */\n.mobile-lang-pill { display: none; }\n.recruiter-overview { padding-top: 0.5rem; }\n.trust-strip { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.75rem; margin: 0 0 1.25rem; }\n.trust-item { min-width: 0; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 0.65rem; align-items: start; padding: 0.9rem 0.95rem; border: 1px solid var(--line); border-radius: 16px; background: color-mix(in srgb, var(--surface) 88%, transparent); }\n.trust-item > i { font-size: 1.1rem; margin-top: 0.08rem; color: var(--accent); }\n.trust-item strong, .trust-item span { display: block; }\n.trust-item strong { font-size: 0.82rem; line-height: 1.25; }\n.trust-item span { margin-top: 0.22rem; color: var(--muted); font-size: 0.72rem; line-height: 1.4; }\n.trust-item--accent { border-color: color-mix(in srgb, var(--accent) 35%, var(--line)); }\n.journey-shell { padding: clamp(1rem, 2.2vw, 1.6rem); overflow: hidden; }\n.journey-heading { display: grid; grid-template-columns: minmax(0, 1fr) minmax(240px, 0.65fr); gap: 1.5rem; align-items: end; margin-bottom: 1.4rem; }\n.journey-heading h2 { margin: 0.25rem 0 0; font-size: clamp(1.45rem, 2.8vw, 2.25rem); }\n.journey-heading > .muted { margin: 0; max-width: 42ch; justify-self: end; }\n.journey-track { position: relative; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0; list-style: none; padding: 0; margin: 0; }\n.journey-track::before { content: ''; position: absolute; left: 8%; right: 8%; top: 1.35rem; height: 1px; background: var(--line); }\n.journey-step { position: relative; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.28rem; padding: 0 0.55rem; }\n.journey-icon { position: relative; z-index: 1; width: 2.7rem; height: 2.7rem; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 50%; background: var(--surface); box-shadow: 0 0 0 6px var(--surface); }\n.journey-icon i { font-size: 1.15rem; color: var(--accent); }\n.journey-year { margin-top: 0.4rem; font: 500 0.66rem/1 'IBM Plex Mono', monospace; color: var(--muted); }\n.journey-step strong { font-size: 0.82rem; line-height: 1.25; }\n.journey-step > span:last-child { max-width: 20ch; font-size: 0.7rem; line-height: 1.38; color: var(--muted); }\n.journey-step--current .journey-icon { border-color: color-mix(in srgb, var(--accent) 55%, var(--line)); }\n\n@media (max-width: 1050px) {\n  .trust-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .trust-item--accent { grid-column: 1 / -1; }\n  .journey-heading { grid-template-columns: 1fr; gap: 0.55rem; }\n  .journey-heading > .muted { justify-self: start; }\n}\n\n@media (max-width: 760px) {\n  .language-dropdown { display: none !important; }\n  .mobile-lang-pill { position: fixed; z-index: 1200; top: 0.72rem; right: 4.7rem; display: flex; align-items: center; gap: 0.2rem; padding: 0.32rem 0.42rem; border: 1px solid var(--line); border-radius: 999px; background: color-mix(in srgb, var(--surface) 94%, transparent); box-shadow: 0 8px 24px rgba(0,0,0,0.08); backdrop-filter: blur(12px); }\n  .mobile-lang-pill > span { color: var(--muted); font-size: 0.7rem; }\n  .lang-quick-option { min-width: 2.1rem; min-height: 2rem; padding: 0.25rem 0.42rem; border: 0; border-radius: 999px; background: transparent; color: var(--muted); font: 700 0.72rem/1 Manrope, sans-serif; cursor: pointer; }\n  .lang-quick-option.active { background: var(--text); color: var(--surface); }\n  .recruiter-overview { padding-top: 0.2rem; }\n  .trust-strip { display: flex; gap: 0.6rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 0.35rem; margin-right: calc(var(--page-pad) * -1); padding-right: var(--page-pad); scrollbar-width: none; }\n  .trust-strip::-webkit-scrollbar { display: none; }\n  .trust-item, .trust-item--accent { flex: 0 0 min(76vw, 270px); grid-column: auto; scroll-snap-align: start; }\n  .journey-shell { padding: 1rem; }\n  .journey-heading { margin-bottom: 1rem; }\n  .journey-heading h2 { font-size: 1.4rem; }\n  .journey-track { grid-template-columns: 1fr; gap: 0; padding-left: 0.2rem; }\n  .journey-track::before { left: 1.32rem; right: auto; top: 1.35rem; bottom: 1.35rem; width: 1px; height: auto; }\n  .journey-step { display: grid; grid-template-columns: 2.7rem 2rem minmax(0, 1fr); grid-template-rows: auto auto; column-gap: 0.65rem; row-gap: 0.15rem; align-items: center; text-align: left; padding: 0 0 0.9rem; }\n  .journey-icon { grid-column: 1; grid-row: 1 / 3; box-shadow: 0 0 0 5px var(--surface); }\n  .journey-year { grid-column: 2; grid-row: 1 / 3; margin: 0; }\n  .journey-step strong { grid-column: 3; grid-row: 1; }\n  .journey-step > span:last-child { grid-column: 3; grid-row: 2; max-width: none; }\n}\n\n@media (max-width: 390px) {\n  .mobile-lang-pill { right: 4.35rem; }\n  .lang-quick-option { min-width: 1.85rem; padding-inline: 0.32rem; }\n}\n'''
    css_path.write_text(css)

# --- smoke regression ---
smoke_path = ROOT / 'scripts/smoke-runtime.mjs'
smoke = smoke_path.read_text()
anchor = '  if (experienceSpan.display === "none") throw new Error("Experience career span is hidden on desktop");'
checks = '''\n\n  const recruiterOverview = await page.evaluate(() => ({\n    trustItems: document.querySelectorAll(".trust-strip .trust-item").length,\n    journeySteps: document.querySelectorAll(".journey-track .journey-step").length,\n    journeyTitle: document.querySelector(".journey-heading h2")?.textContent?.trim() || "",\n    openExperience: document.querySelectorAll("#experienceList .experience-card[open]").length\n  }));\n  if (recruiterOverview.trustItems !== 5) throw new Error(`Expected 5 recruiter trust signals, got ${recruiterOverview.trustItems}`);\n  if (recruiterOverview.journeySteps !== 5) throw new Error(`Expected 5 journey steps, got ${recruiterOverview.journeySteps}`);\n  if (!recruiterOverview.journeyTitle.includes("engineering fundamentals")) throw new Error(`Unexpected journey title: ${recruiterOverview.journeyTitle}`);\n  if (recruiterOverview.openExperience !== 0) throw new Error(`Experience should be collapsed by default, found ${recruiterOverview.openExperience} open cards`);'''
if 'const recruiterOverview = await page.evaluate' not in smoke:
    if anchor not in smoke:
        raise SystemExit('smoke desktop anchor not found')
    smoke = smoke.replace(anchor, anchor + checks, 1)

mobile_anchor = '  if (mobileExperienceSpan.right > mobileExperienceSpan.viewport + 1) throw new Error("Experience career span escapes the mobile viewport");'
mobile_checks = '''\n\n  const mobileQuickLang = await page.evaluate(() => {\n    const pill = document.querySelector(".mobile-lang-pill");\n    const buttons = Array.from(document.querySelectorAll(".lang-quick-option"));\n    const rect = pill?.getBoundingClientRect();\n    return { display: pill ? getComputedStyle(pill).display : "none", count: buttons.length, right: rect?.right || 0, top: rect?.top || 0, viewport: window.innerWidth };\n  });\n  if (mobileQuickLang.display === "none" || mobileQuickLang.count !== 2) throw new Error("Fixed mobile language pill is missing");\n  if (mobileQuickLang.right > mobileQuickLang.viewport + 1 || mobileQuickLang.top < 0) throw new Error("Mobile language pill escapes viewport");\n  await page.click('.lang-quick-option[data-lang="zh"]');\n  await page.waitForFunction(() => document.documentElement.lang === "zh-Hant");\n  const quickZhJourney = await page.locator('.journey-heading [data-i18n="journey.eyebrow"]').textContent();\n  if (quickZhJourney?.trim() !== "我的旅程") throw new Error(`Mobile quick language switch did not translate journey: ${quickZhJourney}`);\n  await page.click('.lang-quick-option[data-lang="en"]');\n  await page.waitForFunction(() => document.documentElement.lang === "en");'''
if 'const mobileQuickLang = await page.evaluate' not in smoke:
    if mobile_anchor not in smoke:
        raise SystemExit('smoke mobile anchor not found')
    smoke = smoke.replace(mobile_anchor, mobile_anchor + mobile_checks, 1)
smoke_path.write_text(smoke)
