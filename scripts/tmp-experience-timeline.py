from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


# Runtime renderer: wrap each card in a timeline step with a central marker.
experience_js = '''import { createElement, formatIndex, setSafeTranslatedMarkup } from "./shared.js";

function getTimelinePeriod(value = "") {
  return String(value).split("|")[0].trim();
}

export function renderExperience({ experienceData, translateFn, registerReveal }) {
  const container = document.getElementById("experienceList");
  if (!container) return;

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

# Generated no-JS fallback: match the runtime DOM structure.
build_path = Path("scripts/build-content.mjs")
build = build_path.read_text()
start = build.index("function renderExperience() {")
end = build.index("\nfunction renderStringList", start)
new_render = '''function getTimelinePeriod(value = "") {
  return String(value).split("|")[0].trim();
}

function renderExperience() {
  return experience.map((item, index) => {
    const listItems = parseTranslatedList(translate(item.listKey), item.listKey);
    const icon = item.pillIcon
      ? `<span class="icon-badge small"><i class="${escapeHtml(item.pillIcon)}" aria-hidden="true"></i></span>`
      : "";
    const period = getTimelinePeriod(translate(item.datesKey));
    return `      <div class="experience-step${index === 0 ? " experience-step-latest" : ""}" role="listitem">
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
${listItems.map((entry) => `                <li>${escapeHtml(entry)}</li>`).join("\\n")}
              </ul>
            </details>
          </div>
        </details>
      </div>`;
  }).join("\\n");
}
'''
build = build[:start] + new_render + build[end:]
# The generated region's container now carries list semantics.
build = build.replace('emptyContainer: \'<div class="timeline" id="experienceList"></div>\'', 'emptyContainer: \'<div class="timeline" id="experienceList" role="list"></div>\'', 1)
build_path.write_text(build)

# Ensure the existing index container has list semantics before regeneration.
index_path = Path("index.html")
html = index_path.read_text()
html = html.replace('<div class="timeline" id="experienceList">', '<div class="timeline" id="experienceList" role="list">', 1)
index_path.write_text(html)

# Add responsive alternating-timeline design at the end of the stylesheet so it overrides the old stacked layout cleanly.
css_path = Path("assets/css/style.css")
css = css_path.read_text()
marker = "/* Issue #47: responsive alternating Experience timeline */"
if marker in css:
    raise SystemExit("Experience timeline CSS already exists")
css += r'''

/* Issue #47: responsive alternating Experience timeline */
#experienceList.timeline {
  position: relative;
  display: grid;
  gap: 28px;
  padding: 12px 0;
}

#experienceList.timeline::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--accent-2), var(--accent), var(--border-strong));
  transform: translateX(-50%);
  opacity: 0.72;
}

.experience-step {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px minmax(0, 1fr);
  align-items: start;
  min-width: 0;
}

.experience-step::after {
  content: "";
  position: absolute;
  top: 34px;
  z-index: 0;
  width: 70px;
  height: 1px;
  background: var(--border-strong);
}

.experience-step:nth-child(odd)::after {
  right: 50%;
}

.experience-step:nth-child(even)::after {
  left: 50%;
}

.experience-marker {
  position: relative;
  z-index: 2;
  grid-column: 2;
  grid-row: 1;
  display: grid;
  justify-items: center;
  gap: 9px;
  padding-top: 24px;
}

.experience-dot {
  width: 21px;
  height: 21px;
  border: 6px solid var(--bg);
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 1px var(--border-strong), 0 6px 18px rgba(82, 60, 40, 0.16);
}

.experience-period {
  width: max-content;
  max-width: 108px;
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--panel-strong);
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  line-height: 1.15;
  text-align: center;
}

.experience-card {
  position: relative;
  z-index: 1;
  grid-row: 1;
  width: min(100%, 520px);
  min-width: 0;
  padding: 22px;
}

.experience-step:nth-child(odd) .experience-card {
  grid-column: 1;
  justify-self: end;
  margin-right: 14px;
}

.experience-step:nth-child(even) .experience-card {
  grid-column: 3;
  justify-self: start;
  margin-left: 14px;
}

.experience-step-latest .experience-dot {
  background: var(--accent-2);
  box-shadow: 0 0 0 1px var(--accent-2), 0 0 0 6px var(--accent-soft-2);
}

.experience-step-latest .experience-period {
  border-color: var(--border-strong);
  color: var(--accent-2);
}

.experience-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-soft);
}

