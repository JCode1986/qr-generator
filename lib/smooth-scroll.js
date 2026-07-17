export function scrollToHash(hash, options = {}) {
  if (!hash || hash === "#") {
    return false;
  }

  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const target = document.getElementById(decodeURIComponent(id));

  if (!target) {
    return false;
  }

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });

  if (options.updateHash !== false && window.history?.pushState) {
    window.history.pushState(null, "", `#${id}`);
  }

  return true;
}
