from pathlib import Path
import json

ROOT = Path('.')


def load_json(path):
    return json.loads(Path(path).read_text())


def write_json(path, data):
    Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, found {count}')
    return text.replace(old, new, 1)


# 1) Add the verified Taiwan freelance / independent period as the newest experience.
experience_path = Path('assets/data/experience.json')
experience = load_json(experience_path)
experience = [item for item in experience if item.get('id') != 'freelance-taiwan']
experience.insert(0, {
    'id': 'freelance-taiwan',
    'datesKey': 'experience.freelanceTaiwan.dates',
    'titleKey': 'experience.freelanceTaiwan.title',
    'pillKey': 'experience.pills.freelance',
    'pillIcon': 'ri-code-s-slash-line',
    'descKey': 'experience.freelanceTaiwan.desc',
    'listKey': 'experience.freelanceTaiwan.list',
    'open': True,
    'inlineOpen': True
})
write_json(experience_path, experience)

# 2) Bilingual experience copy, project labels, and current skill framing.
i18n_updates = {
    'en': {
        'experience.lede': 'A timeline of roles, client work, and products; open any entry for the systems, ownership, and outcomes behind it.',
        'experience.pills.freelance': 'Freelance / Independent',
        'experience.freelanceTaiwan.dates': 'Nov 2025 - Present | Taipei, Taiwan',
        'experience.freelanceTaiwan.title': 'Independent AI & Software Engineer — Freelance / Project-based',
        'experience.freelanceTaiwan.desc': 'Taiwan-based freelance and independent engineering practice delivering client-requested AI/software systems while building products and R&D tools across GenAI, computer vision, full-stack platforms, quantitative research, and data automation.',
        'experience.freelanceTaiwan.list': '<li>Client-requested systems: Production Planning Copilot; 888 Card Market Platform; Multi-box UDI Data Matrix Decoder; UDI Shipping Assistance System; and the ongoing T93.Lab Collection & Market Platform.</li><li>Independent products & R&D: T93.Lab Portfolio Analytics Workspace, quan — Taiwan Quant Research Toolkit, and PSA / SNKRDUNK card-price automation with Telegram workflows.</li><li>Owned solution architecture through delivery across agentic RAG, Python/FastAPI services, Vue/Node full-stack apps, OpenCV/GS1 workflows, Supabase/Postgres, Cloudflare/Docker, market-data APIs, and automated testing.</li><li>Turned ambiguous operational needs into testable workflows with authentication, auditability, fallbacks, caching, and CI/CD rather than one-off prototypes.</li>',
        'projects.snkr.title': 'PSA / SNKRDUNK Card Price Automation',
        'projects.snkr.desc': 'Multi-route card identification and live PSA10 pricing workflow with Telegram UX, verified mappings, caching, and resilient fallbacks.',
        'projects.snkr.dates': 'Jul 2026 - Present',
        'skills.ai.note': 'Agentic RAG, graph/vector retrieval, local models, and grounded AI systems.',
        'skills.ai.count': '16 capabilities',
        'skills.frameworks.note': 'APIs, full-stack apps, CV/GS1 workflows, market data, and deployable cloud runtimes.',
        'skills.frameworks.count': '26 capabilities',
        'skills.languages.note': 'Client discovery, solution architecture, ownership, and repeatable delivery.',
        'skills.languages.count': '11 capabilities',
        'skills.item.solutionArchitecture': 'Solution architecture',
        'skills.item.clientDelivery': 'Client delivery'
    },
    'zh': {
        'experience.lede': '以時間軸呈現職涯、客戶專案與產品；展開任一經歷即可查看系統、負責範圍與成果。',
        'experience.pills.freelance': '自由接案 / 獨立開發',
        'experience.freelanceTaiwan.dates': '2025 年 11 月 - 目前 | 台北，台灣',
        'experience.freelanceTaiwan.title': '獨立 AI 與軟體工程師 — 自由接案 / 專案制',
        'experience.freelanceTaiwan.desc': '以台灣為基地進行自由接案與獨立工程實作，交付客戶需求的 AI／軟體系統，同時打造涵蓋生成式 AI、電腦視覺、全端平台、量化研究與資料自動化的產品與研發工具。',
        'experience.freelanceTaiwan.list': '<li>客戶需求專案：生產規劃 Copilot、888 卡牌市集平台、多箱 UDI Data Matrix 解碼器、UDI 出貨輔助系統，以及持續進行中的 T93.Lab 收藏與市場平台。</li><li>獨立產品與研發：T93.Lab 投資組合分析工作區、quan 台灣量化研究工具組，以及整合 Telegram 工作流程的 PSA／SNKRDUNK 卡牌價格自動化。</li><li>從方案架構一路負責到交付，涵蓋 Agentic RAG、Python／FastAPI 服務、Vue／Node 全端應用、OpenCV／GS1 工作流程、Supabase／Postgres、Cloudflare／Docker、市場資料 API 與自動化測試。</li><li>將模糊的營運需求轉成可測試的工作流程，納入身分驗證、可稽核性、備援、快取與 CI/CD，而非只做一次性的展示原型。</li>',
        'projects.snkr.title': 'PSA / SNKRDUNK 卡牌價格自動化',
        'projects.snkr.desc': '多路徑卡牌識別與即時 PSA10 價格流程，整合 Telegram 體驗、已驗證對應、快取與韌性備援。',
        'projects.snkr.dates': '2026 年 7 月 - 目前',
        'skills.ai.note': 'Agentic RAG、圖譜／向量檢索、本地模型與具依據的 AI 系統。',
        'skills.ai.count': '16 項能力',
        'skills.frameworks.note': 'API、全端應用、CV／GS1 流程、市場資料與可部署雲端執行環境。',
        'skills.frameworks.count': '26 項能力',
        'skills.languages.note': '從客戶需求探索、方案架構與產品負責，到可重複的交付流程。',
        'skills.languages.count': '11 項能力',
        'skills.item.solutionArchitecture': '方案架構',
        'skills.item.clientDelivery': '客戶交付'
    }
}

