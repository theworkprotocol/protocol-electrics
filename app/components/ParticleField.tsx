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
    const COLS = isMobile ? 104 : 190;
    const ROWS = isMobile ? 50 : 78;
    const SPACING = 25; // world units between points
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

    // ── Morph layer: particles that assemble into trade shapes on scroll ──
    // Shapes are drawn on an offscreen canvas and sampled into point clouds.
    const SHAPE_BOX = 480;

    function samplePoints(draw: (c: CanvasRenderingContext2D) => void, step: number) {
      const off = document.createElement("canvas");
      off.width = SHAPE_BOX;
      off.height = SHAPE_BOX;
      const oc = off.getContext("2d");
      if (!oc) return [] as { x: number; y: number }[];
      oc.fillStyle = "#fff";
      oc.strokeStyle = "#fff";
      oc.lineWidth = 26;
      oc.lineCap = "round";
      oc.lineJoin = "round";
      draw(oc);
      const data = oc.getImageData(0, 0, SHAPE_BOX, SHAPE_BOX).data;
      const pts: { x: number; y: number }[] = [];
      for (let y = 0; y < SHAPE_BOX; y += step) {
        for (let x = 0; x < SHAPE_BOX; x += step) {
          if (data[(y * SHAPE_BOX + x) * 4 + 3] > 128) {
            pts.push({ x: (x - SHAPE_BOX / 2) / SHAPE_BOX, y: (y - SHAPE_BOX / 2) / SHAPE_BOX });
          }
        }
      }
      return pts;
    }

    const shapes = [
      // Lightning bolt (filled)
      samplePoints((c) => {
        c.beginPath();
        c.moveTo(268, 30);
        c.lineTo(150, 262);
        c.lineTo(224, 262);
        c.lineTo(180, 450);
        c.lineTo(330, 196);
        c.lineTo(248, 196);
        c.lineTo(312, 30);
        c.closePath();
        c.fill();
      }, 7),
      // House outline with door
      samplePoints((c) => {
        c.beginPath();
        c.moveTo(52, 238);
        c.lineTo(240, 84);
        c.lineTo(428, 238);
        c.stroke();
        c.beginPath();
        c.moveTo(96, 238);
        c.lineTo(96, 428);
        c.lineTo(384, 428);
        c.lineTo(384, 238);
        c.stroke();
        c.beginPath();
        c.moveTo(210, 428);
        c.lineTo(210, 330);
        c.lineTo(270, 330);
        c.lineTo(270, 428);
        c.stroke();
      }, 6),
      // Light bulb with filament
      samplePoints((c) => {
        c.beginPath();
        c.arc(240, 196, 112, 0, Math.PI * 2);
        c.stroke();
        c.beginPath();
        c.moveTo(206, 330);
        c.lineTo(274, 330);
        c.moveTo(212, 366);
        c.lineTo(268, 366);
        c.moveTo(222, 402);
        c.lineTo(258, 402);
        c.stroke();
        c.beginPath();
        c.moveTo(214, 262);
        c.lineTo(214, 218);
        c.lineTo(240, 180);
        c.lineTo(266, 218);
        c.lineTo(266, 262);
        c.stroke();
      }, 6),
    ].filter((s) => s.length > 0);

    // Scroll anchors (fraction of page) where each shape assembles
    const anchors = [0.2, 0.5, 0.8];
    const INFLUENCE = 0.13;

    const MORPH_N = isMobile ? 620 : 1150;
    const morphParts = Array.from({ length: MORPH_N }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      px: 0,
      py: 0,
      init: false,
      phase: (i * 2.399963) % (Math.PI * 2),
    }));

    // Ambient starfield — fills the full viewport including above the horizon
    const STAR_N = isMobile ? 260 : 620;
    const stars = Array.from({ length: STAR_N }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      depth: 0.15 + Math.random() * 0.85, // parallax factor
      phase: (i * 1.618) % (Math.PI * 2),
    }));

    function smoothstep(v: number) {
      const c = Math.min(1, Math.max(0, v));
      return c * c * (3 - 2 * c);
    }

    function wave(x: number, z: number, time: number) {
      // Layered sines make rolling dune-like terrain
      return (
        Math.sin(x * 0.011 + time * 0.32) * 74 +
        Math.sin(z * 0.014 - time * 0.22) * 58 +
        Math.sin((x + z) * 0.006 + time * 0.15) * 96
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
          const alpha = fade * fade * tw * 0.85;
          if (alpha < 0.015) continue;

          const size = Math.min(2.4, Math.max(0.6, 1.0 * persp * (0.7 + tw * 0.5)));

          // Occasional brighter "live" particle
          const bright = ((c * 31 + r * 17) % 23) === 0;
          ctx.fillStyle = bright
            ? `rgba(255, 213, 128, ${Math.min(1, alpha * 1.8)})`
            : `rgba(245, 166, 35, ${alpha})`;
          // fillRect is far cheaper than arc at this size and count
          ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
        }
      }

      // ── Starfield ──
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // Slow ambient drift plus scroll parallax, wrapped to the viewport
        const sx = ((s.x * width + t * 2.2 * s.depth) % (width + 20)) - 10;
        const sy = ((s.y * height - scrollOffset * 0.06 * s.depth) % (height + 20) + height + 20) % (height + 20) - 10;
        const tw = 0.5 + 0.5 * Math.sin(t * 1.4 + s.phase);
        const alpha = (0.08 + 0.26 * tw) * s.depth;
        const size = 0.6 + s.depth * 0.9;
        ctx.fillStyle = i % 17 === 0
          ? `rgba(255, 213, 128, ${alpha * 1.6})`
          : `rgba(245, 166, 35, ${alpha})`;
        ctx.fillRect(sx, sy, size, size);
      }

      // ── Morph layer ──
      const docH = Math.max(1, document.documentElement.scrollHeight - height);
      const progress = scrollOffset / docH;

      // Find the nearest shape anchor and its influence strength
      let active = -1;
      let strength = 0;
      for (let k = 0; k < shapes.length && k < anchors.length; k++) {
        const s = smoothstep(1 - Math.abs(progress - anchors[k]) / INFLUENCE);
        if (s > strength) {
          strength = s;
          active = k;
        }
      }

      // Shapes sit high-right where headings leave open space, clear of cards
      const cx = width * (isMobile ? 0.5 : 0.68);
      const cy = height * (isMobile ? 0.38 : 0.32);
      const scale = Math.min(width * 0.58, height * 0.56);

      for (let i = 0; i < morphParts.length; i++) {
        const p = morphParts[i];
        let tx: number;
        let ty: number;

        if (active >= 0 && strength > 0.01) {
          const pts = shapes[active];
          const tp = pts[(i * 7) % pts.length];
          // Blend between scattered home and shape position
          const hx = p.x * width + Math.sin(t * 0.6 + p.phase) * 16;
          const hy = p.y * height + Math.cos(t * 0.5 + p.phase) * 12;
          tx = hx + (cx + tp.x * scale - hx) * strength;
          ty = hy + (cy + tp.y * scale - hy) * strength;
        } else {
          tx = p.x * width + Math.sin(t * 0.6 + p.phase) * 16;
          ty = p.y * height + Math.cos(t * 0.5 + p.phase) * 12;
        }

        if (!p.init) {
          p.px = tx;
          p.py = ty;
          p.init = true;
        } else {
          const ease = strength > 0.01 ? 0.09 : 0.035;
          p.px += (tx - p.px) * ease;
          p.py += (ty - p.py) * ease;
        }

        const tw = 0.6 + 0.4 * Math.sin(t * 2.1 + p.phase * 3);
        const alpha = (0.06 + strength * 0.82) * tw;
        if (alpha < 0.02) continue;
        const size = 0.9 + strength * 1.1;

        ctx.fillStyle =
          i % 19 === 0
            ? `rgba(255, 213, 128, ${Math.min(1, alpha * 1.5)})`
            : `rgba(245, 166, 35, ${alpha})`;
        ctx.fillRect(p.px - size / 2, p.py - size / 2, size, size);
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
