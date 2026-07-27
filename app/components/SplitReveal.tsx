"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Letter-slide heading reveal — characters sweep in one at a time from
 * the start of the phrase to the end, each sliding from the left with a
 * tight stagger, triggered on scroll into view. Carries the hero slogan
 * treatment: heavy Inter, forward italic.
 */
export default function SplitReveal({
  lines,
  as: Tag = "h2",
  className = "",
  stagger = 26,
  threshold = 0.3,
}: {
  lines: { text: string; className?: string }[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  stagger?: number;
  threshold?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
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

  let charIndex = 0;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.text.split("").map((ch, ci) => {
            const d = charIndex++ * stagger;
            return (
              <span
                key={ci}
                className={`inline-block ${line.className ?? ""}`}
                style={{
                  whiteSpace: "pre",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-18px)",
                  transition: `opacity 0.4s ease ${d}ms, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${d}ms`,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
