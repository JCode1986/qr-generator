export function getFixedHeaderOffset() {
  const headerHeight = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-height")
    .trim();
  const parsedHeight = Number.parseFloat(headerHeight);

  if (!Number.isFinite(parsedHeight)) {
    return 88;
  }

  if (headerHeight.endsWith("px")) {
    return parsedHeight + 16;
  }

  return parsedHeight * 16 + 16;
}

export function scrollToHash(hash, options = {}) {
  if (!hash || hash === "#") {
    return false;
  }

  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const target = document.getElementById(decodeURIComponent(id));

  if (!target) {
    return false;
  }

  const startTop = window.scrollY;
  const targetTop = Math.max(
    target.getBoundingClientRect().top + window.scrollY - getFixedHeaderOffset(),
    0,
  );
  const distance = targetTop - startTop;
  const duration = options.duration || 520;
  const startedAt = window.performance.now();

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function step(timestamp) {
    const elapsed = timestamp - startedAt;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, startTop + distance * easeOutCubic(progress));

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);

  if (options.updateHash !== false && window.history?.pushState) {
    window.history.pushState(null, "", `#${id}`);
  }

  return true;
}
