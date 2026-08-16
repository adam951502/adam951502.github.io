const DEFAULT_SCALE = 100;
const MIN_SCALE = 80;
const MAX_SCALE = 140;
const STORAGE_KEY = "portfolio.affiliationScale";

const BASE_METRICS = {
  desktop: {
    itemMinWidth: 184,
    itemHeight: 88,
    logoMaxWidth: 215,
    logoMaxHeight: 48,
    relationshipMinWidth: 292,
    duration: 42
  },
  mobile: {
    itemMinWidth: 154,
    itemHeight: 72,
    logoMaxWidth: 176,
    logoMaxHeight: 38,
    relationshipMinWidth: 252,
    duration: 38
  }
};

function normalizeScale(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_SCALE;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(parsed / 5) * 5));
}

function safeRead(storage) {
  try {
    return normalizeScale(storage?.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_SCALE;
  }
}

function safeWrite(storage, value) {
  try {
    storage?.setItem(STORAGE_KEY, String(value));
  } catch {
    // Persistence is optional when storage is blocked.
  }
}

function safeRemove(storage) {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // Persistence is optional when storage is blocked.
  }
}

export function createAffiliationScaleController({
  root,
  input,
  output,
  resetButton,
  storage = window.localStorage,
  mobileQuery = window.matchMedia("(max-width: 720px)")
}) {
  let currentScale = DEFAULT_SCALE;
  let isBound = false;

  function metricsForViewport() {
    return mobileQuery.matches ? BASE_METRICS.mobile : BASE_METRICS.desktop;
  }

  function setMetric(name, value, unit = "px") {
    root?.style.setProperty(name, `${value.toFixed(2)}${unit}`);
  }

  function applyScale(value, { persist = false } = {}) {
    if (!root || !input || !output) return DEFAULT_SCALE;

    currentScale = normalizeScale(value);
    const ratio = currentScale / DEFAULT_SCALE;
    const metrics = metricsForViewport();

    setMetric("--affiliation-item-min-width", metrics.itemMinWidth * ratio);
    setMetric("--affiliation-item-height", metrics.itemHeight * ratio);
    setMetric("--affiliation-logo-max-width", metrics.logoMaxWidth * ratio);
    setMetric("--affiliation-logo-max-height", metrics.logoMaxHeight * ratio);
    setMetric("--affiliation-relationship-min-width", metrics.relationshipMinWidth * ratio);
    setMetric("--affiliation-duration", metrics.duration * ratio, "s");

    input.value = String(currentScale);
    input.setAttribute("aria-valuetext", `${currentScale}%`);
    output.value = `${currentScale}%`;
    output.textContent = `${currentScale}%`;

    if (persist) safeWrite(storage, currentScale);
    return currentScale;
  }

  function applyInitial() {
    return applyScale(safeRead(storage));
  }

  function bind() {
    if (isBound || !root || !input || !output) return;
    isBound = true;

    input.addEventListener("input", () => applyScale(input.value, { persist: true }));
    resetButton?.addEventListener("click", () => {
      safeRemove(storage);
      applyScale(DEFAULT_SCALE);
      input.focus();
    });

    mobileQuery.addEventListener?.("change", () => applyScale(currentScale));
  }

  return {
    applyInitial,
    applyScale,
    bind,
    getCurrentScale: () => currentScale,
    storageKey: STORAGE_KEY
  };
}