for lang, updates in i18n_updates.items():
    path = Path(f'assets/i18n/{lang}.json')
    data = load_json(path)
    # Remove the retired X Media Downloader from the global website vocabulary.
    for key in list(data):
        if key.startswith('projects.xDownloader.'):
            data.pop(key)
    data.update(updates)
    write_json(path, data)

# 3) Remove X Media Downloader from canonical projects and add SNKR / PSA automation.
projects_index_path = Path('assets/data/projects.json')
projects_index = load_json(projects_index_path)
files = [p for p in projects_index['projectFiles'] if p != 'projects/x-media-downloader.json']
snkr_path = 'projects/snkr-psa-automation.json'
if snkr_path not in files:
    insert_after = 'projects/quan.json'
    if insert_after in files:
        files.insert(files.index(insert_after) + 1, snkr_path)
    else:
        files.insert(0, snkr_path)
projects_index['projectFiles'] = files
write_json(projects_index_path, projects_index)

# Retire the project source and its project-specific image asset.
for retired in [
    Path('assets/data/projects/x-media-downloader.json'),
    Path('assets/images/project-x-downloader.webp')
]:
    if retired.exists():
        retired.unlink()

# 4) Add the missing recent SNKR / PSA project as a canonical bilingual case study.
snkr_project = {
    '$schema': './project.schema.json',
    'id': 'snkr-psa-automation',
    'category': 'data',
    'sortStart': '2026-07',
    'sortEnd': '9999-12',
    'sortUpdated': '2026-08-16',
    'pillKey': 'projects.pills.data',
    'icon': 'ri-price-tag-3-line',
    # Reuse the T93 ecosystem visual until a dedicated public-safe screenshot is selected.
    'image': 'assets/images/project-t93-lab.png',
    'imageFit': 'cover',
    'chips': ['Python', 'Telegram Bot', 'SNKRDUNK APIs', 'Playwright', 'RapidFuzz', 'BeautifulSoup'],
    'content': {
        'en': {
            'title': 'PSA / SNKRDUNK Card Price Automation',
            'summary': 'Multi-route card identification and live PSA10 pricing workflow with Telegram UX, verified mappings, caching, and resilient fallbacks.',
            'dates': 'Jul 2026 - Present',
            'status': 'Active automation',
            'role': 'Data automation & integration engineer',
            'challenge': 'PSA API quotas and browser security checks make certificate lookup unreliable, while code-only marketplace search can produce ambiguous card matches. The workflow needed safer identification routes without pretending blocked data sources were dependable.',
            'contribution': [
                'Designed a route hierarchy that prioritizes direct SNKRDUNK IDs, verified mappings, and exact series/card-code matches before falling back to PSA metadata or browser-assisted lookup.',
                'Built a Telegram-first workflow that returns card identity, images, grading-condition prices, market context, and multilingual responses for daily collection use.',
                'Added mapping and history caches, batch summaries, CSV/JSON outputs, diagnostics, and explicit low-confidence or security-check states instead of silently accepting weak matches.'
            ],
            'technical': [
                'Python services use httpx/requests, BeautifulSoup, RapidFuzz, structured mappings, and SNKRDUNK product/condition endpoints for matching and live pricing.',
                'Playwright is retained as a user-controlled browser fallback for public PSA certificate pages; the workflow detects Cloudflare/security pages and does not treat them as certificate data.',
                'Telegram commands, route caches, batch processing, environment-based configuration, and deployment profiles turn the research script into a reusable operational tool.'
            ],
            'architecture': [
                {'label': 'Input', 'detail': 'Series/card code, SNKRDUNK URL/ID, PSA certificate number, or Telegram command enters the router.'},
                {'label': 'Resolve', 'detail': 'Verified mappings and exact code matching resolve the canonical SNKRDUNK card; PSA metadata is a fallback rather than the default dependency.'},
                {'label': 'Price & enrich', 'detail': 'SNKRDUNK endpoints return card metadata, thumbnails, condition prices, and current PSA10 market data.'},
                {'label': 'Deliver & cache', 'detail': 'Telegram/CLI output, CSV/JSON summaries, route caches, and diagnostics provide a repeatable user workflow.'}
            ],
            'outcomes': [
                'Reduced dependence on fragile PSA lookups by making series/card-code and verified mapping routes first-class inputs.',
                'Separates canonical card mapping from live price retrieval so cached identity does not become stale market pricing.',
                'Turns failures into explicit review states and diagnostics, improving trust when external sites rate-limit or challenge automated requests.'
            ]
        },
        'zh': {
            'title': 'PSA / SNKRDUNK 卡牌價格自動化',
            'summary': '多路徑卡牌識別與即時 PSA10 價格流程，整合 Telegram 體驗、已驗證對應、快取與韌性備援。',
            'dates': '2026 年 7 月 - 目前',
            'status': '持續開發的自動化工具',
            'role': '資料自動化與系統整合工程師',
            'challenge': 'PSA API 配額與瀏覽器安全驗證使證書查詢不穩定，而只用卡號在市場搜尋也可能產生模糊配對。系統需要更安全的識別路徑，而不能假設受阻的資料來源永遠可靠。',
            'contribution': [
                '設計路由優先序，先使用 SNKRDUNK ID、已驗證對應與精確系列／卡號配對，再視需要退回 PSA metadata 或瀏覽器輔助查詢。',
                '建立以 Telegram 為主要入口的工作流程，回傳卡片身分、圖片、不同鑑定條件價格、市場資訊與多語回覆，支援日常收藏使用。',
                '加入對應與歷史快取、批次摘要、CSV／JSON 輸出、診斷工具，以及明確的低信心或安全驗證狀態，避免默默接受錯誤配對。'
            ],
            'technical': [
                'Python 服務使用 httpx／requests、BeautifulSoup、RapidFuzz、結構化 mapping 與 SNKRDUNK 商品／條件端點進行卡牌配對與即時價格取得。',
                '保留 Playwright 作為使用者可控制的 PSA 公開證書頁瀏覽器備援；流程會辨識 Cloudflare／安全驗證頁，且不會把它當成證書資料。',
                'Telegram 指令、路由快取、批次處理、環境變數設定與部署 profile，將研究腳本轉成可重複使用的作業工具。'
            ],
            'architecture': [
                {'label': '輸入', 'detail': '系列／卡號、SNKRDUNK URL／ID、PSA 證書號碼或 Telegram 指令進入路由層。'},
                {'label': '識別', 'detail': '已驗證 mapping 與精確卡號比對解析 canonical SNKRDUNK 卡片；PSA metadata 作為備援而非主要依賴。'},
                {'label': '價格與補充', 'detail': 'SNKRDUNK 端點回傳卡片 metadata、縮圖、不同條件價格與即時 PSA10 市場資料。'},
                {'label': '交付與快取', 'detail': 'Telegram／CLI 回覆、CSV／JSON 摘要、路由快取與診斷資訊形成可重複的使用流程。'}
            ],
            'outcomes': [
                '將系列／卡號與已驗證 mapping 提升為主要輸入，降低對不穩定 PSA 查詢的依賴。',
                '把 canonical 卡片對應與即時價格取得分離，避免身分快取變成過期的市場價格。',
                '把外部網站限流或安全驗證轉成明確覆核狀態與診斷資訊，提高整體可信度。'
            ]
        }
    }
}
write_json('assets/data/projects/snkr-psa-automation.json', snkr_project)

