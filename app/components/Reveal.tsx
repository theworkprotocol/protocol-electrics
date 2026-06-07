"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;         // ms delay before animation starts
  direction?: "up" | "left" | "right" | "scale";
  className?: string;
  threshold?: number;     // 0–1, how much of the element must be visible
  as?: keyof React.JSX.IntrinsicElements;
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  threshold = 0.12,
  as: Tag = "div",
}: RevealProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenTransform =
    direction === "up"
      ? "translateY(28px)"
      : direction === "left"
      ? "translateX(-28px)"
      : direction === "right"
      ? "translateX(28px)"
      : "scale(0.95)";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const El = Tag as any;
  return (
    <El
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : hiddenTransform,
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </El>
  );
}

// Convenience wrapper that staggers children automatically
interface RevealGroupProps {
  children: ReactNode[];
  stagger?: number;   // ms between each child
  direction?: RevealProps["direction"];
  className?: string;
  itemClassName?: string;
}

export function RevealGroup({
  children,
  stagger = 80,
  direction = "up",
  className = "",
  itemClassName = "",
}: RevealGroupProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * stagger} direction={direction} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
