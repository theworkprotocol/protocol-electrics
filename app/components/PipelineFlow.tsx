"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";

/**
 * Scroll-drawn pipeline connector — a gold current that draws itself across
 * the process steps as the section scrolls into view, lighting up each
 * junction node as it passes. Desktop only (hidden below md).
 */

function Node({ progress, at, x }: { progress: MotionValue<number>; at: number; x: number }) {
  const opacity = useTransform(progress, [at - 0.08, at], [0.15, 1]);
  const scale = useTransform(progress, [at - 0.08, at], [0.6, 1]);
  return (
    <>
      <motion.circle cx={x} cy={20} r={5} fill="#F5A623" style={{ opacity, scale, transformOrigin: `${x}px 20px` }} />
      <motion.circle cx={x} cy={20} r={11} stroke="rgba(245,166,35,0.35)" strokeWidth={1} fill="none" style={{ opacity }} />
    </>
  );
}

export default function PipelineFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <div ref={ref} className="hidden md:block mb-2" aria-hidden="true">
      <svg viewBox="0 0 800 40" className="w-full h-10" fill="none" preserveAspectRatio="none">
        {/* Faint base line */}
        <line x1="20" y1="20" x2="780" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        {/* Drawn current */}
        <motion.line
          x1="20"
          y1="20"
          x2="780"
          y2="20"
          stroke="rgba(245,166,35,0.6)"
          strokeWidth="1.5"
          style={{ pathLength: progress }}
        />
        {/* Junction nodes at each step's column centre */}
        <Node progress={progress} at={0.2} x={100} />
        <Node progress={progress} at={0.45} x={300} />
        <Node progress={progress} at={0.7} x={500} />
        <Node progress={progress} at={0.95} x={700} />
      </svg>
    </div>
  );
}
