"use client";

import { useEffect } from "react";

/**
 * Fades and lifts every `[data-reveal]` element into place as it scrolls into view.
 * - Without JavaScript nothing is hidden (the hiding CSS needs `.reveal-ready` on <html>).
 * - With `prefers-reduced-motion: reduce` the CSS never hides anything.
 * - Elements already on screen are marked revealed before hiding starts, so nothing flickers.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reveal = (element: Element) => element.classList.add("is-revealed");

    for (const element of elements) {
      const box = element.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) reveal(element);
    }
    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    for (const element of elements) {
      if (!element.classList.contains("is-revealed")) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return null;
}
