let activeScrollFrame = 0;
let restoreScrollBehavior = null;

function cancelActiveScroll() {
  if (activeScrollFrame) {
    window.cancelAnimationFrame(activeScrollFrame);
    activeScrollFrame = 0;
  }

  if (restoreScrollBehavior) {
    restoreScrollBehavior();
    restoreScrollBehavior = null;
  }
}

export function getFixedHeaderOffset() {
  const headerHeight = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-height")
    .trim();
  const parsedHeight = Number.parseFloat(headerHeight);

  if (!Number.isFinite(parsedHeight)) {
    return 76;
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

  const reduceMotion =
    options.respectReducedMotion !== false &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const startTop = window.scrollY;
  const top = Math.max(
    target.getBoundingClientRect().top + window.scrollY - getFixedHeaderOffset(),
    0,
  );
  const distance = top - startTop;

  cancelActiveScroll();

  if (reduceMotion || Math.abs(distance) < 2) {
    window.scrollTo({ top, behavior: "auto" });
  } else {
    const duration = options.duration || 620;
    const startedAt = window.performance.now();
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";
    restoreScrollBehavior = () => {
      root.style.scrollBehavior = previousScrollBehavior;
    };

    function easeOutCubic(value) {
      return 1 - Math.pow(1 - value, 3);
    }

    function step(timestamp) {
      const elapsed = timestamp - startedAt;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo({
        top: startTop + distance * easeOutCubic(progress),
        behavior: "auto",
      });

      if (progress < 1) {
        activeScrollFrame = window.requestAnimationFrame(step);
      } else {
        restoreScrollBehavior?.();
        restoreScrollBehavior = null;
        activeScrollFrame = 0;
      }
    }

    activeScrollFrame = window.requestAnimationFrame(step);
  }

  if (options.updateHash !== false && window.history?.pushState) {
    window.history.pushState(null, "", `#${id}`);
  }

  return true;
}
