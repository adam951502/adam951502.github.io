import { createElement, formatIndex, setSafeTranslatedMarkup } from "./shared.js";

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
