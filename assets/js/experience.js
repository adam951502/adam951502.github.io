import { createElement, formatIndex, setSafeTranslatedMarkup } from "./shared.js";

function getTimelinePeriod(value = "") {
  return String(value).split("|")[0].trim();
}

function getTimelineRange(experienceData, translateFn) {
  const dates = experienceData.map((item) => String(translateFn(item.datesKey) || ""));
  const years = dates.flatMap((value) =>
    Array.from(value.matchAll(/(?:19|20)\d{2}/g), (match) => Number.parseInt(match[0], 10))
  );
  if (!years.length) return "";
  const ongoingLabel = dates.some((value) => /目前/.test(value))
    ? "目前"
    : dates.some((value) => /\bPresent\b/i.test(value))
      ? "Present"
      : "";
  return `${Math.min(...years)}–${ongoingLabel || Math.max(...years)}`;
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
