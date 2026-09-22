import { COPY, PROOF_SECTION } from "./ai-positioning-copy.js";

const PROJECT_PATCHES = {
  "heraklion": {
    chips: ["Python", "Flask", "RDF/DCAT", "GraphDB", "SPARQL", "uWSGI/NGINX", "Docker", "RAG"],
    content: {
      en: {
        title: "HERAKLION — Resilience Data Space",
        summary: "BMBF resilience data-space program connecting heterogeneous public data, REST services, semantic metadata/knowledge graphs, and grounded analysis/recommender workflows.",
        status: "Multi-partner applied research program",
        role: "Requirements engineer · backend/data/knowledge engineer",
        challenge: "Municipal crisis and resilience teams needed reusable, governed access to heterogeneous public data across organizations while preserving shared semantics, metadata, provenance, and integration boundaries.",
        contribution: [
          "Served as requirements engineer and developer, structuring acceptance criteria, increment planning, prototyping, stakeholder testing/reviews, and user workshops.",
          "Developed pygenesis to discover, retrieve, normalize, and expose data from GENESIS-Online, Regionalstatistik, FR.ITZ, GovData, and INKAR.",
          "Built Flask/Swagger REST services around the data layer and documented production-oriented deployment with uWSGI, NGINX, and Docker.",
          "Designed preprocessing and metadata pipelines covering cleaning, time/geographic normalization, metadata extraction, RDF/DCAT conversion, and GraphDB/SPARQL access.",
          "Integrated the API/data-provider layer into the data-space MVP and contributed local RAG/recommender components using GraphDB, LangChain, Chainlit, and Ollama."
        ],
        technical: [
          "Python adapters and ETL normalize heterogeneous statistical/public-data APIs into reusable dataframes and service responses.",
          "RDF/DCAT/DCAT-AP concepts and project ontologies describe datasets; GraphDB/SPARQL provide semantic access.",
          "Flask services run behind uWSGI/NGINX/Docker for internal concurrent access; provider/consumer integrations support catalog- and policy-driven data exchange.",
          "Local LLM/RAG components connect graph knowledge to natural-language interaction; this work is presented as applied research, not as a 24×7 autonomous production agent."
        ],
        architecture: [
          {label: "Sources", detail: "GENESIS-Online, Regionalstatistik and other public-data providers expose heterogeneous datasets and metadata."},
          {label: "Data & API layer", detail: "pygenesis normalizes source access; Flask/Swagger services publish stable reusable interfaces."},
          {label: "Semantic data space", detail: "RDF/DCAT, ontologies, GraphDB/SPARQL and provider/consumer integration support governed interoperability."},
          {label: "Applications", detail: "Resilience analysis and grounded recommendation services consume the integrated data and knowledge."}
        ],
        outcomes: [
          "Delivered reusable backend, data and semantic components across a multi-partner BMBF program.",
          "Combined software delivery with formal requirements engineering instead of operating only as an isolated developer.",
          "Built practical experience spanning API operations, semantic interoperability, governed data exchange, and applied GenAI."
        ]
      },
      zh: {
        title: "HERAKLION — 韌性資料空間",
        summary: "BMBF 多夥伴韌性資料空間專案，串接異質公共資料、REST 服務、語意 metadata/知識圖譜與具依據的分析/recommender 流程。",
        status: "多夥伴應用研究專案",
        role: "Requirements Engineer · 後端／資料／知識工程",
        challenge: "地方危機管理與韌性團隊需要跨組織重用異質公共資料，同時保留共同語意、metadata、provenance 與治理/整合邊界。",
        contribution: [
          "擔任 Requirements Engineer 與 Developer，規劃驗收條件、increment planning、prototype、stakeholder testing/review 與 user workshop。",
          "開發 pygenesis，整合 GENESIS-Online、Regionalstatistik、FR.ITZ、GovData 與 INKAR 的資料探索、取得、標準化與輸出。",
          "以 Flask/Swagger 建置 REST 服務，並整理 uWSGI、NGINX、Docker 的 production-oriented 部署方式。",
          "設計資料前處理與 metadata pipeline，涵蓋清理、時間/地理標準化、metadata extraction、RDF/DCAT 轉換與 GraphDB/SPARQL。",
          "將 API/data-provider layer 整合進 data-space MVP，並參與 GraphDB、LangChain、Chainlit、Ollama 的本地 RAG/recommender 元件。"
        ],
        technical: [
          "Python adapter 與 ETL 將異質統計/公共資料 API 標準化為可重用 dataframe 與服務回傳。",
          "RDF/DCAT/DCAT-AP 與專案本體描述資料集，GraphDB/SPARQL 提供語意查詢。",
          "Flask 服務透過 uWSGI/NGINX/Docker 提供內部並行存取，並與 provider/consumer 流程整合資料目錄與政策式交換。",
          "本地 LLM/RAG 元件將圖譜知識接上自然語言互動；此工作明確標示為應用研究，而非 24×7 自主生產 Agent。"
        ],
        architecture: [
          {label: "資料來源", detail: "GENESIS-Online、Regionalstatistik 與其他公共資料提供異質資料集與 metadata。"},
          {label: "資料與 API", detail: "pygenesis 統一來源存取；Flask/Swagger 服務提供穩定、可重用介面。"},
          {label: "語意資料空間", detail: "RDF/DCAT、本體、GraphDB/SPARQL 與 provider/consumer 整合支援受治理的互通。"},
          {label: "應用", detail: "韌性分析與具依據的推薦服務使用整合後的資料與知識。"}
        ],
        outcomes: [
          "在 BMBF 多夥伴專案中交付可重用的後端、資料與語意元件。",
          "同時承擔軟體交付與正式 requirements engineering，而不只是單點程式開發。",
          "累積 API、語意互通、受治理資料交換與應用 GenAI 的跨領域實務。"
        ]
      }
    }
  },
  "chatbot": {
    chips: ["RAG", "GraphRAG", "GraphDB", "CAE", "Ollama", "Chainlit", "Docker"],
    content: {
      en: {
        title: "Automotive CAE Knowledge-Graph RAG Recommender",
        summary: "Engineering decision-support PoC that retrieves simulation metadata and documentation through graph/RAG pipelines instead of relying on free-form LLM answers.",
        status: "R&D PoC / customer demonstrator",
        role: "GenAI & knowledge engineer",
        challenge: "CAE teams needed to reuse historical simulation configurations, metadata, manuals and engineering knowledge while reducing the risk that a conversational model invents unsupported recommendations.",
        contribution: [
          "Designed a knowledge-graph/RAG architecture for CAE files, simulation metadata, manuals, requirements and prior project knowledge.",
          "Connected graph, vector/document retrieval and local LLM interaction behind a natural-language engineering interface.",
          "Defined a concrete user journey around firewall thickness, intrusion and engineering trade-offs to test decision-support behavior.",
          "Prepared customer-facing demonstrations and use-case discussions for Japanese automotive OEM stakeholders."
        ],
        technical: [
          "GraphDB/RDF/SPARQL and graph-oriented modeling represent engineering metadata and relationships.",
          "RAG/GraphRAG retrieval provides bounded evidence from engineering documents and structured knowledge.",
          "Ollama/local models and Chainlit support private conversational interaction; Docker keeps the demonstrator reproducible."
        ],
        architecture: [
          {label: "Engineering sources", detail: "CAE result/setup files, manuals, requirements and historical project data provide the evidence base."},
          {label: "Knowledge formalization", detail: "Metadata extraction and semantic/graph structures capture simulation parameters, context and relationships."},
          {label: "Retrieval & reasoning", detail: "Graph and document/vector retrieval assemble evidence for local LLM interaction."},
          {label: "Engineer interface", detail: "A conversational PoC surfaces grounded recommendations and trade-offs for validation by engineers."}
        ],
        outcomes: [
          "Demonstrated grounded engineering decision support rather than a generic chatbot.",
          "Connected knowledge engineering, retrieval and local GenAI to a concrete CAE workflow.",
          "Kept the scope truthful: an R&D/customer demonstrator, not a production deployment inside every OEM."
        ]
      },
      zh: {
        title: "汽車 CAE Knowledge-Graph RAG Recommender",
        summary: "工程決策支援 PoC，以圖譜/RAG 檢索模擬 metadata 與文件，避免只依賴 LLM 自由生成答案。",
        status: "研發 PoC / 客戶 demonstrator",
        role: "GenAI 與知識工程師",
        challenge: "CAE 團隊需要重用歷史模擬設定、metadata、manual 與工程知識，同時降低對話模型產生無依據建議的風險。",
        contribution: [
          "針對 CAE 檔案、simulation metadata、manual、requirements 與歷史專案知識設計 knowledge-graph/RAG 架構。",
          "把圖譜、向量/文件檢索與本地 LLM 串接至自然語言工程介面。",
          "定義 firewall thickness、intrusion 與工程 trade-off 的具體 user journey 來驗證決策支援行為。",
          "為日本汽車 OEM stakeholder 準備 customer-facing demonstrator 與 use-case discussion。"
        ],
        technical: [
          "GraphDB/RDF/SPARQL 與圖譜建模表示工程 metadata 與關係。",
          "RAG/GraphRAG 從工程文件與結構化知識擷取受限證據。",
          "Ollama/本地模型與 Chainlit 提供私有對話互動，Docker 維持 demonstrator 可重現。"
        ],
        architecture: [
          {label: "工程資料來源", detail: "CAE result/setup file、manual、requirements 與歷史專案資料形成 evidence base。"},
          {label: "知識形式化", detail: "metadata extraction 與語意/圖譜結構表達模擬參數、情境與關係。"},
          {label: "檢索與推理", detail: "圖譜與文件/向量檢索組合 evidence，再交由本地 LLM 互動。"},
          {label: "工程師介面", detail: "對話式 PoC 呈現具依據的建議與 trade-off，由工程師驗證。"}
        ],
        outcomes: [
          "展示具依據的工程決策支援，而不是一般聊天機器人。",
          "把知識工程、檢索與本地 GenAI 接到具體 CAE workflow。",
          "明確維持真實 scope：研發/客戶 demonstrator，而非宣稱已部署至所有 OEM 生產環境。"
        ]
      }
    }
  },
  "production-copilot": {
    content: {
      en: {
        summary: "Agentic production-planning demonstrator routing natural-language questions across Postgres, Neo4j and Chroma with local-model support and deterministic fallbacks.",
        status: "AI systems demonstrator",
        role: "AI systems architect & backend engineer",
        outcomes: [
          "Demonstrates agent/tool routing across operational facts, semantic relationships and planning documents.",
          "Keeps responses bounded by data/tool outputs and deterministic templates when model services are unavailable.",
          "Presented as a demonstrator/reference architecture rather than a claim of 24×7 factory production ownership."
        ]
      },
      zh: {
        summary: "Agentic 生產規劃 demonstrator，將自然語言問題路由至 Postgres、Neo4j、Chroma，支援本地模型與確定性 fallback。",
        status: "AI 系統 demonstrator",
        role: "AI 系統架構與後端工程師",
        outcomes: [
          "展示 Agent/tool routing 如何跨營運事實、語意關係與規劃文件運作。",
          "模型服務不可用時，以資料/工具輸出與確定性範本限制回覆範圍。",
          "明確定位為 demonstrator/reference architecture，而非宣稱具 24×7 工廠生產 ownership。"
        ]
      }
    }
  }
};

