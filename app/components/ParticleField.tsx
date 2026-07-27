"use client";

import { useEffect, useRef } from "react";

/**
 * Full-page particle terrain — a field of gold points arranged as rolling
 * 3D waves, projected in perspective and drifting slowly forward. Scrolling
 * advances the camera through the field (remix.run-inspired). Hand-rolled
 * canvas projection — no WebGL, no dependencies.
 *
 * Sits fixed behind all content; sections with solid backgrounds simply
 * cover it, so it reads through heroes, gaps, and translucent panels.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    // Grid density — fewer points on mobile
    const COLS = isMobile ? 60 : 110;
    const ROWS = isMobile ? 30 : 46;
    const SPACING = 42; // world units between points
    const DEPTH = ROWS * SPACING;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let raf = 0;
    let t = 0;
    let scrollOffset = 0;
    let targetScroll = 0;

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function wave(x: number, z: number, time: number) {
      // Layered sines make rolling dune-like terrain
      return (
        Math.sin(x * 0.011 + time * 0.32) * 46 +
        Math.sin(z * 0.014 - time * 0.22) * 38 +
        Math.sin((x + z) * 0.006 + time * 0.15) * 60
      );
    }

    function frame() {
      if (!ctx) return;
      t += 0.016;
      // Ease camera toward scroll position for a smooth glide
      scrollOffset += (targetScroll - scrollOffset) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const focal = 420;
      const camHeight = -170; // camera above the field
      const horizonY = height * 0.42;
      const camZ = t * 26 + scrollOffset * 0.55; // drift + scroll advance

      const halfSpan = (COLS * SPACING) / 2;

      for (let r = 0; r < ROWS; r++) {
        // World z of the row, wrapped so the field is endless
        const rowZ = r * SPACING - (camZ % SPACING);
        const z = rowZ + 60; // keep in front of camera
        if (z <= 8) continue;

        const worldZ = camZ + rowZ; // continuous z for stable wave shape
        const persp = focal / z;
        const fade = Math.max(0, 1 - z / DEPTH); // fog with distance
        if (fade <= 0.02) continue;

        for (let c = 0; c < COLS; c++) {
          const x = c * SPACING - halfSpan;
          const y = camHeight + wave(x, worldZ, t);

          const sx = width / 2 + x * persp;
          if (sx < -8 || sx > width + 8) continue;
          const sy = horizonY - y * persp;
          if (sy < -8 || sy > height + 8) continue;

          // Twinkle — cheap pseudo-noise per point
          const tw = 0.55 + 0.45 * Math.sin(t * 1.8 + x * 0.35 + worldZ * 0.21);
          const alpha = fade * fade * tw * 0.5;
          if (alpha < 0.015) continue;

          const size = Math.min(4.5, Math.max(0.4, 1.7 * persp * (0.7 + tw * 0.5)));

          // Occasional brighter "live" particle
          const bright = ((c * 31 + r * 17) % 23) === 0;
          ctx.fillStyle = bright
            ? `rgba(255, 213, 128, ${Math.min(1, alpha * 1.8)})`
            : `rgba(245, 166, 35, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    function onScroll() {
      targetScroll = window.scrollY;
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduceMotion) {
        raf = requestAnimationFrame(frame);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    if (reduceMotion) {
      // Single static frame, no animation loop
      frame();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