# 5) Mark only user-confirmed customer-requested projects as client work and strengthen verified tech chips.
project_updates = {
    'assets/data/projects/production-copilot.json': {
        'chips': ['FastAPI', 'Agentic RAG', 'Postgres', 'Neo4j', 'Chroma', 'Ollama', 'Chainlit', 'Docker'],
        'en_status': 'Client AI demonstrator',
        'zh_status': '客戶 AI 展示系統'
    },
    'assets/data/projects/market-888.json': {
        'chips': ['Vue 3', 'Express', 'MySQL', 'JWT', 'PDFKit', 'Docker'],
        'en_status': 'Client full-stack system',
        'zh_status': '客戶全端系統'
    },
    'assets/data/projects/udi-decoder.json': {
        'chips': ['Python', 'OpenCV', 'ZXing', 'pylibdmtx', 'GS1 UDI', 'Benchmarking'],
        'en_status': 'Client computer-vision POC',
        'zh_status': '客戶電腦視覺 POC'
    },
    'assets/data/projects/shipping-assistant.json': {
        'chips': ['FastAPI', 'SQLite', 'GS1 UDI', 'Excel', 'Docker', 'Integration Tests'],
        'en_status': 'Client operational system',
        'zh_status': '客戶作業系統'
    },
    'assets/data/projects/t93-lab.json': {
        'chips': ['Python', 'Jinja2', 'Notion API', 'Supabase', 'Cloudflare', 'GitHub Actions'],
        'en_status': 'Ongoing client product',
        'zh_status': '持續進行中的客戶產品'
    }
}
for path_str, update in project_updates.items():
    path = Path(path_str)
    data = load_json(path)
    data['chips'] = update['chips']
    data['content']['en']['status'] = update['en_status']
    data['content']['zh']['status'] = update['zh_status']
    write_json(path, data)