function localizedCopy(lang) {
  return COPY[lang] || COPY.en;
}

export function createPositionedTranslate(lang, baseTranslate) {
  const overrides = localizedCopy(lang);
  return (key) => overrides[key] ?? baseTranslate(key);
}

export function positionExperienceData(items) {
  return (items || [])
    .filter((item) => item.id !== "aurore")
    .map((item) => {
      if (item.id === "freelance-taiwan" || item.id === "fraunhofer-2021") {
        return { ...item, open: true, inlineOpen: true };
      }
      return item;
    });
}

export function positionProjectsData(items) {
  return (items || [])
    .filter((project) => project.id !== "ecommerce")
    .map((project) => {
      const patch = PROJECT_PATCHES[project.id];
      if (!patch) return project;
      return {
        ...project,
        ...patch,
        content: {
          ...project.content,
          en: { ...(project.content?.en || {}), ...(patch.content?.en || {}) },
          zh: { ...(project.content?.zh || {}), ...(patch.content?.zh || {}) }
        }
      };
    });
}

function setMeta(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.setAttribute("content", value);
}

function configureProfileLinks() {
  document.querySelectorAll('[data-i18n="actions.resume"], [data-i18n="hero.download"]').forEach((anchor) => {
    if (!(anchor instanceof HTMLAnchorElement)) return;
    anchor.href = "./cv.html";
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.removeAttribute("download");
  });

  document.querySelectorAll('[data-i18n="hero.downloadEu"]').forEach((anchor) => {
    if (!(anchor instanceof HTMLAnchorElement)) return;
    anchor.href = "https://www.linkedin.com/in/yu-sheng-tang/";
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.removeAttribute("download");
  });
}

