import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

const indexPath = path.join(repoRoot, "index.html");
const runtimePath = path.join(repoRoot, "assets", "js", "script.js");
const dataRoot = path.join(repoRoot, "assets", "data");
const bundlePath = path.join(dataRoot, "projects.bundle.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function parseTranslatedList(markup, label) {
  const source = String(markup || "").trim();
  const matches = [...source.matchAll(/<li>([\s\S]*?)<\/li>/g)];
  const consumed = matches.map((match) => match[0]).join("").replace(/\s+/g, "");
  if (!matches.length || consumed !== source.replace(/\s+/g, "")) {
    throw new Error(`${label} must contain only top-level <li>...</li> items.`);
  }
  return matches.map((match) => match[1].replace(/<[^>]*>/g, "").trim());
}

const translations = readJson(path.join(repoRoot, "assets", "i18n", "en.json"));
const translate = (key, fallback = "") => translations[key] || fallback;
const experience = readJson(path.join(dataRoot, "experience.json"));
const manifest = readJson(path.join(dataRoot, "projects.json"));
const projects = manifest.projectFiles.map((projectFile) => readJson(path.join(dataRoot, projectFile)));

function sortProjects(items) {
  return [...items].sort((left, right) => {
    const endDateOrder = String(right.sortEnd || "").localeCompare(String(left.sortEnd || ""));
    if (endDateOrder !== 0) return endDateOrder;
    const updatedDateOrder = String(right.sortUpdated || right.sortStart || "").localeCompare(
      String(left.sortUpdated || left.sortStart || "")
    );
    if (updatedDateOrder !== 0) return updatedDateOrder;
    return String(right.sortStart || "").localeCompare(String(left.sortStart || ""));
  });
}

function getTimelinePeriod(value = "") {
  return String(value).split("|")[0].trim();
}

function getTimelineYear(value = "") {
  return String(value).match(/(?:19|20)\d{2}/)?.[0] || "";
}

function getTimelineLabel(value = "") {
  const text = String(value).trim();
  if (text.includes(" — ")) return text.split(" — ").at(-1).trim();
  if (text.includes(" - ")) return text.split(" - ").at(-1).trim();
  return text;
}

function getChronologicalExperience(items) {
  return items
    .map((item, originalIndex) => ({
      item,
      originalIndex,
      year: Number.parseInt(getTimelineYear(translate(item.datesKey)), 10) || 9999
    }))
    .sort((left, right) => left.year - right.year || right.originalIndex - left.originalIndex);
}

function getTimelineRange(items) {
  const years = items.flatMap((item) =>
    Array.from(String(translate(item.datesKey)).matchAll(/(?:19|20)\d{2}/g), (match) => Number.parseInt(match[0], 10))
  );
  if (!years.length) return "";
  return `${Math.min(...years)}–${Math.max(...years)}`;
}

function renderExperienceOverview() {
  const jumpLabel = translate("experience.overview.jump", "Jump to role");
  const items = getChronologicalExperience(experience).map(({ item }) => {
    const dates = translate(item.datesKey);
    const title = translate(item.titleKey);
    const year = getTimelineYear(dates);
    const label = getTimelineLabel(title);
    const latestClass = item.id === experience[0]?.id ? " experience-overview__item-latest" : "";
    return `            <li class="experience-overview__item${latestClass}">
              <a class="experience-overview__link" href="#experience-${escapeHtml(item.id)}" data-experience-target="${escapeHtml(item.id)}" aria-label="${escapeHtml(`${year ? `${year}, ` : ""}${label}. ${jumpLabel}`)}">
                <span class="experience-overview__year">${escapeHtml(year)}</span>
                <span class="experience-overview__dot"></span>
                <span class="experience-overview__name">${escapeHtml(label)}</span>
              </a>
            </li>`;
  }).join("\n");

  return `        <nav class="experience-overview" aria-label="${escapeHtml(translate("experience.overview.title", "Career overview"))}">
          <div class="experience-overview__head">
            <div class="experience-overview__heading-group">
              <span class="experience-overview__title">${escapeHtml(translate("experience.overview.title", "Career overview"))}</span>
              <span class="experience-overview__hint">${escapeHtml(translate("experience.overview.hint", "Select a milestone to jump to the role."))}</span>
            </div>
            <span class="experience-overview__range">${escapeHtml(getTimelineRange(experience))}</span>
          </div>
          <ol class="experience-overview__list">
${items}
          </ol>
        </nav>`;
}