# 6) Refresh Skills to mirror the technologies now demonstrated by recent projects.
index_path = Path('index.html')
html = index_path.read_text()

html = replace_once(
    html,
    '<div class="skill-preview" aria-hidden="true"><span>RAG</span><span>GraphDB</span><span>SPARQL</span></div>',
    '<div class="skill-preview" aria-hidden="true"><span>Agents</span><span>RAG / GraphRAG</span><span>Neo4j / GraphDB</span></div>',
    'AI skill preview'
)
html = replace_once(
    html,
    '<span class="chip chip-icon"><i class="ri-node-tree" aria-hidden="true"></i><span>GraphDB</span></span>\n                  <span class="chip chip-icon"><i class="ri-brain-line" aria-hidden="true"></i><span data-i18n="skills.preview.ontology">Ontology</span></span>',
    '<span class="chip chip-icon"><i class="ri-node-tree" aria-hidden="true"></i><span>GraphDB</span></span>\n                  <span class="chip chip-icon"><i class="ri-share-forward-line" aria-hidden="true"></i><span>Neo4j</span></span>\n                  <span class="chip chip-icon"><i class="ri-brain-line" aria-hidden="true"></i><span data-i18n="skills.preview.ontology">Ontology</span></span>',
    'Neo4j skill'
)
html = replace_once(
    html,
    '<span class="chip chip-icon"><i class="ri-cpu-line" aria-hidden="true"></i><span>Ollama</span></span>\n                  <span class="chip chip-icon"><i class="ri-node-tree" aria-hidden="true"></i><span>GraphRAG</span></span>\n                  <span class="chip chip-icon"><i class="ri-terminal-line" aria-hidden="true"></i><span>Prompt Ops</span></span>\n                  <span class="chip chip-icon"><i class="ri-checkbox-circle-line" aria-hidden="true"></i><span data-i18n="skills.preview.evaluation">Evaluation</span></span>',
    '<span class="chip chip-icon"><i class="ri-cpu-line" aria-hidden="true"></i><span>Ollama</span></span>\n                  <span class="chip chip-icon"><i class="ri-chat-3-line" aria-hidden="true"></i><span>Chainlit</span></span>\n                  <span class="chip chip-icon"><i class="ri-search-eye-line" aria-hidden="true"></i><span>RAG</span></span>\n                  <span class="chip chip-icon"><i class="ri-node-tree" aria-hidden="true"></i><span>GraphRAG</span></span>\n                  <span class="chip chip-icon"><i class="ri-database-2-line" aria-hidden="true"></i><span>Chroma</span></span>\n                  <span class="chip chip-icon"><i class="ri-terminal-line" aria-hidden="true"></i><span>Prompt Ops</span></span>\n                  <span class="chip chip-icon"><i class="ri-checkbox-circle-line" aria-hidden="true"></i><span data-i18n="skills.preview.evaluation">Evaluation</span></span>',
    'AI experience quality skills'
)