function hideAuroreAffiliations() {
  document.querySelectorAll('img[src*="aurore_co"]').forEach((image) => {
    image.closest(".affiliation-item")?.setAttribute("hidden", "");
  });
}

function updateStructuredProfile() {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script) return;
  try {
    const data = JSON.parse(script.textContent || "{}");
    if (data.mainEntity) {
      data.name = "Adam Tang — AI Systems Engineer";
      data.mainEntity.jobTitle = "AI Systems Engineer";
      data.mainEntity.sameAs = [
        "https://github.com/adam951502",
        "https://www.linkedin.com/in/yu-sheng-tang/"
      ];
      script.textContent = JSON.stringify(data, null, 2);
    }
  } catch (error) {
    console.warn("ai-positioning: unable to update structured profile", error);
  }
}

function createProofSection(lang) {
  const content = PROOF_SECTION[lang] || PROOF_SECTION.en;
  let section = document.getElementById("ai-proof");
  if (!section) {
    section = document.createElement("section");
    section.id = "ai-proof";
    section.className = "section reveal ai-proof-section";
    const anchor = document.querySelector(".recruiter-overview");
    if (anchor?.parentNode) anchor.parentNode.insertBefore(section, anchor.nextSibling);
  }

  section.innerHTML = "";
  const heading = document.createElement("div");
  heading.className = "section-heading";
  const titleBlock = document.createElement("div");
  titleBlock.className = "section-title-block";
  const icon = document.createElement("span");
  icon.className = "section-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = '<i class="ri-cpu-line"></i>';
  const copy = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = content.eyebrow;
  const title = document.createElement("h2");
  title.textContent = content.title;
  copy.append(eyebrow, title);
  titleBlock.append(icon, copy);
  const lede = document.createElement("p");
  lede.className = "muted section-note";
  lede.textContent = content.lede;
  heading.append(titleBlock, lede);

  const grid = document.createElement("div");
  grid.className = "card-grid four";
  content.cards.forEach(([cardTitle, body, pill], index) => {
    const card = document.createElement("article");
    card.className = "card focus-card";
    const idx = document.createElement("div");
    idx.className = "card-index";
    idx.textContent = String(index + 1).padStart(2, "0");
    const cardIcon = document.createElement("i");
    cardIcon.className = ["ri-node-tree", "ri-database-2-line", "ri-code-box-line", "ri-shield-check-line"][index] + " icon-badge";
    cardIcon.setAttribute("aria-hidden", "true");
    const pillEl = document.createElement("div");
    pillEl.className = "pill";
    pillEl.textContent = pill;
    const h3 = document.createElement("h3");
    h3.textContent = cardTitle;
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = body;
    card.append(idx, cardIcon, pillEl, h3, p);
    grid.appendChild(card);
  });

  section.append(heading, grid);
}

export function applyPositioningDom({ lang, translate }) {
  const overrides = localizedCopy(lang);
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key || overrides[key] === undefined) return;
    if (element.dataset.i18nHtml === "true") {
      element.innerHTML = overrides[key];
    } else {
      element.textContent = overrides[key];
    }
  });

  const title = translate("page.title");
  if (title) document.title = title;

  const description = lang === "zh"
    ? "Adam Tang，AI 系統工程師，專注 Agentic AI、MCP、RAG/GraphRAG、知識圖譜、後端與營運軟體；Fraunhofer EMI 5+ 年研究與工程經歷。"
    : "Adam Tang is an AI Systems Engineer focused on agentic AI, MCP, RAG/GraphRAG, knowledge graphs, backend and operational software, with 5+ years at Fraunhofer EMI across research and engineering roles.";

  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);

  configureProfileLinks();
  hideAuroreAffiliations();
  updateStructuredProfile();
  createProofSection(lang);
}
