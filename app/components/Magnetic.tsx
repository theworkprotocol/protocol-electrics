"use client";

import { useRef, useState } from "react";

/**
 * Magnetic hover wrapper — the child drifts toward the cursor while hovered
 * and springs back on leave. Wrap CTAs sparingly; one or two per view.
 */
export default function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * strength, y: relY * strength });
  }

  function onMouseLeave() {
    setHovering(false);
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={onMouseLeave}
      className={`inline-block ${className}`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: hovering ? "transform 0.12s ease-out" : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
