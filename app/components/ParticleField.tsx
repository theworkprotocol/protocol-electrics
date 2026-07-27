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
    const COLS = isMobile ? 120 : 220;
    const ROWS = isMobile ? 58 : 92;
    const SPACING = 22; // world units between points
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
      // Sun — solar
      samplePoints((c) => {
        c.beginPath();
        c.arc(240, 230, 74, 0, Math.PI * 2);
        c.fill();
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          c.beginPath();
          c.moveTo(240 + Math.cos(a) * 112, 230 + Math.sin(a) * 112);
          c.lineTo(240 + Math.cos(a) * 170, 230 + Math.sin(a) * 170);
          c.stroke();
        }
      }, 7),
      // Snowflake — air conditioning
      samplePoints((c) => {
        c.lineWidth = 16;
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
          const dx = Math.cos(a);
          const dy = Math.sin(a);
          c.beginPath();
          c.moveTo(240, 235);
          c.lineTo(240 + dx * 158, 235 + dy * 158);
          c.stroke();
          // Branches at 60% of each arm
          const bx = 240 + dx * 95;
          const by = 235 + dy * 95;
          for (const side of [-1, 1]) {
            const ba = a + (side * Math.PI) / 3.2;
            c.beginPath();
            c.moveTo(bx, by);
            c.lineTo(bx + Math.cos(ba) * 46, by + Math.sin(ba) * 46);
            c.stroke();
          }
        }
      }, 6),
      // Combination wrench — electrical maintenance
      samplePoints((c) => {
        c.lineWidth = 34;
        // Shaft
        c.beginPath();
        c.moveTo(168, 356);
        c.lineTo(292, 208);
        c.stroke();
        // Open-end head (arc with a gap facing up-right)
        c.lineWidth = 30;
        c.beginPath();
        c.arc(316, 180, 58, 0.15 * Math.PI, 1.55 * Math.PI);
        c.stroke();
        // Closed ring end
        c.lineWidth = 26;
        c.beginPath();
        c.arc(150, 380, 44, 0, Math.PI * 2);
        c.stroke();
      }, 6),
    ].filter((s) => s.length > 0);

    // Scroll anchors (fraction of page) where each shape assembles
    const anchors = [0.2, 0.5, 0.8];
    const INFLUENCE = 0.13;

    const MORPH_N = isMobile ? 800 : 1500;
    const morphParts = Array.from({ length: MORPH_N }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      px: 0,
      py: 0,
      init: false,
      phase: (i * 2.399963) % (Math.PI * 2),
    }));

    // Ambient starfield — fills the full viewport including above the horizon
    const STAR_N = isMobile ? 380 : 900;
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

    // Winding centreline of the energised track, in world space
    function trackX(wz: number) {
      return 620 * Math.sin(wz * 0.0011) + 340 * Math.sin(wz * 0.00053 + 1.7);
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
        const trackXc = trackX(worldZ);
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

          // Occasional brighter "live" particle; dust near the track glows
          const bright = ((c * 31 + r * 17) % 23) === 0;
          const isBlue = ((c * 3 + r * 5) % 5) < 2; // ~40% of the field
          const nearTrack = Math.abs(x - trackXc) < 58;
          ctx.fillStyle = bright
            ? isBlue
              ? `rgba(90, 175, 245, ${Math.min(1, alpha * 1.7)})`
              : `rgba(255, 213, 128, ${Math.min(1, alpha * 1.8)})`
            : nearTrack
            ? `rgba(255, 220, 150, ${Math.min(1, alpha * 2.1)})`
            : isBlue
            ? `rgba(38, 132, 215, ${alpha * 1.1})`
            : `rgba(245, 166, 35, ${alpha})`;
          // fillRect is far cheaper than arc at this size and count
          ctx.fillRect(sx - size / 2, sy - size / 2, size, size);

          // Static-discharge flash — a particle briefly goes white-hot
          if (((c * 13 + r * 7 + ((t * 6) | 0)) % 997) === 0) {
            ctx.fillStyle = `rgba(186, 230, 253, ${0.75 * fade})`;
            ctx.fillRect(sx - 1.5, sy - 1.5, 3, 3);
          }
        }
      }

      // ── Energised track: a shimmering ribbon of dense particles ──
      for (let along = 8; along < DEPTH; along += 8) {
        const z = along + 60;
        const wz = camZ + along;
        const persp = focal / z;
        const fade = Math.max(0, 1 - z / DEPTH);
        if (fade < 0.03) continue;
        const xc = trackX(wz);
        for (let k = 0; k < 5; k++) {
          // Deterministic scatter across the ribbon width, shimmering over time
          const h = Math.sin(wz * 0.37 + k * 12.9898) * 43758.5453;
          const off = (h - Math.floor(h) - 0.5) * 64;
          const px = xc + off;
          const py = camHeight + wave(px, wz, t) + 4;
          const sx = width / 2 + px * persp;
          if (sx < -8 || sx > width + 8) continue;
          const sy = horizonY - py * persp;
          if (sy < -8 || sy > height + 8) continue;
          const tw = 0.5 + 0.5 * Math.sin(t * 2.4 + wz * 0.05 + k * 1.7);
          const alpha = fade * (0.3 + 0.45 * tw);
          const size = Math.min(2.2, Math.max(0.6, 1.1 * persp));
          ctx.fillStyle =
            k === 0
              ? `rgba(165, 220, 252, ${Math.min(1, alpha * 1.25)})`
              : `rgba(255, 214, 128, ${alpha})`;
          ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
        }
      }

      // Electron pulses streaming along the track
      const PULSES = 7;
      for (let k = 0; k < PULSES; k++) {
        const along = ((k / PULSES) * DEPTH + t * 240) % DEPTH;
        const z = along + 60;
        const wz = camZ + along;
        const persp = focal / z;
        const fade = Math.max(0, 1 - z / DEPTH);
        if (fade < 0.05) continue;
        const xc = trackX(wz);
        const y = camHeight + wave(xc, wz, t) + 4;
        const sx = width / 2 + xc * persp;
        const sy = horizonY - y * persp;
        const r = Math.min(4.5, Math.max(1.2, 3 * persp));
        ctx.fillStyle = `rgba(38, 132, 215, ${0.35 * fade})`;
        ctx.fillRect(sx - r * 2, sy - r * 2, r * 4, r * 4);
        ctx.fillStyle = `rgba(224, 242, 254, ${0.95 * fade})`;
        ctx.fillRect(sx - r * 0.7, sy - r * 0.7, r * 1.4, r * 1.4);
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
        ctx.fillStyle =
          i % 5 < 2
            ? `rgba(52, 145, 225, ${alpha * 1.8})`
            : i % 17 === 0
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
        // Plateau: fully formed within +/-0.06 of the anchor, soft ramp outside
        const d = Math.abs(progress - anchors[k]);
        const s = smoothstep(1 - Math.max(0, d - 0.06) / INFLUENCE);
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
          const ease = strength > 0.01 ? 0.14 : 0.035;
          p.px += (tx - p.px) * ease;
          p.py += (ty - p.py) * ease;
        }

        // Current buzz — formed shapes vibrate with micro-jitter
        if (strength > 0.4) {
          p.px += (Math.random() - 0.5) * strength * 0.7;
          p.py += (Math.random() - 0.5) * strength * 0.7;
        }

        const tw = 0.6 + 0.4 * Math.sin(t * 2.1 + p.phase * 3);
        const alpha = (0.06 + strength * 0.95) * tw;
        if (alpha < 0.02) continue;
        const size = 1.0 + strength * 1.3;

        ctx.fillStyle =
          i % 5 < 2
            ? `rgba(70, 160, 235, ${Math.min(1, alpha * 1.4)})`
            : i % 19 === 0
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
