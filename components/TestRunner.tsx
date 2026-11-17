"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { skillGroupIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const ROWS = [25, 50, 75, 100];
const DONE = ROWS.length + 2;
const DOTS = ".".repeat(64);
const RULE = "=".repeat(48);

/** Chips straddle the window's top and bottom edges, where there is only padding, never text. */
const CHIP_POSITIONS = [
  "-top-5 left-[56%] [animation-delay:-1s]",
  "-bottom-5 left-[5%] [animation-delay:-3s]",
  "-bottom-5 right-[7%] [animation-delay:-5s]",
];

interface Tool {
  name: string;
  group: string;
}

/**
 * A pytest-xdist run in a terminal window: types the command, fills four progress
 * rows, then prints the green summary from content. Runs once; static under reduced motion.
 * All lines are rendered from the start (invisible) so the layout never shifts.
 */
export function TestRunner({ command, output, tools }: { command: string; output: string; tools: Tool[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const hasPrompt = command.startsWith("$ ");
  const text = hasPrompt ? command.slice(2) : command;

  const [typed, setTyped] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reduce) {
      setTyped(text.length);
      setStage(DONE);
      return;
    }
    if (!inView) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const perChar = Math.max(28, Math.min(60, 1100 / Math.max(text.length, 1)));
    const start = 700;
    for (let i = 1; i <= text.length; i++) at(start + i * perChar, () => setTyped(i));
    let t = start + text.length * perChar + 380;
    at(t, () => setStage(1));
    t += 420;
    ROWS.forEach((_, r) => {
      at(t, () => setStage(2 + r));
      t += 560;
    });
    at(t + 150, () => setStage(DONE));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, reduce, text]);

  const done = stage >= DONE;
  const running = stage > 0 && !done;

  return (
    <div ref={ref} className="relative" role="img" aria-label={`Terminal running ${text}. Result: ${output}`}>
      <div
        aria-hidden="true"
        className="absolute -inset-x-10 -inset-y-12 -z-10 bg-[radial-gradient(closest-side,rgb(var(--accent)/0.32),transparent)]"
      />

      <div className="terminal overflow-hidden rounded-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-3 min-w-0 flex-1 truncate font-mono text-[12px] text-[#8B90B8]">~/regression-suite — zsh</span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium transition-colors duration-300",
              done
                ? "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#4ADE80]"
                : running
                  ? "border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]"
                  : "border-white/10 text-[#8B90B8]",
            )}
          >
            {done ? (
              <Check size={12} strokeWidth={3} />
            ) : (
              <span className={cn("h-1.5 w-1.5 rounded-full bg-current", running && "animate-pulse")} />
            )}
            {done ? "passed" : running ? "running" : "idle"}
          </span>
        </div>

        {/* Output */}
        <div className="space-y-1 px-5 py-5 font-mono text-[12.5px] leading-6 sm:text-[13px]">
          <p className="whitespace-pre-wrap break-all">
            {hasPrompt && <span className="text-[#A5B4FC]">$ </span>}
            <span className={stage === 0 ? "caret caret-static" : undefined}>{text.slice(0, typed)}</span>
          </p>

          <div className={cn("transition-opacity duration-300", stage >= 1 ? "opacity-100" : "opacity-0")}>
            <Rule label="test session starts" className="text-[#8B90B8]" />
            <p className="text-[#8B90B8]">bringing up nodes...</p>
          </div>

          {ROWS.map((pct, r) => {
            const active = stage >= 2 + r;
            return (
              <div
                key={pct}
                className={cn("flex items-center gap-3 transition-opacity duration-200", active ? "opacity-100" : "opacity-0")}
              >
                <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap tracking-[0.2em] text-[#4ADE80]">
                  <span
                    className="block transition-[clip-path] duration-500 ease-out"
                    style={{ clipPath: active ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
                  >
                    {DOTS}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 whitespace-pre text-[#8B90B8] transition-opacity duration-200",
                    active ? "opacity-100 delay-500" : "opacity-0",
                  )}
                >
                  [{String(pct).padStart(3, " ")}%]
                </span>
              </div>
            );
          })}

          <div className={cn("pt-1 transition-all duration-500", done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0")}>
            <Rule label={output} className="font-semibold text-[#4ADE80]" />
          </div>
          <p className={cn("transition-opacity duration-300", done ? "opacity-100 delay-300" : "opacity-0")}>
            <span className="text-[#A5B4FC]">$ </span>
            <span className="caret" />
          </p>
        </div>
      </div>

      {/* Floating tool chips (decorative) */}
      {tools.slice(0, CHIP_POSITIONS.length).map((tool, i) => {
        const Icon = skillGroupIcon(tool.group);
        return (
          <span
            key={tool.name}
            className={cn(
              "absolute hidden animate-float items-center gap-2 rounded-full border border-line/10 bg-card/85 px-3.5 py-2 text-[13px] font-semibold text-text shadow-[0_12px_30px_-12px_rgb(0_0_0/0.45)] backdrop-blur-xl sm:inline-flex",
              CHIP_POSITIONS[i],
            )}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent-ink">
              <Icon size={13} />
            </span>
            {tool.name}
          </span>
        );
      })}
    </div>
  );
}

/** A pytest-style "===== label =====" line that fits any width. */
function Rule({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-right opacity-60" dir="rtl">
        {RULE}
      </span>
      <span className="shrink-0">{label}</span>
      <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap opacity-60">{RULE}</span>
    </div>
  );
}