@media (max-width: 900px) {
  .experience-step {
    grid-template-columns: minmax(0, 1fr) 86px minmax(0, 1fr);
  }

  .experience-step::after {
    width: 57px;
  }

  .experience-period {
    max-width: 86px;
    font-size: 0.59rem;
  }

  .experience-card {
    padding: 18px;
  }

  .experience-card summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  #experienceList.timeline {
    gap: 20px;
    padding: 4px 0;
  }

  #experienceList.timeline::before {
    left: 10px;
    width: 1px;
    transform: none;
  }

  .experience-step {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 14px;
    align-items: start;
  }

  .experience-step::after,
  .experience-step:nth-child(odd)::after,
  .experience-step:nth-child(even)::after {
    top: 31px;
    right: auto;
    left: 10px;
    width: 32px;
  }

  .experience-marker {
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
    width: 21px;
    padding-top: 21px;
  }

  .experience-period {
    display: none;
  }

  .experience-card,
  .experience-step:nth-child(odd) .experience-card,
  .experience-step:nth-child(even) .experience-card {
    grid-column: 2;
    grid-row: 1;
    width: 100%;
    margin: 0;
    justify-self: stretch;
  }

  .experience-card summary {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .experience-card .timeline-head {
    gap: 10px;
  }

  .experience-card .timeline-index {
    min-width: 30px;
  }
}
'''
css_path.write_text(css)

# Browser regression: assert desktop alternating geometry and mobile single-axis behavior.
smoke_path = Path("scripts/smoke-runtime.mjs")
smoke = smoke_path.read_text()
anchor = '  if (initial.theme !== "light") throw new Error(`Expected initial theme=light, got ${initial.theme}`);\n\n'
checks = r'''  const desktopExperienceTimeline = await page.evaluate(() => {
    const timeline = document.getElementById("experienceList");
    const steps = Array.from(document.querySelectorAll("#experienceList .experience-step"));
    if (!timeline) return { valid: false, steps: [] };
    const timelineRect = timeline.getBoundingClientRect();
    const axisX = timelineRect.left + timelineRect.width / 2;
    return {
      valid: true,
      axisX,
      steps: steps.map((step, index) => {
        const card = step.querySelector(".experience-card");
        const dot = step.querySelector(".experience-dot");
        const period = step.querySelector(".experience-period");
        const cardRect = card?.getBoundingClientRect();
        const dotRect = dot?.getBoundingClientRect();
        return {
          index,
          cardLeft: cardRect?.left ?? 0,
          cardRight: cardRect?.right ?? 0,
          dotCenter: dotRect ? dotRect.left + dotRect.width / 2 : 0,
          period: period?.textContent?.trim() || ""
        };
      })
    };
  });
  if (!desktopExperienceTimeline.valid) throw new Error("Experience timeline is missing");
  if (desktopExperienceTimeline.steps.length !== 10) throw new Error(`Expected 10 Experience timeline steps, got ${desktopExperienceTimeline.steps.length}`);
  for (const step of desktopExperienceTimeline.steps) {
    if (!step.period) throw new Error(`Experience step ${step.index + 1} is missing its period marker`);
    if (Math.abs(step.dotCenter - desktopExperienceTimeline.axisX) > 1.5) {
      throw new Error(`Experience step ${step.index + 1} dot is not centered on the desktop axis`);
    }
    if (step.index % 2 === 0 && step.cardRight >= desktopExperienceTimeline.axisX) {
      throw new Error(`Experience step ${step.index + 1} should be on the left side of the desktop axis`);
    }
    if (step.index % 2 === 1 && step.cardLeft <= desktopExperienceTimeline.axisX) {
      throw new Error(`Experience step ${step.index + 1} should be on the right side of the desktop axis`);
    }
  }

'''
smoke = replace_once(smoke, anchor, anchor + checks, "desktop experience smoke anchor")

mobile_anchor = '  await page.setViewportSize({ width: 390, height: 844 });\n  const mobileAffiliationMetrics = await page.evaluate(() => {'
mobile_checks = r'''  await page.setViewportSize({ width: 390, height: 844 });
  const mobileExperienceTimeline = await page.evaluate(() => {
    const timeline = document.getElementById("experienceList");
    const steps = Array.from(document.querySelectorAll("#experienceList .experience-step"));
    if (!timeline) return { valid: false, steps: [], overflow: true };
    const timelineRect = timeline.getBoundingClientRect();
    const axisX = timelineRect.left + 10;
    return {
      valid: true,
      axisX,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      steps: steps.map((step, index) => {
        const card = step.querySelector(".experience-card");
        const dot = step.querySelector(".experience-dot");
        const cardRect = card?.getBoundingClientRect();
        const dotRect = dot?.getBoundingClientRect();
        return {
          index,
          cardLeft: cardRect?.left ?? 0,
          cardRight: cardRect?.right ?? 0,
          dotCenter: dotRect ? dotRect.left + dotRect.width / 2 : 0
        };
      })
    };
  });
  if (!mobileExperienceTimeline.valid) throw new Error("Mobile Experience timeline is missing");
  if (mobileExperienceTimeline.overflow) throw new Error("Mobile Experience timeline causes horizontal overflow");
  for (const step of mobileExperienceTimeline.steps) {
    if (Math.abs(step.dotCenter - mobileExperienceTimeline.axisX) > 1.5) {
      throw new Error(`Experience step ${step.index + 1} dot is not aligned to the mobile left axis`);
    }
    if (step.cardLeft <= mobileExperienceTimeline.axisX) {
      throw new Error(`Experience step ${step.index + 1} card is not to the right of the mobile axis`);
    }
    if (step.cardRight > window.innerWidth + 1) {
      throw new Error(`Experience step ${step.index + 1} card escapes the mobile viewport`);
    }
  }

  const mobileAffiliationMetrics = await page.evaluate(() => {'''
smoke = replace_once(smoke, mobile_anchor, mobile_checks, "mobile experience smoke anchor")
smoke_path.write_text(smoke)
