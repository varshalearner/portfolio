"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, Menu, X } from "lucide-react";
import { nav, site } from "@/data/content";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const items: NavItem[] = nav.map((label) => {
  const id = label.toLowerCase();
  return { label, id, href: id === "blog" ? "/blog" : `/#${id}` };
});

/** The home page's "Latest Writing" section lights up the Blog link. */
const SECTION_ALIASES: Record<string, string> = { writing: "blog" };

export function Navbar({ resumeAvailable }: { resumeAvailable: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in view: the last one whose top has passed 35% of the viewport.
  useEffect(() => {
    if (!isHome) {
      setActiveId(pathname.startsWith("/blog") ? "blog" : "");
      return;
    }
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    if (sections.length === 0) return;
    const known = new Set(items.map((i) => i.id));
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.35;
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1].id;
      }
      const mapped = SECTION_ALIASES[current] ?? current;
      setActiveId(known.has(mapped) ? mapped : "");
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
  }, [isHome, pathname]);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-container items-center justify-between gap-3 rounded-full border pl-3 pr-2 transition-[background-color,border-color,box-shadow] duration-300 sm:pl-4",
          scrolled || open
            ? "border-line/10 bg-bg/70 shadow-[0_10px_40px_-16px_rgb(0_0_0/0.45)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <Logo onClick={() => setOpen(false)} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 rounded-full border border-line/10 bg-line/[0.03] p-1 backdrop-blur">
            {items.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id} className="relative">
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-line/10 bg-line/[0.08]"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Link
                    href={item.href}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors",
                      active ? "text-text" : "text-muted hover:text-text",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NavCta resumeAvailable={resumeAvailable} className="hidden sm:inline-flex" />
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="icon-btn lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-container origin-top overflow-hidden rounded-3xl border border-line/10 bg-bg/90 p-2 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="grid gap-0.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={activeId === item.id ? "location" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-[16px] font-medium transition-colors",
                        activeId === item.id ? "bg-line/[0.07] text-text" : "text-muted hover:bg-line/[0.04] hover:text-text",
                      )}
                    >
                      {item.label}
                      <ArrowRight size={16} className="opacity-40" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-2 pt-3">
              <NavCta resumeAvailable={resumeAvailable} className="w-full" onClick={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Resume download when the PDF exists, otherwise a "Let's talk" jump to the contact section. */
function NavCta({
  resumeAvailable,
  className,
  onClick,
}: {
  resumeAvailable: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const classes = cn("btn-primary !min-h-10 px-4 text-[14px]", className);
  if (resumeAvailable) {
    return (
      <a href={site.resume} download className={classes} onClick={onClick}>
        <Download size={16} aria-hidden="true" /> Resume
      </a>
    );
  }
  return (
    <Link href="/#contact" className={classes} onClick={onClick}>
      Let&apos;s talk <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
