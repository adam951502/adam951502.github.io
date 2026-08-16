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

function getTimelineRange(experienceData, translateFn) {
  const years = experienceData.flatMap((item) =>
    Array.from(String(translateFn(item.datesKey) || "").matchAll(/(?:19|20)\d{2}/g), (match) => Number.parseInt(match[0], 10))
  );
  if (!years.length) return "";
  return `${Math.min(...years)}–${Math.max(...years)}`;
}

function renderExperienceSpan({ experienceData, translateFn }) {
  const container = document.getElementById("experienceSpan");
  if (!container) return;
  container.innerHTML = "";

  const span = createElement("div", "experience-span");
  span.setAttribute("aria-label", translateFn("experience.span.label") || "Career span");

  const content = createElement("span", "experience-span__content");
  content.append(
    createElement("span", "experience-span__range", getTimelineRange(experienceData, translateFn)),
    createElement("span", "experience-span__separator", "·"),
    createElement("span", "experience-span__count", `${experienceData.length} ${translateFn("experience.span.roles") || "roles"}`)
  );

  span.appendChild(content);
  container.appendChild(span);
}

export function renderExperience({ experienceData, translateFn, registerReveal }) {
  const container = document.getElementById("experienceList");
  if (!container) return;

  renderExperienceSpan({ experienceData, translateFn });
  container.innerHTML = "";

  experienceData.forEach((item, index) => {
    const step = createElement("div", `experience-step reveal-target${index === 0 ? " experience-step-latest" : ""}`);
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

# Add only the small localized career-span labels.
for language, values in {
    "en": {
        "experience.span.label": "Career span",
        "experience.span.roles": "roles",
    },
    "zh": {
        "experience.span.label": "職涯跨度",
        "experience.span.roles": "段經歷",
    },
}.items():
    path = Path(f"assets/i18n/{language}.json")
    data = json.loads(path.read_text())
    data.update(values)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")

# Add a generated career-span region to the static fallback.
build_path = Path("scripts/build-content.mjs")
build = build_path.read_text()
period_fn = '''function getTimelinePeriod(value = "") {
  return String(value).split("|")[0].trim();
}
'''
span_helpers = period_fn + r'''
function getTimelineRange(items) {
  const years = items.flatMap((item) =>
    Array.from(String(translate(item.datesKey)).matchAll(/(?:19|20)\d{2}/g), (match) => Number.parseInt(match[0], 10))
  );
  if (!years.length) return "";
  return `${Math.min(...years)}–${Math.max(...years)}`;
}

function renderExperienceSpan() {
  return `        <div class="experience-span" aria-label="${escapeHtml(translate("experience.span.label", "Career span"))}">
          <span class="experience-span__content">
            <span class="experience-span__range">${escapeHtml(getTimelineRange(experience))}</span>
            <span class="experience-span__separator">·</span>
            <span class="experience-span__count">${experience.length} ${escapeHtml(translate("experience.span.roles", "roles"))}</span>
          </span>
        </div>`;
}
'''
build = replace_once(build, period_fn, span_helpers, "timeline helper insertion")

old_constants = 'const EXPERIENCE_START = "      <!-- GENERATED EXPERIENCE START -->";\nconst EXPERIENCE_END = "      <!-- GENERATED EXPERIENCE END -->";'
new_constants = 'const EXPERIENCE_SPAN_START = "      <!-- GENERATED EXPERIENCE SPAN START -->";\nconst EXPERIENCE_SPAN_END = "      <!-- GENERATED EXPERIENCE SPAN END -->";\nconst EXPERIENCE_START = "      <!-- GENERATED EXPERIENCE START -->";\nconst EXPERIENCE_END = "      <!-- GENERATED EXPERIENCE END -->";'
build = replace_once(build, old_constants, new_constants, "Experience constants")

old_build_region = '''  html = replaceGeneratedRegion(html, {
    emptyContainer: '<div class="timeline" id="experienceList" role="list"></div>',
    startMarker: EXPERIENCE_START,
    endMarker: EXPERIENCE_END,
    generated: renderExperience()
  });'''
new_build_region = '''  html = replaceGeneratedRegion(html, {
    emptyContainer: '<div id="experienceSpan"></div>',
    startMarker: EXPERIENCE_SPAN_START,
    endMarker: EXPERIENCE_SPAN_END,
    generated: renderExperienceSpan()
  });
  html = replaceGeneratedRegion(html, {
    emptyContainer: '<div class="timeline" id="experienceList" role="list"></div>',
    startMarker: EXPERIENCE_START,
    endMarker: EXPERIENCE_END,
    generated: renderExperience()
  });'''
build = replace_once(build, old_build_region, new_build_region, "Experience build region")
build_path.write_text(build)

# Add an empty span shell; build:content will populate the fallback from canonical data.
index_path = Path("index.html")
html = index_path.read_text()
needle = '      <div class="timeline" id="experienceList" role="list">'
html = replace_once(html, needle, '      <div id="experienceSpan"></div>\n' + needle, "Experience span shell")
index_path.write_text(html)

# Keep styling intentionally minimal: a single quiet meta line above the detailed timeline.
style_path = Path("assets/css/style.css")
css = style_path.read_text()
span_css = r'''

/* Experience career span: intentionally quieter than the detailed timeline. */
#experienceSpan {
  margin: -2px 0 26px;
}

.experience-span {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--muted-soft);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.experience-span::before,
.experience-span::after {
  content: "";
  width: clamp(34px, 7vw, 86px);
  height: 1px;
  background: var(--border-strong);
  opacity: 0.7;
}

.experience-span__content {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
}

.experience-span__range {
  color: var(--text);
  font-weight: 700;
}

.experience-span__separator {
  color: var(--accent);
}

@media (max-width: 760px) {
  #experienceSpan {
    margin-bottom: 20px;
  }

  .experience-span {
    gap: 8px;
    font-size: 0.68rem;
    letter-spacing: 0.06em;
  }

  .experience-span::before,
  .experience-span::after {
    width: 24px;
  }
}
'''
style_path.write_text(css.rstrip() + span_css + "\n")

# Replace the removed overview regression with a compact span regression.
smoke_path = Path("scripts/smoke-runtime.mjs")
smoke = smoke_path.read_text()
anchor = '''  if (initial.experiences !== 10) throw new Error(`Expected 10 experience entries, got ${initial.experiences}`);
  if (initial.lang !== "en") throw new Error(`Expected initial lang=en, got ${initial.lang}`);'''
checks = '''  if (initial.experiences !== 10) throw new Error(`Expected 10 experience entries, got ${initial.experiences}`);

  const experienceSpan = await page.evaluate(() => ({
    overviewCount: document.querySelectorAll(".experience-overview").length,
    range: document.querySelector(".experience-span__range")?.textContent?.trim() || "",
    count: document.querySelector(".experience-span__count")?.textContent?.trim() || "",
    display: document.querySelector(".experience-span") ? getComputedStyle(document.querySelector(".experience-span")).display : "none"
  }));
  if (experienceSpan.overviewCount !== 0) throw new Error("Complex Experience overview timeline still exists");
  if (experienceSpan.range !== "2012–2025") throw new Error(`Unexpected Experience career span: ${experienceSpan.range}`);
  if (experienceSpan.count !== "10 roles") throw new Error(`Unexpected Experience role count: ${experienceSpan.count}`);
  if (experienceSpan.display === "none") throw new Error("Experience career span is hidden on desktop");

  if (initial.lang !== "en") throw new Error(`Expected initial lang=en, got ${initial.lang}`);'''
smoke = replace_once(smoke, anchor, checks, "desktop Experience span smoke")

mobile_anchor = '''  if (!mobileExperienceTimeline.valid) throw new Error("Mobile Experience timeline is missing");
  if (mobileExperienceTimeline.overflow) throw new Error("Mobile Experience timeline causes horizontal overflow");'''
mobile_checks = '''  if (!mobileExperienceTimeline.valid) throw new Error("Mobile Experience timeline is missing");
  if (mobileExperienceTimeline.overflow) throw new Error("Mobile Experience timeline causes horizontal overflow");
  const mobileExperienceSpan = await page.evaluate(() => ({
    display: document.querySelector(".experience-span") ? getComputedStyle(document.querySelector(".experience-span")).display : "none",
    right: document.querySelector(".experience-span")?.getBoundingClientRect().right || 0,
    viewport: window.innerWidth
  }));
  if (mobileExperienceSpan.display === "none") throw new Error("Experience career span is hidden on mobile");
  if (mobileExperienceSpan.right > mobileExperienceSpan.viewport + 1) throw new Error("Experience career span escapes the mobile viewport");'''
smoke = replace_once(smoke, mobile_anchor, mobile_checks, "mobile Experience span smoke")
smoke_path.write_text(smoke)