function renderExperience() {
  return experience.map((item, index) => {
    const listItems = parseTranslatedList(translate(item.listKey), item.listKey);
    const icon = item.pillIcon
      ? `<span class="icon-badge small"><i class="${escapeHtml(item.pillIcon)}" aria-hidden="true"></i></span>`
      : "";
    const period = getTimelinePeriod(translate(item.datesKey));
    return `      <div class="experience-step${index === 0 ? " experience-step-latest" : ""}" id="experience-${escapeHtml(item.id)}" data-experience-id="${escapeHtml(item.id)}" role="listitem">
        <div class="experience-marker" aria-hidden="true">
          <span class="experience-dot"></span>
          <span class="experience-period">${escapeHtml(period)}</span>
        </div>
        <details class="timeline-card experience-card"${item.open ? " open" : ""}>
          <summary>
            <div class="timeline-head">
              <span class="timeline-index">${formatIndex(index)}</span>
              <div class="summary-text">
                <p class="label">${escapeHtml(translate(item.datesKey))}</p>
                <h3>${escapeHtml(translate(item.titleKey))}</h3>
              </div>
            </div>
            <div class="summary-icons">
              ${icon}
              <span class="pill">${escapeHtml(translate(item.pillKey))}</span>
            </div>
          </summary>
          <div class="disclosure-body">
            <p class="muted">${escapeHtml(translate(item.descKey))}</p>
            <details class="inline-details"${item.inlineOpen ? " open" : ""}>
              <summary>${escapeHtml(translate("common.keyWork", "Key work"))}</summary>
              <ul class="mini-list">
${listItems.map((entry) => `                <li>${escapeHtml(entry)}</li>`).join("\n")}
              </ul>
            </details>
          </div>
        </details>
      </div>`;
  }).join("\n");
}

function renderStringList(items, className = "project-detail-list") {
  return `<ul class="${className}">\n${(items || []).map((item) => `              <li>${escapeHtml(item)}</li>`).join("\n")}\n            </ul>`;
}

function renderDetailHeading(label, iconClass, className = "project-detail-title") {
  return `<${className === "project-detail-label" ? "p" : "h4"} class="${className}"><i class="${iconClass}" aria-hidden="true"></i><span>${escapeHtml(label)}</span></${className === "project-detail-label" ? "p" : "h4"}>`;
}

