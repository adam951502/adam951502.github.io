export function createElement(tag, className, textContent) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (typeof textContent === "string") element.textContent = textContent;
  return element;
}

export function setSafeTranslatedMarkup(element, markup) {
  const parsed = new DOMParser().parseFromString(String(markup || ""), "text/html");
  const allowedTags = new Set(["LI", "STRONG", "EM", "CODE", "BR"]);

  const cloneSafeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent || "");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const children = document.createDocumentFragment();
    node.childNodes.forEach((child) => {
      const safeChild = cloneSafeNode(child);
      if (safeChild) children.appendChild(safeChild);
    });

    if (!allowedTags.has(node.tagName)) return children;
    const clone = document.createElement(node.tagName.toLowerCase());
    clone.appendChild(children);
    return clone;
  };

  const fragment = document.createDocumentFragment();
  parsed.body.childNodes.forEach((node) => {
    const safeNode = cloneSafeNode(node);
    if (safeNode) fragment.appendChild(safeNode);
  });
  element.replaceChildren(fragment);
}

export function formatIndex(index) {
  return String(index + 1).padStart(2, "0");
}

export function createRevealController({ prefersReducedMotion }) {
  let revealObserver = null;

  function register(elements) {
    const revealTargets = elements
      ? Array.from(elements)
      : Array.from(document.querySelectorAll(".reveal, .reveal-target, .card, .timeline-card, .skill-card, .license"));

    if (prefersReducedMotion) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.02, rootMargin: "0px 0px -5% 0px" }
      );
    }

    revealTargets.forEach((element) => {
      if (element.dataset.revealBound === "true" || element.classList.contains("is-visible")) return;
      element.dataset.revealBound = "true";
      revealObserver.observe(element);
    });
  }

  return { register };
}
