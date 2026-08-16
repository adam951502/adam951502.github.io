from pathlib import Path
import json


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


experience_js = r'''import { createElement, formatIndex, setSafeTranslatedMarkup } from "./shared.js";

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

function getChronologicalExperience(experienceData, translateFn) {
  return experienceData
    .map((item, originalIndex) => ({
      item,
      originalIndex,
      year: Number.parseInt(getTimelineYear(translateFn(item.datesKey) || ""), 10) || 9999
    }))
    .sort((left, right) => left.year - right.year || right.originalIndex - left.originalIndex);
}

function getTimelineRange(experienceData, translateFn) {
  const years = experienceData.flatMap((item) =>
    Array.from(String(translateFn(item.datesKey) || "").matchAll(/(?:19|20)\d{2}/g), (match) => Number.parseInt(match[0], 10))
  );
  if (!years.length) return "";
  return `${Math.min(...years)}–${Math.max(...years)}`;
}

function renderExperienceOverview({ overview, experienceData, translateFn }) {
  if (!overview) return;
  overview.innerHTML = "";

  const nav = createElement("nav", "experience-overview");
  nav.setAttribute("aria-label", translateFn("experience.overview.title") || "Career overview");

  const head = createElement("div", "experience-overview__head");
  const headingGroup = createElement("div", "experience-overview__heading-group");
  headingGroup.append(
    createElement("span", "experience-overview__title", translateFn("experience.overview.title") || "Career overview"),
    createElement("span", "experience-overview__hint", translateFn("experience.overview.hint") || "Select a milestone to jump to the role.")
  );
  head.append(
    headingGroup,
    createElement("span", "experience-overview__range", getTimelineRange(experienceData, translateFn))
  );

  const list = document.createElement("ol");
  list.className = "experience-overview__list";

  const chronological = getChronologicalExperience(experienceData, translateFn);
  chronological.forEach(({ item }) => {
    const dates = translateFn(item.datesKey) || "";
    const title = translateFn(item.titleKey) || "";
    const year = getTimelineYear(dates);
    const label = getTimelineLabel(title);
    const listItem = createElement("li", `experience-overview__item${item.id === experienceData[0]?.id ? " experience-overview__item-latest" : ""}`);
    const link = document.createElement("a");
    link.className = "experience-overview__link";
    link.href = `#experience-${item.id}`;
    link.dataset.experienceTarget = item.id;
    link.setAttribute(
      "aria-label",
      `${year ? `${year}, ` : ""}${label}. ${translateFn("experience.overview.jump") || "Jump to role"}`
    );
    link.append(
      createElement("span", "experience-overview__year", year),
      createElement("span", "experience-overview__dot"),
      createElement("span", "experience-overview__name", label)
    );
    link.addEventListener("click", (event) => {
      const target = document.getElementById(`experience-${item.id}`);
      if (!target) return;
      event.preventDefault();
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      history.replaceState(null, "", `#experience-${item.id}`);
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    });
    listItem.appendChild(link);
    list.appendChild(listItem);
  });

  nav.append(head, list);
  overview.appendChild(nav);
}

export function renderExperience({ experienceData, translateFn, registerReveal }) {
  const container = document.getElementById("experienceList");
  if (!container) return;
  const overview = document.getElementById("experienceOverview");

  renderExperienceOverview({ overview, experienceData, translateFn });
  container.innerHTML = "";

  experienceData.forEach((item, index) => {
    const step = createElement("div", `experience-step reveal-target${index === 0 ? " experience-step-latest" : ""}`);
    step.id = `experience-${item.id}`;
    step.dataset.experienceId = item.id;
    step.setAttribute("role", "listitem");

    const marker = createElement("div", "experience-marker");
    marker.setAttribute("aria-hidden", "true");
    marker.append(
      createElement("span", "experience-dot"),
      createElement("span", "experience-period", getTimelinePeriod(translateFn(item.datesKey) || ""))
    );

    const details = createElement("details", "timeline-card experience-card");
    if (item.open) details.open = true;

    const summary = document.createElement("summary");
    const head = createElement("div", "timeline-head");
    const indexEl = createElement("span", "timeline-index", formatIndex(index));
    const summaryText = createElement("div", "summary-text");
    const dateEl = createElement("p", "label", translateFn(item.datesKey) || "");
    const titleEl = createElement("h3", "", translateFn(item.titleKey) || "");
    summaryText.append(dateEl, titleEl);
    head.append(indexEl, summaryText);

    const summaryIcons = createElement("div", "summary-icons");
    if (item.pillIcon) {
      const iconWrap = createElement("span", "icon-badge small");
      const icon = document.createElement("i");
      icon.className = item.pillIcon;
      icon.setAttribute("aria-hidden", "true");
      iconWrap.appendChild(icon);
      summaryIcons.appendChild(iconWrap);
    }
    summaryIcons.appendChild(createElement("span", "pill", translateFn(item.pillKey) || ""));
    summary.append(head, summaryIcons);

    const body = createElement("div", "disclosure-body");
    const desc = createElement("p", "muted", translateFn(item.descKey) || "");
    const inline = createElement("details", "inline-details");
    if (item.inlineOpen) inline.open = true;
    const inlineSummary = createElement("summary", "", translateFn("common.keyWork") || "Key work");
    const list = createElement("ul", "mini-list");
    const listHtml = translateFn(item.listKey);
    if (listHtml) setSafeTranslatedMarkup(list, listHtml);
    inline.append(inlineSummary, list);

    body.append(desc, inline);
    details.append(summary, body);
    step.append(marker, details);
    container.appendChild(step);
  });

  container.setAttribute("role", "list");
  registerReveal(container.querySelectorAll(".reveal-target"));
}
'''
Path("assets/js/experience.js").write_text(experience_js)

