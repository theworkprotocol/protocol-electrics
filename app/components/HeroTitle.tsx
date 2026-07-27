"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Hero headline — heavy forward-italic lines that rise in on load
 * (line-mask CSS) and slide apart horizontally as the page scrolls,
 * each line drifting in its own direction at its own rate.
 */
export default function HeroTitle() {
  const { scrollY } = useScroll();
  const x1 = useTransform(scrollY, [0, 700], [0, -170]);
  const x2 = useTransform(scrollY, [0, 700], [0, 210]);
  const x3 = useTransform(scrollY, [0, 700], [0, -130]);
  const opacity = useTransform(scrollY, [0, 560], [1, 0.08]);

  return (
    <motion.h1
      style={{ opacity, fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      className="text-6xl md:text-8xl font-black italic tracking-[-0.04em] leading-[0.95] mb-8"
    >
      <span className="line-mask">
        <span>
          <motion.span style={{ x: x1 }} className="inline-block pr-[0.1em] text-[#F0EDE8]">
            Precision
          </motion.span>
        </span>
      </span>
      <span className="line-mask">
        <span>
          <motion.span style={{ x: x2 }} className="inline-block pr-[0.1em] text-gradient">
            Electrical
          </motion.span>
        </span>
      </span>
      <span className="line-mask">
        <span>
          <motion.span style={{ x: x3 }} className="inline-block pr-[0.1em] text-[#F0EDE8]">
            Work.
          </motion.span>
        </span>
      </span>
    </motion.h1>
  );
}