html = replace_once(
    html,
    '<div class="skill-preview" aria-hidden="true"><span>Python</span><span>FastAPI</span><span>Docker</span></div>',
    '<div class="skill-preview" aria-hidden="true"><span>Python / FastAPI</span><span>Vue / Node</span><span>Cloudflare / Supabase</span></div>',
    'software skill preview'
)
html = replace_once(
    html,
    '<span class="chip chip-icon"><i class="ri-swap-box-line" aria-hidden="true"></i><span>ETL</span></span>',
    '<span class="chip chip-icon"><i class="ri-swap-box-line" aria-hidden="true"></i><span>ETL</span></span>\n                  <span class="chip chip-icon"><i class="ri-database-2-line" aria-hidden="true"></i><span>SQLite</span></span>\n                  <span class="chip chip-icon"><i class="ri-line-chart-line" aria-hidden="true"></i><span>Backtrader</span></span>\n                  <span class="chip chip-icon"><i class="ri-exchange-dollar-line" aria-hidden="true"></i><span>Shioaji</span></span>\n                  <span class="chip chip-icon"><i class="ri-camera-lens-line" aria-hidden="true"></i><span>OpenCV</span></span>\n                  <span class="chip chip-icon"><i class="ri-qr-scan-2-line" aria-hidden="true"></i><span>GS1 UDI</span></span>\n                  <span class="chip chip-icon"><i class="ri-scan-2-line" aria-hidden="true"></i><span>ZXing</span></span>',
    'data pipeline skills'
)
html = replace_once(
    html,
    '<span class="chip chip-icon"><i class="ri-braces-line" aria-hidden="true"></i><span>HTML/CSS</span></span>',
    '<span class="chip chip-icon"><i class="ri-braces-line" aria-hidden="true"></i><span>HTML/CSS</span></span>\n                  <span class="chip chip-icon"><i class="ri-vuejs-line" aria-hidden="true"></i><span>Vue 3</span></span>\n                  <span class="chip chip-icon"><i class="ri-server-line" aria-hidden="true"></i><span>Node.js / Express</span></span>\n                  <span class="chip chip-icon"><i class="ri-telegram-2-line" aria-hidden="true"></i><span>Telegram Bot</span></span>',
    'application skills'
)
html = replace_once(
    html,
    '<span class="chip chip-icon"><i class="ri-database-line" aria-hidden="true"></i><span>Supabase</span></span>\n                  <span class="chip chip-icon"><i class="ri-database-2-line" aria-hidden="true"></i><span>MySQL</span></span>\n                  <span class="chip chip-icon"><i class="ri-bug-line" aria-hidden="true"></i><span>Pytest</span></span>',
    '<span class="chip chip-icon"><i class="ri-database-line" aria-hidden="true"></i><span>Supabase</span></span>\n                  <span class="chip chip-icon"><i class="ri-shield-user-line" aria-hidden="true"></i><span>OAuth</span></span>\n                  <span class="chip chip-icon"><i class="ri-database-2-line" aria-hidden="true"></i><span>MySQL</span></span>\n                  <span class="chip chip-icon"><i class="ri-window-line" aria-hidden="true"></i><span>Playwright</span></span>\n                  <span class="chip chip-icon"><i class="ri-bug-line" aria-hidden="true"></i><span>Pytest</span></span>',
    'runtime skills'
)
html = replace_once(
    html,
    '<span class="chip chip-icon"><i class="ri-shield-check-line" aria-hidden="true"></i><span data-i18n="skills.item.risk">Risk tracking</span></span>',
    '<span class="chip chip-icon"><i class="ri-shield-check-line" aria-hidden="true"></i><span data-i18n="skills.item.risk">Risk tracking</span></span>\n                  <span class="chip chip-icon"><i class="ri-building-4-line" aria-hidden="true"></i><span data-i18n="skills.item.solutionArchitecture">Solution architecture</span></span>\n                  <span class="chip chip-icon"><i class="ri-hand-heart-line" aria-hidden="true"></i><span data-i18n="skills.item.clientDelivery">Client delivery</span></span>',
    'product client delivery skills'
)
index_path.write_text(html)