function renderProject(project, index) {
  const content = project.content?.en || {};
  const title = content.title || project.id;
  const imageContain = project.imageFit === "contain";
  const chips = project.chips || [];
  const visibleChips = chips.map((chip, chipIndex) => {
    const extraClass = chipIndex >= 2 ? " project-chip-extra" : "";
    return `<span class="chip${extraClass}">${escapeHtml(chip)}</span>`;
  }).join("");
  const chipCount = chips.length > 2 ? `<span class="chip project-chip-count">+${chips.length - 2}</span>` : "";

  const architectureFigure = project.architectureImage
    ? `          <figure class="project-architecture-figure">
            <img src="${escapeHtml(project.architectureImage)}" alt="${escapeHtml(title)} — ${escapeHtml(translate("projects.detail.architectureImage", "Technical architecture diagram"))}" loading="lazy" decoding="async">
          </figure>\n`
    : "";

  const architectureSteps = (content.architecture || []).map((step, stepIndex) => `          <li class="architecture-step">
            <span class="architecture-step-index">${formatIndex(stepIndex)}</span>
            <strong>${escapeHtml(step.label || "")}</strong>
            <p>${escapeHtml(step.detail || "")}</p>
          </li>`).join("\n");

  const linksSection = project.links?.length
    ? `        <section class="project-detail-card">
          ${renderDetailHeading(translate("projects.detail.links", "Project links"), "ri-links-line")}
          <div class="project-links">
${project.links.map((link) => `            <a class="project-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener"><i class="${escapeHtml(link.icon || "ri-external-link-line")}" aria-hidden="true"></i><span>${escapeHtml(link.label || "View project")}</span></a>`).join("\n")}
          </div>
        </section>`
    : "";

  return `      <details class="project card-surface" data-category="${escapeHtml(project.category)}" data-project-id="${escapeHtml(project.id)}">
        <summary class="project-summary">
          <div class="project-media">
            <img class="project-img${imageContain ? " is-contain" : ""}" src="${escapeHtml(project.image)}" alt="${escapeHtml(title)} — ${escapeHtml(translate("projects.imageAlt", "Representative project view"))}" loading="${index < 2 ? "eager" : "lazy"}" decoding="async"${imageContain ? ' style="object-fit: contain"' : ""}>
          </div>
          <div class="project-summary-body">
            <div class="project-kicker">
              <span class="project-card-icon"><i class="${escapeHtml(project.icon || "ri-layout-grid-line")}" aria-hidden="true"></i></span>
              <span class="project-index">${formatIndex(index)}</span>
              <span class="pill">${escapeHtml(translate(project.pillKey))}</span>
              <span class="project-status">${escapeHtml(content.status || "")}</span>
            </div>
            <p class="label project-dates"><i class="ri-calendar-line" aria-hidden="true"></i><span>${escapeHtml(content.dates || "")}</span></p>
            <h3>${escapeHtml(title)}</h3>
            <p class="project-desc">${escapeHtml(content.summary || "")}</p>
            <div class="chips project-chips">${visibleChips}${chipCount}</div>
            <span class="project-summary-action"><span class="project-summary-action-text">${escapeHtml(translate("projects.toggle.open", "Open case study"))}</span><i class="ri-arrow-down-s-line" aria-hidden="true"></i></span>
          </div>
        </summary>
        <div class="project-case-body">
          <div class="project-case-meta">
            <div class="project-meta-block">
              ${renderDetailHeading(translate("projects.detail.role", "Role & ownership"), "ri-user-star-line", "project-detail-label")}
              <p class="project-meta-value">${escapeHtml(content.role || "")}</p>
            </div>
            <div class="project-meta-block">
              ${renderDetailHeading(translate("projects.detail.status", "Status"), "ri-checkbox-circle-line", "project-detail-label")}
              <p class="project-meta-value">${escapeHtml(content.status || "")}</p>
            </div>
          </div>
          <div class="project-narrative-grid">
            <section class="project-detail-card">
              ${renderDetailHeading(translate("projects.detail.challenge", "Problem to solve"), "ri-question-line")}
              <p>${escapeHtml(content.challenge || "")}</p>
            </section>
            <section class="project-detail-card">
              ${renderDetailHeading(translate("projects.detail.contribution", "What I built"), "ri-hammer-line")}
              ${renderStringList(content.contribution)}
            </section>
            <section class="project-detail-card">
              ${renderDetailHeading(translate("projects.detail.technical", "Technical implementation"), "ri-code-box-line")}
              ${renderStringList(content.technical)}
            </section>
          </div>
          <section class="project-architecture-section">
            ${renderDetailHeading(translate("projects.detail.architecture", "Architecture path"), "ri-node-tree")}
${architectureFigure}          <ol class="architecture-flow">
${architectureSteps}
          </ol>
          </section>
          <div class="project-evidence-grid">
            <section class="project-detail-card">
              ${renderDetailHeading(translate("projects.detail.outcomes", "Outcome & evidence"), "ri-line-chart-line")}
              ${renderStringList(content.outcomes, "project-outcome-list")}
            </section>
${linksSection}
          </div>
        </div>
      </details>`;
}

const EXPERIENCE_OVERVIEW_START = "      <!-- GENERATED EXPERIENCE OVERVIEW START -->";
const EXPERIENCE_OVERVIEW_END = "      <!-- GENERATED EXPERIENCE OVERVIEW END -->";
const EXPERIENCE_START = "      <!-- GENERATED EXPERIENCE START -->";
const EXPERIENCE_END = "      <!-- GENERATED EXPERIENCE END -->";
const PROJECTS_START = "      <!-- GENERATED PROJECTS START -->";
const PROJECTS_END = "      <!-- GENERATED PROJECTS END -->";

