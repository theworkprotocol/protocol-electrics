"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: string;    // e.g. "10", "100", "0"
  suffix: string;   // e.g. "yrs", "%", "+"
  label: string;
  duration?: number; // ms
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || target === 0) {
      setCount(target);
      return;
    }
    startRef.current = null;
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, target, duration]);

  return count;
}

export function StatCounter({ value, suffix, label, duration = 1400 }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const target = parseInt(value, 10) || 0;
  const count = useCountUp(target, duration, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle non-numeric display (e.g. "100+" where we just show count+)
  const displayValue = target === 0 ? "0" : count.toString();

  return (
    <div ref={ref} className="flex flex-col items-center py-10 gap-1">
      <div className="flex items-baseline gap-0.5">
        <span className="text-4xl font-bold text-gradient">{displayValue}</span>
        <span className="text-xl font-bold text-[#F5A623]">{suffix}</span>
      </div>
      <span className="text-xs text-[#6B6B6B] tracking-widest uppercase">{label}</span>
    </div>
  );
}

// Compact version for projects page
export function StatCounterCompact({ value, suffix, label, duration = 1400 }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // value might include non-numeric suffix like "100+" or "24hr"
  const numericMatch = value.match(/^(\d+)/);
  const target = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const nonNumericSuffix = numericMatch ? value.slice(numericMatch[1].length) : value;
  const count = useCountUp(target, duration, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayValue = target > 0 ? count.toString() + nonNumericSuffix : value;

  return (
    <div ref={ref} className="flex flex-col items-center py-10 gap-1.5">
      <span className="text-3xl font-bold text-gradient">{displayValue}{suffix}</span>
      <span className="text-xs text-[#6B6B6B] tracking-widest uppercase">{label}</span>
    </div>
  );
}
