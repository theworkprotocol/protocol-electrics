"use client";

import { useEffect, useRef } from "react";

/**
 * Full-page particle energy field — WebGL edition.
 *
 * Layers (single shader, mode attribute):
 *   0 terrain — rolling 3D wave grid, camera flies through on scroll
 *   1 track ribbon — shimmering particle road winding through the dunes
 *   2 electron pulses — blue-white energy streaming along the track
 *   3 starfield — full-viewport ambient dust with scroll parallax
 *   4 morph layer (separate dynamic buffer) — particles that assemble
 *     into trade symbols (sun / snowflake / wrench) at scroll anchors
 *
 * All positions except the morph layer are computed in the vertex shader;
 * the morph layer keeps its CPU spring physics and streams positions each
 * frame. Additive blending gives genuine light-bleed glow.
 */

const VERT = `
precision highp float;
attribute vec4 aData;
uniform float uW, uH, uTime, uCamZ, uScrollPar, uStrength, uIsMorph, uDpr;
uniform float uDepth, uHalfSpan;
varying vec4 vColor;

const float FOCAL = 420.0;
const float CAMH = -170.0;
const float SP = 22.0;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

float wave(float x, float z) {
  return sin(x * 0.011 + uTime * 0.32) * 74.0
       + sin(z * 0.014 - uTime * 0.22) * 58.0
       + sin((x + z) * 0.006 + uTime * 0.15) * 96.0;
}

float trackX(float wz) {
  return 620.0 * sin(wz * 0.0011) + 340.0 * sin(wz * 0.00053 + 1.7);
}

const vec3 GOLD = vec3(0.961, 0.651, 0.137);
const vec3 GOLD_BRIGHT = vec3(1.0, 0.835, 0.502);
const vec3 GOLD_WARM = vec3(1.0, 0.863, 0.588);
const vec3 BLUE = vec3(0.149, 0.518, 0.843);
const vec3 BLUE_BRIGHT = vec3(0.353, 0.686, 0.961);
const vec3 BLUE_WHITE = vec3(0.878, 0.949, 0.996);
const vec3 FLASH = vec3(0.73, 0.9, 0.99);

void emit(vec2 px, float size, vec3 col, float alpha) {
  gl_Position = vec4(px.x / uW * 2.0 - 1.0, 1.0 - px.y / uH * 2.0, 0.0, 1.0);
  gl_PointSize = max(size, 0.0) * uDpr;
  vColor = vec4(col * alpha, 1.0);
}

void hide() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; vColor = vec4(0.0); }

void main() {
  if (uIsMorph > 0.5) {
    // aData = [px, py, seed, colorSel(0 gold,1 blue,2 bright)]
    float seed = aData.z;
    float tw = 0.6 + 0.4 * sin(uTime * 2.1 + seed * 37.0);
    float alpha = (0.05 + uStrength * 0.6) * tw;
    vec3 col = aData.w < 0.5 ? GOLD : (aData.w < 1.5 ? BLUE_BRIGHT * 0.9 : GOLD_BRIGHT);
    float size = (1.0 + uStrength * 1.4) * 2.2;
    emit(aData.xy, size, col, alpha);
    return;
  }

  float mode = aData.x;

  if (mode < 0.5) {
    // ── Terrain ── aData = [0, col, row, seed]
    float c = aData.y;
    float r = aData.z;
    float x = c * SP - uHalfSpan;
    float rowZ = mod(r * SP - uCamZ, uDepth);
    float z = rowZ + 60.0;
    float worldZ = uCamZ + rowZ;
    float persp = FOCAL / z;
    float fade = max(0.0, 1.0 - z / uDepth);
    if (fade < 0.02) { hide(); return; }
    float y = CAMH + wave(x, worldZ);
    vec2 pxy = vec2(uW * 0.5 + x * persp, uH * 0.42 - y * persp);
    if (pxy.x < -10.0 || pxy.x > uW + 10.0 || pxy.y < -10.0 || pxy.y > uH + 10.0) { hide(); return; }

    float tw = 0.55 + 0.45 * sin(uTime * 1.8 + x * 0.35 + worldZ * 0.21);
    float alpha = fade * fade * tw * 0.5;
    float isBlue = step(hash(c * 3.7 + r * 5.3), 0.4);
    float bright = step(0.956, hash(c * 31.3 + r * 17.7));
    float nearTrack = 1.0 - step(58.0, abs(x - trackX(worldZ)));

    vec3 col = mix(mix(GOLD, BLUE * 1.15, isBlue), GOLD_WARM, nearTrack * (1.0 - isBlue));
    col = mix(col, mix(GOLD_BRIGHT, BLUE_BRIGHT, isBlue), bright);
    alpha *= 1.0 + bright * 0.8 + nearTrack * 0.9;

    // Static-discharge flash: a particle briefly goes white-hot
    float flash = step(0.9985, hash(c * 13.7 + r * 7.3 + floor(uTime * 6.0)));
    col = mix(col, FLASH, flash);
    alpha = mix(alpha, fade * 0.9, flash);

    float size = clamp(persp * (0.7 + tw * 0.5), 0.6, 2.4) * 2.2;
    emit(pxy, size, col, alpha);
    return;
  }

  if (mode < 1.5) {
    // ── Track ribbon ── aData = [1, along, k, seed]
    float along = aData.y;
    float k = aData.z;
    float wz = uCamZ + along;
    float z = along + 60.0;
    float persp = FOCAL / z;
    float fade = max(0.0, 1.0 - z / uDepth);
    if (fade < 0.03) { hide(); return; }
    float off = (hash(wz * 0.37 + k * 12.9898) - 0.5) * 64.0;
    float px = trackX(wz) + off;
    float py = CAMH + wave(px, wz) + 4.0;
    vec2 pxy = vec2(uW * 0.5 + px * persp, uH * 0.42 - py * persp);
    if (pxy.x < -10.0 || pxy.x > uW + 10.0 || pxy.y < -10.0 || pxy.y > uH + 10.0) { hide(); return; }
    float tw = 0.5 + 0.5 * sin(uTime * 2.4 + wz * 0.05 + k * 1.7);
    float alpha = fade * (0.2 + 0.35 * tw);
    vec3 col = k < 0.5 ? BLUE_WHITE * 0.85 : GOLD_WARM;
    float size = clamp(persp * 1.1, 0.6, 2.2) * 2.2;
    emit(pxy, size, col, alpha);
    return;
  }

  if (mode < 2.5) {
    // ── Electron pulse ── aData = [2, k, count, 0]
    float along = mod(aData.y / aData.z * uDepth + uTime * 240.0, uDepth);
    float wz = uCamZ + along;
    float z = along + 60.0;
    float persp = FOCAL / z;
    float fade = max(0.0, 1.0 - z / uDepth);
    if (fade < 0.05) { hide(); return; }
    float px = trackX(wz);
    float py = CAMH + wave(px, wz) + 4.0;
    vec2 pxy = vec2(uW * 0.5 + px * persp, uH * 0.42 - py * persp);
    float size = clamp(persp * 3.0, 1.5, 5.5) * 3.0;
    emit(pxy, size, mix(BLUE_BRIGHT, BLUE_WHITE, 0.6), fade * 0.9);
    return;
  }

  if (mode < 3.5) {
    // ── Starfield ── handled below
  } else {
    // ── Foreground bokeh ── aData = [4, x0, y0, seed]
    float seed = aData.w;
    float px = mod(aData.y * uW + uTime * (6.0 + seed * 9.0), uW + 120.0) - 60.0;
    float py = mod(aData.z * uH + sin(uTime * 0.3 + seed * 21.0) * 34.0 - uScrollPar * 0.28, uH + 120.0) - 60.0;
    float tw = 0.6 + 0.4 * sin(uTime * 0.8 + seed * 15.0);
    float alpha = (0.02 + 0.035 * tw);
    float isBlue = step(hash(seed * 7.7), 0.4);
    vec3 col = mix(GOLD, BLUE_BRIGHT, isBlue);
    float size = (11.0 + seed * 15.0) * 2.0;
    emit(vec2(px, py), size, col, alpha);
    return;
  }

  // ── Starfield ── aData = [3, x0, y0, depth]
  float depth = aData.w;
  float px = mod(aData.y * uW + uTime * 2.2 * depth, uW + 20.0) - 10.0;
  float py = mod(aData.z * uH - uScrollPar * 0.06 * depth, uH + 20.0) - 10.0;
  float tw = 0.5 + 0.5 * sin(uTime * 1.4 + aData.y * 43.0);
  float alpha = (0.05 + 0.2 * tw) * depth;
  float isBlue = step(hash(aData.y * 91.7), 0.4);
  vec3 col = mix(GOLD, BLUE * 1.2, isBlue);
  col = mix(col, mix(GOLD_BRIGHT, BLUE_BRIGHT, isBlue), step(0.9, hash(aData.z * 57.3)));
  float size = (0.6 + depth * 0.9) * 2.0;
  emit(vec2(px, py), size, col, alpha);
}
`;