# 7) Strengthen runtime regression for the new experience, retired project, new project, and skills.
smoke_path = Path('scripts/smoke-runtime.mjs')
smoke = smoke_path.read_text()
smoke = smoke.replace('document.querySelectorAll("#experienceList .reveal-target").length === 10', 'document.querySelectorAll("#experienceList .reveal-target").length === 11')
smoke = smoke.replace('if (initial.experiences !== 10) throw new Error(`Expected 10 experience entries, got ${initial.experiences}`);', 'if (initial.experiences !== 11) throw new Error(`Expected 11 experience entries, got ${initial.experiences}`);')
smoke = smoke.replace('if (experienceSpan.range !== "2012–2025") throw new Error(`Unexpected Experience career span: ${experienceSpan.range}`);', 'if (experienceSpan.range !== "2012–2026") throw new Error(`Unexpected Experience career span: ${experienceSpan.range}`);')
smoke = smoke.replace('if (experienceSpan.count !== "10 roles") throw new Error(`Unexpected Experience role count: ${experienceSpan.count}`);', 'if (experienceSpan.count !== "11 roles") throw new Error(`Unexpected Experience role count: ${experienceSpan.count}`);')
smoke = smoke.replace('if (desktopExperienceTimeline.steps.length !== 10) throw new Error(`Expected 10 Experience timeline steps, got ${desktopExperienceTimeline.steps.length}`);', 'if (desktopExperienceTimeline.steps.length !== 11) throw new Error(`Expected 11 Experience timeline steps, got ${desktopExperienceTimeline.steps.length}`);')