# Add bilingual overview strings without duplicating Experience content.
for language, values in {
    "en": {
        "experience.overview.title": "Career overview",
        "experience.overview.hint": "Select a milestone to jump to the role.",
        "experience.overview.jump": "Jump to role",
    },
    "zh": {
        "experience.overview.title": "職涯總覽",
        "experience.overview.hint": "選擇里程碑，快速前往對應經歷。",
        "experience.overview.jump": "前往此經歷",
    },
}.items():
    path = Path(f"assets/i18n/{language}.json")
    data = json.loads(path.read_text())
    data.update(values)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")

# Build-time renderer: generate the overview and the detailed timeline from the same canonical data.
build_path = Path("scripts/build-content.mjs")
build = build_path.read_text()
start = build.index('function getTimelinePeriod(value = "") {')
end = build.index("\nfunction renderStringList", start)
new_experience_renderers = r'''function getTimelinePeriod(value = "") {
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
'''
build = build[:start] + new_experience_renderers + build[end:]

# Add a generated region for the overview before the existing Experience generated region.
old_constants = 'const EXPERIENCE_START = "      <!-- GENERATED EXPERIENCE START -->";\nconst EXPERIENCE_END = "      <!-- GENERATED EXPERIENCE END -->";'
new_constants = 'const EXPERIENCE_OVERVIEW_START = "      <!-- GENERATED EXPERIENCE OVERVIEW START -->";\nconst EXPERIENCE_OVERVIEW_END = "      <!-- GENERATED EXPERIENCE OVERVIEW END -->";\nconst EXPERIENCE_START = "      <!-- GENERATED EXPERIENCE START -->";\nconst EXPERIENCE_END = "      <!-- GENERATED EXPERIENCE END -->";'
build = replace_once(build, old_constants, new_constants, "Experience build constants")

old_build_index = '''  html = replaceGeneratedRegion(html, {
    emptyContainer: '<div class="timeline" id="experienceList" role="list"></div>',
    startMarker: EXPERIENCE_START,
    endMarker: EXPERIENCE_END,
    generated: renderExperience()
  });'''
