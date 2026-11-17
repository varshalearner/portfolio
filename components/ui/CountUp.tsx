"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const NUMBER_RE = /^(\D*?)(\d[\d,]*)(\D*)$/;

/**
 * Counts a stat up from zero when it scrolls into view. Values with more than one
 * number ("5h → 3h") or no number render as-is. The server HTML has the final value.
 */
export function CountUp({ value, className, duration = 1400 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const match = NUMBER_RE.exec(value);
  const target = match ? Number.parseInt(match[2].replace(/,/g, ""), 10) : Number.NaN;
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(target) || reduce || !inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, duration]);

  let display = value;
  if (match && current !== null) {
    const formatted = match[2].includes(",") ? current.toLocaleString("en-US") : String(current);
    display = `${match[1]}${formatted}${match[3]}`;
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