anchor = '  if (experienceSpan.display === "none") throw new Error("Experience career span is hidden on desktop");\n\n  if (initial.lang !== "en")'
checks = '''  if (experienceSpan.display === "none") throw new Error("Experience career span is hidden on desktop");

  const currentFreelance = await page.evaluate(() => ({
    title: document.querySelector("#experienceList .experience-step:first-child h3")?.textContent?.trim() || "",
    period: document.querySelector("#experienceList .experience-step:first-child .experience-period")?.textContent?.trim() || "",
    projectSnkr: document.querySelectorAll('[data-project-id="snkr-psa-automation"]').length,
    projectX: document.querySelectorAll('[data-project-id="x-media-downloader"]').length,
    skillsText: document.querySelector("#skills")?.textContent || ""
  }));
  if (!currentFreelance.title.includes("Independent AI & Software Engineer")) throw new Error(`Unexpected newest freelance role: ${currentFreelance.title}`);
  if (!currentFreelance.period.includes("Nov 2025")) throw new Error(`Unexpected freelance timeline period: ${currentFreelance.period}`);
  if (currentFreelance.projectSnkr !== 1) throw new Error("SNKR / PSA automation project is missing");
  if (currentFreelance.projectX !== 0) throw new Error("Retired X Media Downloader is still rendered");
  for (const requiredSkill of ["Neo4j", "Chroma", "Chainlit", "OpenCV", "GS1 UDI", "Backtrader", "Shioaji", "Vue 3", "Node.js / Express", "Telegram Bot", "OAuth", "Playwright"]) {
    if (!currentFreelance.skillsText.includes(requiredSkill)) throw new Error(`Updated Skills section is missing ${requiredSkill}`);
  }
  if (fs.existsSync(path.join(repoRoot, "assets/data/projects/x-media-downloader.json"))) throw new Error("Retired X Media Downloader source file still exists");
  if (fs.existsSync(path.join(repoRoot, "assets/images/project-x-downloader.webp"))) throw new Error("Retired X Media Downloader image still exists");

  if (initial.lang !== "en")'''
smoke = replace_once(smoke, anchor, checks, 'freelance smoke insertion')

zh_anchor = '''  const translatedAffiliationTitle = await page.locator('.signature-copy [data-i18n="hero.aside.title"]').textContent();
  if (translatedAffiliationTitle?.trim() !== "跨研究與產業經歷") {
    throw new Error(`Unexpected translated affiliation heading: ${translatedAffiliationTitle}`);
  }
'''
zh_checks = zh_anchor + '''
  const translatedFreelance = await page.locator("#experienceList .experience-step:first-child h3").textContent();
  if (!translatedFreelance?.includes("獨立 AI 與軟體工程師")) throw new Error(`Freelance role did not translate to zh: ${translatedFreelance}`);
  const translatedExperienceCount = await page.locator(".experience-span__count").textContent();
  if (translatedExperienceCount?.trim() !== "11 段經歷") throw new Error(`Unexpected translated Experience count: ${translatedExperienceCount}`);
'''
smoke = replace_once(smoke, zh_anchor, zh_checks, 'zh freelance smoke')
smoke_path.write_text(smoke)

print('Issue #53 portfolio update applied.')