new_build_index = '''  html = replaceGeneratedRegion(html, {
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
  });'''
build = replace_once(build, old_build_index, new_build_index, "Experience buildIndex block")
build_path.write_text(build)

# Add the overview shell to the Experience section before static generation.
index_path = Path("index.html")
html = index_path.read_text()
if 'id="experienceOverview"' not in html:
    needle = '      </div>\n      <div class="timeline" id="experienceList" role="list">'
    replacement = '      </div>\n      <div id="experienceOverview"></div>\n      <div class="timeline" id="experienceList" role="list">'
    html = replace_once(html, needle, replacement, "Experience overview shell")
    index_path.write_text(html)

# Responsive visual design: full overview on desktop, compressed on tablet, hidden on mobile.
css_path = Path("assets/css/style.css")
css = css_path.read_text()
marker = "/* Issue #49: Experience overview timeline */"
if marker in css:
    raise SystemExit("Experience overview timeline CSS already exists")
css += r'''

/* Issue #49: Experience overview timeline */
#experienceOverview {
  margin: 2px 0 36px;
}

.experience-overview {
  position: relative;
  overflow: hidden;
  padding: 18px 18px 15px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--panel), rgba(255, 255, 255, 0.08));
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(18px);
}

.experience-overview__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 10px;
}

.experience-overview__heading-group {
  display: grid;
  gap: 3px;
}

.experience-overview__title {
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.experience-overview__hint {
  color: var(--muted);
  font-size: 0.78rem;
}

.experience-overview__range {
  flex: 0 0 auto;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--accent-2);
  background: var(--accent-soft-2);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.experience-overview__list {
  position: relative;
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  margin: 0;
  padding: 10px 2px 0;
  list-style: none;
}

.experience-overview__list::before {
  content: "";
  position: absolute;
  top: 39px;
  right: 5%;
  left: 5%;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--border-strong), var(--accent), var(--accent-2));
  opacity: 0.78;
}

.experience-overview__item {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.experience-overview__link {
  display: grid;
  grid-template-rows: 18px 22px minmax(30px, auto);
  justify-items: center;
  gap: 3px;
  min-width: 0;
  padding: 2px 3px;
  color: var(--muted);
  text-decoration: none;
}

.experience-overview__year {
  color: var(--muted-soft);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.experience-overview__dot {
  align-self: center;
  width: 14px;
  height: 14px;
  border: 4px solid var(--bg);
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 1px var(--border-strong);
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.experience-overview__name {
  max-width: 104px;
  overflow: hidden;
  color: var(--muted);
  font-size: 0.66rem;
  font-weight: 650;
  line-height: 1.25;
  text-align: center;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.experience-overview__item-latest .experience-overview__dot {
  background: var(--accent-2);
  box-shadow: 0 0 0 1px var(--accent-2), 0 0 0 5px var(--accent-soft-2);
}

.experience-overview__item-latest .experience-overview__year,
.experience-overview__item-latest .experience-overview__name {
  color: var(--accent-2);
}

.experience-overview__link:hover .experience-overview__dot,
.experience-overview__link:focus-visible .experience-overview__dot {
  transform: scale(1.22);
  background: var(--accent-2);
  box-shadow: 0 0 0 1px var(--accent-2), 0 0 0 5px var(--accent-soft-2);
}

.experience-overview__link:hover .experience-overview__name,
.experience-overview__link:focus-visible .experience-overview__name {
  color: var(--text);
}

.experience-overview__link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: 10px;
}

.experience-step {
  scroll-margin-top: 120px;
}

.experience-step:target .experience-card {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-soft), var(--shadow-strong);
}

@media (max-width: 1100px) {
  .experience-overview {
    padding-inline: 14px;
  }

  .experience-overview__hint,
  .experience-overview__name {
    display: none;
  }

  .experience-overview__link {
    grid-template-rows: 18px 22px;
    padding-bottom: 4px;
  }

  .experience-overview__list::before {
    top: 39px;
  }
}

@media (max-width: 760px) {
  #experienceOverview {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .experience-overview__dot,
  .experience-overview__name {
    transition: none;
  }
}
'''
css_path.write_text(css)

