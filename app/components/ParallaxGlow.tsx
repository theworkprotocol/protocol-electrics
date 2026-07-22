"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-parallax wrapper for background glow blobs.
 * Drifts vertically as the page scrolls — pass a negative speed to move
 * against the scroll direction for extra depth.
 */
export default function ParallaxGlow({
  className = "",
  speed = 80,
}: {
  className?: string;
  speed?: number;
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed]);

  return <motion.div aria-hidden="true" className={className} style={{ y }} />;
}
