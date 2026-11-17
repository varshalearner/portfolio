"use client";

import { createElement, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightGroupProps {
  as?: "div" | "ul" | "ol";
  className?: string;
  children: React.ReactNode;
}

/**
 * Tracks the mouse once for a whole grid and feeds the position to every `.spotlight`
 * card inside it, so the border glow flows across neighbouring cards.
 */
export function SpotlightGroup({ as = "div", className, children }: SpotlightGroupProps) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const onPointerMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      ref.current?.querySelectorAll<HTMLElement>(".spotlight").forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${clientX - rect.left}px`);
        card.style.setProperty("--my", `${clientY - rect.top}px`);
      });
    });
  };

  return createElement(as, { ref, onPointerMove, className: cn("spotlight-group", className) }, children);
}
