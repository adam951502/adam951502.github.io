import { createElement, formatIndex } from "./shared.js";

export function createProjectsController({ filterButtons, getCurrentLang, registerReveal }) {
  let currentProjectFilter = "all";
  let projectCards = [];

  function getProjectContent(project) {
    const lang = getCurrentLang();
    const englishContent = project.content?.en || {};
    const localizedContent = project.content?.[lang] || {};
    return { ...englishContent, ...localizedContent };
  }

  function setFilter(category) {
    currentProjectFilter = category;
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    projectCards.forEach((card) => {
      const match = category === "all" || card.dataset.category === category;
      card.hidden = !match;
    });
  }

  function render(projectsData, translateFn) {
    const container = document.getElementById("projectGrid");
    if (!container) return;

    container.innerHTML = "";
    projectCards = [];

    projectsData.forEach((project, index) => {
      const content = getProjectContent(project);
      const titleText = content.title || project.id;
      const card = createElement("details", "project card-surface reveal-target");
      card.dataset.category = project.category;
      card.dataset.projectId = project.id;

      const summary = createElement("summary", "project-summary");
      const media = createElement("div", "project-media");
      const image = document.createElement("img");
      image.className = "project-img";
      image.src = project.image;
      image.alt = `${titleText} — ${translateFn("projects.imageAlt") || "representative project view"}`;
      if (project.imageFit === "contain") {
        image.classList.add("is-contain");
        image.style.objectFit = "contain";
      }
      image.loading = index < 2 ? "eager" : "lazy";
      image.decoding = "async";
      media.appendChild(image);

      const body = createElement("div", "project-summary-body");
      const kicker = createElement("div", "project-kicker");
      const projectIconWrap = createElement("span", "project-card-icon");
      const projectIcon = createElement("i", project.icon || "ri-layout-grid-line");
      projectIcon.setAttribute("aria-hidden", "true");
      projectIconWrap.appendChild(projectIcon);
      const projectIndex = createElement("span", "project-index", formatIndex(index));
      const pill = createElement("span", "pill", translateFn(project.pillKey) || "");
      const status = createElement("span", "project-status", content.status || "");
      kicker.append(projectIconWrap, projectIndex, pill, status);

      const dates = createElement("p", "label project-dates");
      const dateIcon = createElement("i", "ri-calendar-line");
      dateIcon.setAttribute("aria-hidden", "true");
      dates.append(dateIcon, createElement("span", "", content.dates || ""));
      const title = createElement("h3", "", titleText);
      const desc = createElement("p", "project-desc", content.summary || "");

      const chips = project.chips || [];
      const chipsWrap = createElement("div", "chips project-chips");
      chips.forEach((chip, chipIndex) => {
        const className = chipIndex >= 2 ? "chip project-chip-extra" : "chip";
        chipsWrap.appendChild(createElement("span", className, chip));
      });
      if (chips.length > 2) {
        chipsWrap.appendChild(createElement("span", "chip project-chip-count", `+${chips.length - 2}`));
      }

      const summaryAction = createElement("span", "project-summary-action");
      const summaryActionText = createElement(
        "span",
        "project-summary-action-text",
        translateFn("projects.toggle.open") || "Open case study"
      );
      const summaryActionIcon = createElement("i", "ri-arrow-down-s-line");
      summaryActionIcon.setAttribute("aria-hidden", "true");
      summaryAction.append(summaryActionText, summaryActionIcon);

      body.append(kicker, dates, title, desc, chipsWrap, summaryAction);
      summary.append(media, body);

      const caseBody = createElement("div", "project-case-body");
      const meta = createElement("div", "project-case-meta");
      const createIconLabel = (labelKey, fallback, iconClass, className = "project-detail-label") => {
        const label = createElement("p", className);
        const icon = createElement("i", iconClass);
        icon.setAttribute("aria-hidden", "true");
        label.append(icon, createElement("span", "", translateFn(labelKey) || fallback));
        return label;
      };
      const roleBlock = createElement("div", "project-meta-block");
      roleBlock.append(
        createIconLabel("projects.detail.role", "Role & ownership", "ri-user-star-line"),
        createElement("p", "project-meta-value", content.role || "")
      );
      const statusBlock = createElement("div", "project-meta-block");
      statusBlock.append(
        createIconLabel("projects.detail.status", "Status", "ri-checkbox-circle-line"),
        createElement("p", "project-meta-value", content.status || "")
      );
      meta.append(roleBlock, statusBlock);

      const createList = (items, className = "project-detail-list") => {
        const list = createElement("ul", className);
        (items || []).forEach((item) => list.appendChild(createElement("li", "", item)));
        return list;
      };

      const createSection = (labelKey, fallback, iconClass, className = "project-detail-card") => {
        const section = createElement("section", className);
        const heading = createElement("h4", "project-detail-title");
        const icon = createElement("i", iconClass);
        icon.setAttribute("aria-hidden", "true");
        heading.append(icon, createElement("span", "", translateFn(labelKey) || fallback));
        section.appendChild(heading);
        return section;
      };

      const narrativeGrid = createElement("div", "project-narrative-grid");
      const challengeSection = createSection("projects.detail.challenge", "Problem to solve", "ri-question-line");
      challengeSection.appendChild(createElement("p", "", content.challenge || ""));
      const contributionSection = createSection("projects.detail.contribution", "What I built", "ri-hammer-line");
      contributionSection.appendChild(createList(content.contribution));
      const technicalSection = createSection("projects.detail.technical", "Technical implementation", "ri-code-box-line");
      technicalSection.appendChild(createList(content.technical));
      narrativeGrid.append(challengeSection, contributionSection, technicalSection);

      const architectureSection = createSection(
        "projects.detail.architecture",
        "Architecture path",
        "ri-node-tree",
        "project-architecture-section"
      );
      if (project.architectureImage) {
        const architectureFigure = createElement("figure", "project-architecture-figure");
        const architectureImage = document.createElement("img");
        architectureImage.src = project.architectureImage;
        architectureImage.alt = `${titleText} — ${translateFn("projects.detail.architectureImage") || "technical architecture diagram"}`;
        architectureImage.loading = "lazy";
        architectureImage.decoding = "async";
        architectureFigure.appendChild(architectureImage);
        architectureSection.appendChild(architectureFigure);
      }
      const architectureFlow = createElement("ol", "architecture-flow");
      (content.architecture || []).forEach((step) => {
        const item = createElement("li", "architecture-step");
        item.append(
          createElement("span", "architecture-step-index", formatIndex(architectureFlow.children.length)),
          createElement("strong", "", step.label || ""),
          createElement("p", "", step.detail || "")
        );
        architectureFlow.appendChild(item);
      });
      architectureSection.appendChild(architectureFlow);

      const evidenceGrid = createElement("div", "project-evidence-grid");
      const outcomesSection = createSection("projects.detail.outcomes", "Outcome & evidence", "ri-line-chart-line");
      outcomesSection.appendChild(createList(content.outcomes, "project-outcome-list"));
      evidenceGrid.appendChild(outcomesSection);

      if (project.links && project.links.length) {
        const linksSection = createSection("projects.detail.links", "Project links", "ri-links-line");
        const linksWrap = createElement("div", "project-links");
        project.links.forEach((link) => {
          const anchor = createElement("a", "project-link");
          anchor.href = link.url;
          anchor.target = "_blank";
          anchor.rel = "noopener";
          const linkIcon = createElement("i", link.icon || "ri-external-link-line");
          linkIcon.setAttribute("aria-hidden", "true");
          anchor.append(linkIcon, createElement("span", "", link.label || "View project"));
          linksWrap.appendChild(anchor);
        });
        linksSection.appendChild(linksWrap);
        evidenceGrid.appendChild(linksSection);
      }

      card.addEventListener("toggle", () => {
        const expanded = card.open;
        summaryActionText.textContent = expanded
          ? translateFn("projects.toggle.close") || "Close case study"
          : translateFn("projects.toggle.open") || "Open case study";
        summaryActionIcon.className = expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line";
      });

      caseBody.append(meta, narrativeGrid, architectureSection, evidenceGrid);
      card.append(summary, caseBody);
      container.appendChild(card);
      projectCards.push(card);
    });

    setFilter(currentProjectFilter);
    registerReveal(container.querySelectorAll(".reveal-target"));
  }

  function bind() {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => setFilter(button.dataset.filter || "all"));
    });
  }

  return { bind, render, setFilter };
}
