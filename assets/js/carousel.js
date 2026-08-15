export function createCarouselController({
  prefersReducedMotion,
  getTranslate,
  licenseButtons,
  licenseCards,
  licenseCarousel,
  licenseGrid,
  licenseViewport,
  licensePrev,
  licenseNext,
  licenseViewToggle,
  licenseViewToggleText,
  licenseDots
}) {
  let currentLicenseFilter = "all";
  let currentLicenseIndex = 0;
  let licenseExpanded = false;
  let licenseTouchStartX = null;
  let licenseResizeFrame = null;
  let licenseDragPointerId = null;
  let licenseDragStartX = 0;
  let licenseDragBaseOffset = 0;
  let licenseDragDeltaX = 0;
  let licenseDragging = false;
  let licenseSuppressClick = false;
  let licenseWheelAccumulator = 0;
  let licenseWheelGestureActive = false;
  let licenseWheelResetTimer = null;
  let licenseTrackSignature = "";
  let licenseTrackPrependCount = 0;
  let licenseLoopResetIndex = null;
  let licenseLoopResetTimer = null;

  function getFilteredLicenseCards() {
    return licenseCards.filter((card) => !card.hidden);
  }

  function getLicenseItemsPerView() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  }

  function getLicenseText(key, fallback) {
    const value = getTranslate()(key);
    return value && value !== key ? value : fallback;
  }

  function normalizeLicenseIndex(index, total) {
    return total ? ((index % total) + total) % total : 0;
  }

  function getLicenseCarouselState() {
    const cards = getFilteredLicenseCards();
    const itemsPerView = Math.min(getLicenseItemsPerView(), Math.max(cards.length, 1));
    const canMove = !licenseExpanded && cards.length > itemsPerView;
    return { cards, itemsPerView, canMove };
  }

  function createLicenseClone(card) {
    const clone = card.cloneNode(true);
    clone.hidden = false;
    clone.dataset.licenseClone = "true";
    delete clone.dataset.licenseCategory;
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a, button").forEach((element) => element.setAttribute("tabindex", "-1"));
    return clone;
  }

  function rebuildLicenseTrack(cards, itemsPerView, canMove, forceRebuild = false) {
    const cardSignature = cards.map((card) => licenseCards.indexOf(card)).join("-");
    const nextSignature = `${licenseExpanded ? "expanded" : "carousel"}:${itemsPerView}:${cardSignature}`;
    if (!forceRebuild && nextSignature === licenseTrackSignature) return false;

    licenseGrid.querySelectorAll("[data-license-clone]").forEach((clone) => clone.remove());
    licenseTrackPrependCount = 0;

    if (canMove) {
      const prependFragment = document.createDocumentFragment();
      cards.slice(-itemsPerView).forEach((card) => prependFragment.appendChild(createLicenseClone(card)));
      licenseTrackPrependCount = itemsPerView;
      licenseGrid.insertBefore(prependFragment, licenseGrid.firstChild);
      cards.slice(0, itemsPerView).forEach((card) => licenseGrid.appendChild(createLicenseClone(card)));
    }

    licenseTrackSignature = nextSignature;
    return true;
  }

  function getVisibleLicenseTrackCards() {
    return Array.from(licenseGrid.querySelectorAll(".license:not([hidden])"));
  }

  function getLicenseTrackCard(logicalIndex) {
    return getVisibleLicenseTrackCards()[licenseTrackPrependCount + logicalIndex] || null;
  }

  function setLicenseTrackPosition(logicalIndex, animate = true) {
    const target = getLicenseTrackCard(logicalIndex);
    const offset = target ? target.offsetLeft : 0;
    const shouldAnimate = animate && !prefersReducedMotion;

    if (!shouldAnimate) {
      licenseViewport?.classList.add("is-resetting");
      licenseGrid.style.transform = `translate3d(-${offset}px, 0, 0)`;
      licenseGrid.getBoundingClientRect();
      licenseViewport?.classList.remove("is-resetting");
      return;
    }

    licenseGrid.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }

  function renderLicenseDots(positionCount, activeIndex) {
    if (!licenseDots) return;
    licenseDots.innerHTML = "";
    const dotLabel = getLicenseText("licenses.dotLabel", "Go to certification position");

    for (let index = 0; index < positionCount; index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "license-dot";
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-label", `${dotLabel} ${index + 1}`);
      if (index === activeIndex) dot.setAttribute("aria-current", "true");
      dot.addEventListener("click", () => {
        finishLicenseLoopReset();
        currentLicenseIndex = index;
        update({ animate: true });
      });
      licenseDots.appendChild(dot);
    }
  }

  function finishLicenseLoopReset() {
    if (licenseLoopResetIndex === null) return;
    window.clearTimeout(licenseLoopResetTimer);
    currentLicenseIndex = licenseLoopResetIndex;
    licenseLoopResetIndex = null;
    update({ animate: false });
  }

  function queueLicenseLoopReset() {
    window.clearTimeout(licenseLoopResetTimer);
    if (licenseLoopResetIndex === null) return;
    if (prefersReducedMotion) {
      requestAnimationFrame(finishLicenseLoopReset);
      return;
    }
    licenseLoopResetTimer = window.setTimeout(finishLicenseLoopReset, 480);
  }

  function update({ animate = true, forceRebuild = false } = {}) {
    if (!licenseCarousel || !licenseGrid) return;

    const { cards, itemsPerView, canMove } = getLicenseCarouselState();
    const rebuilt = rebuildLicenseTrack(cards, itemsPerView, canMove, forceRebuild);
    if (!canMove) {
      currentLicenseIndex = 0;
      licenseLoopResetIndex = null;
    } else if (licenseLoopResetIndex === null) {
      currentLicenseIndex = normalizeLicenseIndex(currentLicenseIndex, cards.length);
    }
    const activeIndex = normalizeLicenseIndex(currentLicenseIndex, cards.length);

    licenseCarousel.classList.toggle("is-expanded", licenseExpanded);
    licenseCarousel.classList.toggle("is-single", cards.length === 1);
    licenseCarousel.classList.toggle("is-double", cards.length === 2);
    licenseCarousel.classList.toggle("is-static", !canMove);

    if (licenseExpanded) {
      licenseGrid.style.transform = "none";
    } else {
      setLicenseTrackPosition(currentLicenseIndex, animate && !rebuilt);
    }

    renderLicenseDots(canMove ? cards.length : 1, canMove ? activeIndex : 0);
    if (licensePrev) licensePrev.disabled = !canMove;
    if (licenseNext) licenseNext.disabled = !canMove;

    const trackCards = getVisibleLicenseTrackCards();
    const physicalStart = licenseTrackPrependCount + currentLicenseIndex;
    licenseGrid.querySelectorAll(".license").forEach((card) => {
      const physicalIndex = trackCards.indexOf(card);
      const isInCurrentView = physicalIndex >= physicalStart && physicalIndex < physicalStart + itemsPerView;
      const isAccessible = !card.hidden && (licenseExpanded ? !card.dataset.licenseClone : isInCurrentView);
      card.setAttribute("aria-hidden", String(!isAccessible));
      card.querySelectorAll("a, button").forEach((element) => {
        if (isAccessible) element.removeAttribute("tabindex");
        else element.setAttribute("tabindex", "-1");
      });
    });

    if (licenseViewport) licenseViewport.tabIndex = licenseExpanded ? -1 : 0;
    if (licenseViewToggle) licenseViewToggle.setAttribute("aria-expanded", String(licenseExpanded));
    if (licenseViewToggleText) {
      const key = licenseExpanded ? "licenses.collapseAll" : "licenses.expandAll";
      const fallback = licenseExpanded ? "Return to carousel" : "View all certifications";
      licenseViewToggleText.dataset.i18n = key;
      licenseViewToggleText.textContent = getLicenseText(key, fallback);
    }
    const toggleIcon = licenseViewToggle?.querySelector("i");
    if (toggleIcon) toggleIcon.className = licenseExpanded ? "ri-slideshow-3-line" : "ri-grid-line";
    queueLicenseLoopReset();
  }

  function getLicenseDragMetrics() {
    const { cards, itemsPerView, canMove } = getLicenseCarouselState();
    const minimumIndex = canMove ? -1 : 0;
    const maximumIndex = canMove ? cards.length : 0;
    return {
      cards,
      itemsPerView,
      canMove,
      minimumIndex,
      maximumIndex,
      currentOffset: getLicenseTrackCard(currentLicenseIndex)?.offsetLeft || 0,
      minOffset: getLicenseTrackCard(minimumIndex)?.offsetLeft || 0,
      maxOffset: getLicenseTrackCard(maximumIndex)?.offsetLeft || 0
    };
  }

  function getLicenseTrackTranslateX() {
    const transform = getComputedStyle(licenseGrid).transform;
    if (!transform || transform === "none") return 0;
    const values = transform
      .slice(transform.indexOf("(") + 1, transform.lastIndexOf(")"))
      .split(",")
      .map(Number);
    return transform.startsWith("matrix3d") ? values[12] || 0 : values[4] || 0;
  }

  function finishLicenseDrag(event, cancelled = false) {
    if (licenseDragPointerId === null || event.pointerId !== licenseDragPointerId) return;

    const pointerId = licenseDragPointerId;
    const wasDragging = licenseDragging;
    const draggedOffset = licenseDragBaseOffset - licenseDragDeltaX;
    licenseDragPointerId = null;
    licenseDragging = false;
    licenseViewport?.classList.remove("is-dragging");
    if (licenseViewport?.hasPointerCapture(pointerId)) licenseViewport.releasePointerCapture(pointerId);

    if (wasDragging && !cancelled) {
      const { cards, minimumIndex, maximumIndex } = getLicenseDragMetrics();
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (let index = minimumIndex; index <= maximumIndex; index += 1) {
        const target = getLicenseTrackCard(index);
        if (!target) continue;
        const distance = Math.abs(target.offsetLeft - draggedOffset);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      }
      currentLicenseIndex = nearestIndex;
      licenseLoopResetIndex = nearestIndex < 0
        ? cards.length - 1
        : nearestIndex >= cards.length ? 0 : null;
      licenseSuppressClick = true;
      window.setTimeout(() => {
        licenseSuppressClick = false;
      }, 0);
    }

    licenseDragDeltaX = 0;
    update({ animate: wasDragging });
  }

  function move(direction) {
    if (licenseExpanded) return;
    finishLicenseLoopReset();
    const { cards, canMove } = getLicenseCarouselState();
    if (!canMove) return;
    const activeIndex = normalizeLicenseIndex(currentLicenseIndex, cards.length);

    if (direction > 0) {
      currentLicenseIndex = activeIndex + 1;
      licenseLoopResetIndex = currentLicenseIndex >= cards.length ? 0 : null;
    } else {
      currentLicenseIndex = activeIndex - 1;
      licenseLoopResetIndex = currentLicenseIndex < 0 ? cards.length - 1 : null;
    }
    update({ animate: true });
  }

  function setFilter(category) {
    currentLicenseFilter = category;
    currentLicenseIndex = 0;
    licenseLoopResetIndex = null;
    licenseButtons.forEach((button) => {
      const isActive = button.dataset.licenseFilter === category;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    licenseCards.forEach((card) => {
      const match = category === "all" || card.dataset.licenseCategory === category;
      card.hidden = !match;
    });
    update({ animate: false, forceRebuild: true });
  }

  function handleResize() {
    if (licenseResizeFrame) cancelAnimationFrame(licenseResizeFrame);
    licenseResizeFrame = requestAnimationFrame(() => {
      licenseResizeFrame = null;
      finishLicenseLoopReset();
      update({ animate: false, forceRebuild: true });
    });
  }

  function bind() {
    licenseButtons.forEach((button) => {
      button.addEventListener("click", () => setFilter(button.dataset.licenseFilter || "all"));
    });
    licensePrev?.addEventListener("click", () => move(-1));
    licenseNext?.addEventListener("click", () => move(1));

    licenseViewToggle?.addEventListener("click", () => {
      finishLicenseLoopReset();
      licenseExpanded = !licenseExpanded;
      currentLicenseIndex = 0;
      licenseLoopResetIndex = null;
      update({ animate: false, forceRebuild: true });
    });

    licenseViewport?.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    });

    licenseViewport?.addEventListener("touchstart", (event) => {
      licenseTouchStartX = event.touches[0]?.clientX ?? null;
    }, { passive: true });

    licenseViewport?.addEventListener("touchend", (event) => {
      if (licenseTouchStartX === null) return;
      const touchEndX = event.changedTouches[0]?.clientX ?? licenseTouchStartX;
      const delta = touchEndX - licenseTouchStartX;
      licenseTouchStartX = null;
      if (Math.abs(delta) >= 44) move(delta < 0 ? 1 : -1);
    }, { passive: true });

    licenseViewport?.addEventListener("pointerdown", (event) => {
      if (licenseExpanded || event.pointerType !== "mouse" || event.button !== 0) return;
      finishLicenseLoopReset();
      const { canMove, currentOffset, minOffset, maxOffset } = getLicenseDragMetrics();
      if (!canMove) return;
      const transformX = getLicenseTrackTranslateX();
      const visualOffset = transformX ? -transformX : currentOffset;
      licenseDragPointerId = event.pointerId;
      licenseDragStartX = event.clientX;
      licenseDragBaseOffset = Math.min(Math.max(visualOffset, minOffset), maxOffset);
      licenseDragDeltaX = 0;
      licenseDragging = false;
      licenseViewport.classList.add("is-dragging");
      licenseGrid.style.transform = `translate3d(-${licenseDragBaseOffset}px, 0, 0)`;
      licenseViewport.setPointerCapture(event.pointerId);
    });

    licenseViewport?.addEventListener("pointermove", (event) => {
      if (event.pointerId !== licenseDragPointerId) return;
      licenseDragDeltaX = event.clientX - licenseDragStartX;
      if (!licenseDragging && Math.abs(licenseDragDeltaX) < 6) return;
      licenseDragging = true;
      event.preventDefault();
      const { minOffset, maxOffset } = getLicenseDragMetrics();
      let nextOffset = licenseDragBaseOffset - licenseDragDeltaX;
      if (nextOffset < minOffset) nextOffset = minOffset + (nextOffset - minOffset) * 0.24;
      if (nextOffset > maxOffset) nextOffset = maxOffset + (nextOffset - maxOffset) * 0.24;
      licenseGrid.style.transform = `translate3d(-${nextOffset}px, 0, 0)`;
    });

    licenseViewport?.addEventListener("pointerup", (event) => finishLicenseDrag(event));
    licenseViewport?.addEventListener("pointercancel", (event) => finishLicenseDrag(event, true));
    licenseViewport?.addEventListener("lostpointercapture", (event) => finishLicenseDrag(event, true));
    licenseGrid?.addEventListener("transitionend", (event) => {
      if (event.propertyName === "transform") finishLicenseLoopReset();
    });

    licenseViewport?.addEventListener("wheel", (event) => {
      if (licenseExpanded) return;
      const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.shiftKey ? event.deltaY : 0;
      if (!horizontalDelta) return;
      event.preventDefault();

      window.clearTimeout(licenseWheelResetTimer);
      licenseWheelResetTimer = window.setTimeout(() => {
        licenseWheelAccumulator = 0;
        licenseWheelGestureActive = false;
      }, 180);

      if (licenseWheelGestureActive) return;
      licenseWheelAccumulator += horizontalDelta;
      if (Math.abs(licenseWheelAccumulator) < 28) return;
      licenseWheelGestureActive = true;
      move(licenseWheelAccumulator > 0 ? 1 : -1);
    }, { passive: false });

    licenseViewport?.addEventListener("click", (event) => {
      if (!licenseSuppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      licenseSuppressClick = false;
    }, true);
  }

  return {
    bind,
    setFilter,
    refreshLanguage: () => setFilter(currentLicenseFilter),
    handleResize
  };
}