# Regression coverage for complete overview navigation and mobile simplification.
smoke_path = Path("scripts/smoke-runtime.mjs")
smoke = smoke_path.read_text()
desktop_anchor = '  const blogNavHref = await page.locator(\'.site-nav a[href="./blog/"]\').getAttribute("href");\n'
desktop_checks = r'''  const experienceOverview = await page.evaluate(() => {
    const shell = document.getElementById("experienceOverview");
    const nav = shell?.querySelector(".experience-overview");
    const links = Array.from(shell?.querySelectorAll(".experience-overview__link") || []);
    return {
      visible: nav ? getComputedStyle(nav).display !== "none" : false,
      range: shell?.querySelector(".experience-overview__range")?.textContent?.trim() || "",
      items: links.map((link) => ({
        href: link.getAttribute("href"),
        target: link.dataset.experienceTarget || "",
        year: Number.parseInt(link.querySelector(".experience-overview__year")?.textContent || "0", 10),
        name: link.querySelector(".experience-overview__name")?.textContent?.trim() || "",
        targetExists: Boolean(document.querySelector(link.getAttribute("href") || ""))
      }))
    };
  });
  if (!experienceOverview.visible) throw new Error("Experience overview timeline is not visible on desktop");
  if (experienceOverview.items.length !== 10) throw new Error(`Expected 10 Experience overview milestones, got ${experienceOverview.items.length}`);
  if (experienceOverview.range !== "2012–2025") throw new Error(`Unexpected Experience overview range: ${experienceOverview.range}`);
  for (let index = 0; index < experienceOverview.items.length; index += 1) {
    const item = experienceOverview.items[index];
    if (!item.href || !item.target || !item.targetExists) throw new Error(`Experience overview milestone ${index + 1} is not linked to a detailed step`);
    if (!item.name) throw new Error(`Experience overview milestone ${index + 1} is missing its organization label`);
    if (index > 0 && item.year < experienceOverview.items[index - 1].year) {
      throw new Error("Experience overview milestones are not in chronological order");
    }
  }

  const overviewJump = page.locator("#experienceOverview .experience-overview__link").nth(1);
  const overviewJumpHref = await overviewJump.getAttribute("href");
  if (!overviewJumpHref) throw new Error("Experience overview jump target is missing");
  const overviewTarget = page.locator(overviewJumpHref);
  await page.locator("#experience").evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(100);
  await overviewJump.click();
  await page.waitForTimeout(900);
  const overviewJumpResult = await overviewTarget.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      center: rect.top + rect.height / 2,
      viewportCenter: window.innerHeight / 2,
      hash: window.location.hash
    };
  });
  if (overviewJumpResult.hash !== overviewJumpHref) throw new Error(`Experience overview click did not update the hash: ${overviewJumpResult.hash}`);
  if (Math.abs(overviewJumpResult.center - overviewJumpResult.viewportCenter) > 460) {
    throw new Error("Experience overview click did not move the matching Experience step into view");
  }

'''
smoke = replace_once(smoke, desktop_anchor, desktop_checks + desktop_anchor, "desktop overview smoke anchor")

mobile_anchor = '  const mobileExperienceTimeline = await page.evaluate(() => {\n'
mobile_checks = r'''  const mobileExperienceOverviewDisplay = await page.locator("#experienceOverview").evaluate((element) => getComputedStyle(element).display);
  if (mobileExperienceOverviewDisplay !== "none") throw new Error(`Experience overview should be hidden on mobile, got display=${mobileExperienceOverviewDisplay}`);

'''
smoke = replace_once(smoke, mobile_anchor, mobile_checks + mobile_anchor, "mobile overview smoke anchor")
smoke_path.write_text(smoke)
