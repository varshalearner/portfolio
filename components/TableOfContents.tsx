"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";
import { cn } from "@/lib/utils";

const OFFSET = 112; // sticky navbar + breathing room

export function TableOfContents({ items, inline = false }: { items: TocItem[]; inline?: boolean }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (inline) return;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      // The active heading is the last one whose top has scrolled past the offset line.
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top - OFFSET <= 0) current = h.id;
        else break;
      }
      // At the very bottom of the page, highlight the last heading.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = headings[headings.length - 1].id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, inline]);

  return (
    <nav aria-label="Table of contents" className="mt-3">
      <ul className="space-y-1 border-l border-border text-[14px]">
        {items.map((item) => {
          const active = !inline && activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1 pr-2 leading-snug transition-colors",
                  item.level === 3 ? "pl-6" : "pl-3",
                  active
                    ? "border-accent font-medium text-accent-ink"
                    : "border-transparent text-muted hover:border-border hover:text-text",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
