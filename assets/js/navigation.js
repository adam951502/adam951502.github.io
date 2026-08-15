import { createMobileMenuController } from "./mobile-menu.js";

export function createNavigationController({ prefersReducedMotion, closeLanguageMenu }) {
  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
  const brandLink = document.querySelector(".brand");
  const backToTop = document.getElementById("backToTop");
  const siteHeader = document.querySelector(".site-header");
  const siteFooter = document.querySelector(".footer");
  const mobileMenuController = createMobileMenuController({ closeLanguageMenu });
  const { closeMobileMenu } = mobileMenuController;

  const navSections = navLinks
    .map((link) => {
      const selector = link.getAttribute("href");
      if (!selector?.startsWith("#")) return null;
      const target = document.querySelector(selector);
      if (!target) return null;
      return { link, target };
    })
    .filter(Boolean);

  function smoothScrollTo(target) {
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }

  function highlightSection() {
    const scrollPosition = window.scrollY + 180;
    let activeLink = null;

    navSections.forEach(({ link, target }) => {
      const top = target.offsetTop;
      const bottom = top + target.offsetHeight;
      if (scrollPosition >= top && scrollPosition < bottom) activeLink = link;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link === activeLink);
    });
  }

  function handleScroll() {
    siteHeader?.classList.toggle("scrolled", window.scrollY > 10);
    highlightSection();
    if (backToTop) {
      const footerVisible = siteFooter && siteFooter.getBoundingClientRect().top < window.innerHeight - 12;
      backToTop.hidden = window.scrollY < 260 || footerVisible;
    }
  }

  function bind() {
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";
        if (!href.startsWith("#")) {
          closeMobileMenu();
          return;
        }

        event.preventDefault();
        const target = document.querySelector(href);
        closeMobileMenu();
        smoothScrollTo(target);
      });
    });

    brandLink?.addEventListener("click", (event) => {
      event.preventDefault();
      closeMobileMenu();
      smoothScrollTo(document.querySelector("#hero"));
    });

    backToTop?.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });

    mobileMenuController.bind();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  return { bind, closeMobileMenu, handleScroll, highlightSection };
}
