"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Hero headline — heavy forward-italic lines that rise in on load
 * (line-mask CSS) and slide apart horizontally as the page scrolls.
 * The scroll-linked slide is desktop-only; mobile renders static lines
 * (the per-frame transform updates jank on weaker devices).
 */
export default function HeroTitle() {
  const [motionOn, setMotionOn] = useState(false);
  useEffect(() => {
    setMotionOn(
      window.innerWidth >= 768 &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const { scrollY } = useScroll();
  const x1 = useTransform(scrollY, [0, 700], [0, -170]);
  const x2 = useTransform(scrollY, [0, 700], [0, 210]);
  const x3 = useTransform(scrollY, [0, 700], [0, -130]);
  const opacity = useTransform(scrollY, [0, 560], [1, 0.08]);

  const lines: { text: string; x: typeof x1; cls: string }[] = [
    { text: "Precision", x: x1, cls: "text-[#F0EDE8]" },
    { text: "Electrical", x: x2, cls: "text-gradient" },
    { text: "Work.", x: x3, cls: "text-[#F0EDE8]" },
  ];

  return (
    <motion.h1
      style={{
        opacity: motionOn ? opacity : 1,
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
      className="text-6xl md:text-8xl font-black italic tracking-[-0.04em] leading-[0.95] mb-8"
    >
      {lines.map((l) => (
        <span key={l.text} className="line-mask">
          <span>
            <motion.span
              style={motionOn ? { x: l.x } : undefined}
              className={`inline-block pr-[0.22em] ${l.cls}`}
            >
              {l.text}
            </motion.span>
          </span>
        </span>
      ))}
    </motion.h1>
  );
}
