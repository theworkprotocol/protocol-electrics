"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Word-stagger heading reveal — each word rises out of an invisible mask
 * with a small delay after the previous one, triggered on scroll into view.
 * Lines are explicit so designed line-breaks are preserved; a line's
 * className (e.g. text-gradient) is applied per word so effects survive
 * the split.
 */
export default function SplitReveal({
  lines,
  as: Tag = "h2",
  className = "",
  stagger = 70,
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

  let wordIndex = 0;
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.text.split(" ").map((word, wi) => {
            const d = wordIndex++ * stagger;
            return (
              <span
                key={wi}
                className="inline-block overflow-hidden align-bottom"
                style={{ paddingBottom: "0.1em", marginBottom: "-0.1em" }}
              >
                <span
                  className={`inline-block ${line.className ?? ""}`}
                  style={{
                    transform: visible ? "translateY(0)" : "translateY(110%)",
                    transition: `transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${d}ms`,
                  }}
                >
                  {word}
                  {wi < line.text.split(" ").length - 1 ? " " : ""}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
