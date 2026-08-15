export function createMobileMenuController({ closeLanguageMenu = () => {} } = {}) {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const siteHeader = document.querySelector(".site-header");
  const mobileMenuQuery = window.matchMedia("(max-width: 1180px)");

  function closeMobileMenu({ restoreFocus = false } = {}) {
    if (!mobileMenuToggle || !siteHeader) return;
    siteHeader.classList.remove("menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    const icon = mobileMenuToggle.querySelector("i");
    if (icon) icon.className = "ri-menu-3-line";
    if (restoreFocus) mobileMenuToggle.focus();
  }

  function openMobileMenu() {
    if (!mobileMenuToggle || !siteHeader) return;
    closeLanguageMenu();
    siteHeader.classList.add("menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    const icon = mobileMenuToggle.querySelector("i");
    if (icon) icon.className = "ri-close-line";
  }

  function bind() {
    mobileMenuToggle?.addEventListener("click", () => {
      const isOpen = mobileMenuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    document.addEventListener("click", (event) => {
      if (siteHeader?.classList.contains("menu-open") && !siteHeader.contains(event.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && siteHeader?.classList.contains("menu-open")) {
        closeMobileMenu({ restoreFocus: true });
      }
    });

    mobileMenuQuery.addEventListener("change", (event) => {
      if (!event.matches) closeMobileMenu();
    });
  }

  return { bind, closeMobileMenu, openMobileMenu };
}