function replaceGeneratedRegion(html, { emptyContainer, startMarker, endMarker, generated }) {
  if (html.includes(startMarker) || html.includes(endMarker)) {
    if (!html.includes(startMarker) || !html.includes(endMarker)) {
      throw new Error(`Generated markers are incomplete: ${startMarker}`);
    }
    const start = html.indexOf(startMarker);
    const end = html.indexOf(endMarker, start);
    if (end < start) throw new Error(`Generated markers are out of order: ${startMarker}`);
    return html.slice(0, start) + startMarker + "\n" + generated + "\n" + html.slice(end);
  }

  const count = html.split(emptyContainer).length - 1;
  if (count !== 1) throw new Error(`Expected one empty generated container, found ${count}: ${emptyContainer}`);
  const openTag = emptyContainer.replace("</div>", "");
  return html.replace(emptyContainer, `${openTag}\n${startMarker}\n${generated}\n${endMarker}\n    </div>`);
}

function addNoJsFallback(html) {
  const marker = "  <!-- No-JS visibility fallback -->";
  if (html.includes(marker)) return html;
  const headClose = "</head>";
  const count = html.split(headClose).length - 1;
  if (count !== 1) throw new Error(`Expected one </head>, found ${count}`);
  const block = `${marker}\n  <noscript><style>.reveal,.reveal-target{opacity:1!important;transform:none!important}</style></noscript>\n`;
  return html.replace(headClose, block + headClose);
}

function buildIndex(currentHtml) {
  let html = addNoJsFallback(currentHtml);
  html = replaceGeneratedRegion(html, {
    emptyContainer: '<div id="experienceOverview"></div>',
    startMarker: EXPERIENCE_OVERVIEW_START,
    endMarker: EXPERIENCE_OVERVIEW_END,
    generated: renderExperienceOverview()
  });
  html = replaceGeneratedRegion(html, {
    emptyContainer: '<div class="timeline" id="experienceList" role="list"></div>',
    startMarker: EXPERIENCE_START,
    endMarker: EXPERIENCE_END,
    generated: renderExperience()
  });
  html = replaceGeneratedRegion(html, {
    emptyContainer: '<div class="project-grid" id="projectGrid"></div>',
    startMarker: PROJECTS_START,
    endMarker: PROJECTS_END,
    generated: sortProjects(projects).map(renderProject).join("\n")
  });
  return html;
}

function buildRuntime(currentRuntime) {
  const bundledPath = 'projects: "./assets/data/projects.bundle.json"';
  if (currentRuntime.includes(bundledPath)) return currentRuntime;
  const sourcePath = 'projects: "./assets/data/projects.json"';
  const count = currentRuntime.split(sourcePath).length - 1;
  if (count !== 1) throw new Error(`Expected one runtime project data path, found ${count}`);
  return currentRuntime.replace(sourcePath, bundledPath);
}

const currentIndex = fs.readFileSync(indexPath, "utf8");
const currentRuntime = fs.readFileSync(runtimePath, "utf8");
const expectedIndex = buildIndex(currentIndex);
const expectedRuntime = buildRuntime(currentRuntime);
const expectedBundle = JSON.stringify(projects, null, 2) + "\n";
const currentBundle = fs.existsSync(bundlePath) ? fs.readFileSync(bundlePath, "utf8") : "";

if (checkOnly) {
  const stale = [];
  if (currentIndex !== expectedIndex) stale.push("index.html generated Experience/Projects fallback");
  if (currentRuntime !== expectedRuntime) stale.push("assets/js/script.js project bundle path");
  if (currentBundle !== expectedBundle) stale.push("assets/data/projects.bundle.json");
  if (stale.length) {
    console.error("Generated content is stale:\n" + stale.map((item) => `- ${item}`).join("\n"));
    console.error("Run `npm run build:content` and commit the generated changes.");
    process.exit(1);
  }
  console.log(`Generated content is current: ${experience.length} experience entries, ${projects.length} projects, single project bundle.`);
  process.exit(0);
}

fs.writeFileSync(indexPath, expectedIndex);
fs.writeFileSync(runtimePath, expectedRuntime);
fs.writeFileSync(bundlePath, expectedBundle);
console.log(`Built static fallback HTML for ${experience.length} experience entries and ${projects.length} projects plus projects.bundle.json.`);