const FRAG = `
precision mediump float;
varying vec4 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor.rgb * a, 1.0);
}
`;

const CAPTIONS = ["ELECTRICAL", "RESIDENTIAL", "LIGHTING"];

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
    });
    if (!gl) return; // no WebGL: site simply renders without the field

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const COLS = isMobile ? 170 : 320;
    const ROWS = isMobile ? 80 : 130;
    const SPACING = 22;
    const DEPTH = ROWS * SPACING;
    const HALF_SPAN = (COLS * SPACING) / 2;
    const STAR_N = isMobile ? 700 : 1600;
    const PULSE_N = 8;
    const RIBBON_STEP = 6;
    const RIBBON_K = 6;
    const MORPH_N = isMobile ? 1400 : 2800;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ── Shader setup ──
    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("[ParticleField] shader:", gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("[ParticleField] link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const aData = gl.getAttribLocation(prog, "aData");
    const U = (n: string) => gl!.getUniformLocation(prog, n);
    const uW = U("uW"), uH = U("uH"), uTime = U("uTime"), uCamZ = U("uCamZ");
    const uScrollPar = U("uScrollPar"), uStrength = U("uStrength"), uIsMorph = U("uIsMorph");
    const uDpr = U("uDpr"), uDepth = U("uDepth"), uHalfSpan = U("uHalfSpan");

    gl.uniform1f(uDepth, DEPTH);
    gl.uniform1f(uHalfSpan, HALF_SPAN);
    gl.uniform1f(uDpr, dpr);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 1);

    // ── Static field buffer: terrain + ribbon + pulses + stars ──
    const field: number[] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) field.push(0, c, r, (c * 31 + r * 17) % 100);
    for (let along = 8; along < DEPTH; along += RIBBON_STEP)
      for (let k = 0; k < RIBBON_K; k++) field.push(1, along, k, Math.random());
    for (let k = 0; k < PULSE_N; k++) field.push(2, k, PULSE_N, 0);
    for (let i = 0; i < STAR_N; i++)
      field.push(3, Math.random(), Math.random(), 0.15 + Math.random() * 0.85);
    const BOKEH_N = isMobile ? 10 : 20;
    for (let i = 0; i < BOKEH_N; i++)
      field.push(4, Math.random(), Math.random(), Math.random());
    const fieldArr = new Float32Array(field);
    const FIELD_COUNT = fieldArr.length / 4;

    const fieldBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fieldBuf);
    gl.bufferData(gl.ARRAY_BUFFER, fieldArr, gl.STATIC_DRAW);

    // ── Morph shapes: sampled from an offscreen 2D canvas ──
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
      for (let y = 0; y < SHAPE_BOX; y += step)
        for (let x = 0; x < SHAPE_BOX; x += step)
          if (data[(y * SHAPE_BOX + x) * 4 + 3] > 128)
            pts.push({ x: (x - SHAPE_BOX / 2) / SHAPE_BOX, y: (y - SHAPE_BOX / 2) / SHAPE_BOX });
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
      }, 6),
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
      }, 5),
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
      }, 5),
    ].filter((s) => s.length > 0);

    const anchors = [0.2, 0.5, 0.8];
    const INFLUENCE = 0.13;

    type MorphPart = {
      x: number;
      y: number;
      px: number;
      py: number;
      init: boolean;
      phase: number;
      colorSel: number;
    };
    const morphParts: MorphPart[] = Array.from({ length: MORPH_N }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      px: 0,
      py: 0,
      init: false,
      phase: (i * 2.399963) % (Math.PI * 2),
      colorSel: i % 5 < 2 ? 1 : i % 19 === 0 ? 2 : 0,
    }));
    const morphArr = new Float32Array(MORPH_N * 4);
    const morphBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, morphBuf);
    gl.bufferData(gl.ARRAY_BUFFER, morphArr, gl.DYNAMIC_DRAW);

    function smoothstep(v: number) {
      const c = Math.min(1, Math.max(0, v));
      return c * c * (3 - 2 * c);
    }

    // ── Frame loop ──
    let width = 0,
      height = 0,
      raf = 0,
      t = 0;
    let scrollOffset = 0,
      targetScroll = 0;
    let lost = false;

    function resize() {
      if (!canvas || !gl) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uW, width);
      gl.uniform1f(uH, height);
    }

    function frame() {
      if (!gl || lost) return;
      t += 0.016;
      scrollOffset += (targetScroll - scrollOffset) * 0.06;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uCamZ, t * 26 + scrollOffset * 0.55);
      gl.uniform1f(uScrollPar, scrollOffset);

      // Static field
      gl.uniform1f(uIsMorph, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, fieldBuf);
      gl.enableVertexAttribArray(aData);
      gl.vertexAttribPointer(aData, 4, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, FIELD_COUNT);

      // Morph layer — CPU spring physics, streamed to the GPU
      const docH = Math.max(1, document.documentElement.scrollHeight - height);
      const progress = scrollOffset / docH;
      let active = -1,
        strength = 0;
      for (let k = 0; k < shapes.length && k < anchors.length; k++) {
        const d = Math.abs(progress - anchors[k]);
        const s = smoothstep(1 - Math.max(0, d - 0.06) / INFLUENCE);
        if (s > strength) {
          strength = s;
          active = k;
        }
      }
      const cx = width * (isMobile ? 0.5 : 0.68);
      const cy = height * (isMobile ? 0.38 : 0.32);
      const scale = Math.min(width * 0.58, height * 0.56);

      for (let i = 0; i < MORPH_N; i++) {
        const p = morphParts[i];
        const hx = p.x * width + Math.sin(t * 0.6 + p.phase) * 16;
        const hy = p.y * height + Math.cos(t * 0.5 + p.phase) * 12;
        let tx = hx,
          ty = hy;
        if (active >= 0 && strength > 0.01) {
          const pts = shapes[active];
          const tp = pts[(i * 7) % pts.length];
          tx = hx + (cx + tp.x * scale - hx) * strength;
          ty = hy + (cy + tp.y * scale - hy) * strength;
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
        if (strength > 0.4) {
          p.px += (Math.random() - 0.5) * strength * 0.7;
          p.py += (Math.random() - 0.5) * strength * 0.7;
        }
        const o = i * 4;
        morphArr[o] = p.px;
        morphArr[o + 1] = p.py;
        morphArr[o + 2] = p.phase;
        morphArr[o + 3] = p.colorSel;
      }
      // Caption fades in under the formed symbol
      const cap = captionRef.current;
      if (cap) {
        const o = Math.max(0, strength * 2 - 1); // appears in the back half of formation
        cap.style.opacity = o.toFixed(3);
        if (active >= 0) {
          cap.textContent = CAPTIONS[active] ?? "";
          cap.style.left = `${cx}px`;
          cap.style.top = `${cy + scale * 0.38}px`;
        }
      }

      gl.uniform1f(uIsMorph, 1);
      gl.uniform1f(uStrength, strength);
      gl.bindBuffer(gl.ARRAY_BUFFER, morphBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, morphArr);
      gl.vertexAttribPointer(aData, 4, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, MORPH_N);

      raf = requestAnimationFrame(frame);
    }

    function onScroll() {
      targetScroll = window.scrollY;
    }
    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduceMotion && !lost) raf = requestAnimationFrame(frame);
    }
    function onContextLost(e: Event) {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
    }

    resize();
    targetScroll = window.scrollY;
    scrollOffset = targetScroll;
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onContextLost);

    if (reduceMotion) {
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
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(fieldBuf);
      gl.deleteBuffer(morphBuf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
      />
      {/* Symbol caption — fades in when a shape completes */}
      <div
        ref={captionRef}
        aria-hidden="true"
        className="fixed -z-10 pointer-events-none font-mono text-[11px] tracking-[0.5em] text-[#F5A623]/80"
        style={{ opacity: 0, transform: "translateX(-50%)" }}
      />
      {/* Vignette — pulls the edges dark for depth */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 78% 68% at 50% 42%, transparent 52%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </>
  );
}
