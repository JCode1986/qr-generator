"use client";

import { useEffect } from "react";
import { scrollToHash } from "@/lib/smooth-scroll";

const pendingHashKey = "quickqr-pending-scroll-hash";

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
    const pendingHash = window.sessionStorage.getItem(pendingHashKey);

    if (!pendingHash) {
      return undefined;
    }

    window.sessionStorage.removeItem(pendingHashKey);

    let attempts = 0;
    let frameId = 0;

    function scrollWhenReady() {
      attempts += 1;

      if (scrollToHash(pendingHash, { respectReducedMotion: false })) {
        return;
      }

      if (attempts < 20) {
        frameId = window.requestAnimationFrame(scrollWhenReady);
      }
    }

    frameId = window.requestAnimationFrame(scrollWhenReady);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollToHash(window.location.hash, {
        respectReducedMotion: false,
        updateHash: false,
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    function handleClick(event) {
      if (event.defaultPrevented) {
        return;
      }

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      const anchor = getAnchorFromEvent(event);

      if (!anchor) {
        return;
      }

      if (
        (anchor.target && anchor.target !== "_self") ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (
        url.origin !== window.location.origin ||
        !url.hash
      ) {
        return;
      }

      const samePath =
        url.pathname === window.location.pathname && url.search === window.location.search;

      if (!samePath) {
        event.preventDefault();
        window.sessionStorage.setItem(pendingHashKey, url.hash);
        window.location.assign(`${url.pathname}${url.search}`);
        return;
      }

      event.preventDefault();
      scrollToHash(url.hash, { respectReducedMotion: false });
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}
