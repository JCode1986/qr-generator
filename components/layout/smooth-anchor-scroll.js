"use client";

import { useEffect } from "react";
import { scrollToHash } from "@/lib/smooth-scroll";

function getAnchorFromEvent(event) {
  const path = event.composedPath?.() || [];
  const pathAnchor = path.find(
    (item) => item instanceof HTMLAnchorElement && item.href.includes("#"),
  );

  if (pathAnchor) {
    return pathAnchor;
  }

  if (event.target instanceof Element) {
    return event.target.closest('a[href*="#"]');
  }

  return null;
}

export function SmoothAnchorScroll() {
  useEffect(() => {
    function handleClick(event) {
      const anchor = getAnchorFromEvent(event);

      if (!anchor) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      ) {
        return;
      }

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));

      if (!target) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      scrollToHash(url.hash);
    }

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return null;
}
