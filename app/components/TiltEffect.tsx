"use client";

import { useEffect } from "react";

/**
 * Sitewide 3D card tilt — any .card-gradient element leans toward the
 * cursor in perspective while hovered. Event-delegated from the document
 * so no per-page wiring is needed. Skipped on touch devices and under
 * prefers-reduced-motion; the existing CSS hover transition supplies the
 * easing, so motion stays smooth without a rAF loop.
 */
export default function TiltEffect() {
  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let current: HTMLElement | null = null;

    function onMove(e: MouseEvent) {
      const target = e.target as Element | null;
      const card = (target?.closest?.(".card-gradient") ?? null) as HTMLElement | null;

      if (card !== current && current) {
        current.style.transform = "";
      }
      current = card;
      if (!card) return;

      const r = card.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-3px)`;
    }

    function onLeave() {
      if (current) {
        current.style.transform = "";
        current = null;
      }
    }

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (current) current.style.transform = "";
    };
  }, []);

  return null;
}
