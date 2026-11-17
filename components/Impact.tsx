import { impact } from "@/data/content";
import { Section } from "@/components/Section";
import { FadeUp } from "@/components/FadeUp";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { highlightMetrics } from "@/lib/highlight";
import { impactIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function Impact() {
  return (
    <Section id="impact" eyebrow="Case studies" heading={impact.heading} subheading={impact.subheading}>
      <SpotlightGroup className="grid gap-5 md:grid-cols-2">
        {impact.cards.map((card, i) => {
          const Icon = impactIcon(card.title, i);
          return (
            <FadeUp as="article" key={card.title} delay={(i % 2) * 0.08} className="card card-hover spotlight flex flex-col p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="icon-box">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="font-mono text-[13px] text-muted/70">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 text-[1.375rem] font-bold leading-snug tracking-tight">{card.title}</h3>

              <ol className="relative mt-6 flex-1 space-y-5 border-l border-dashed border-line/15 pl-6">
                <Step tone="problem" label="Problem">
                  {card.problem}
                </Step>
                <Step tone="approach" label="Approach">
                  {card.approach}
                </Step>
                <Step tone="result" label="Result">
                  {highlightMetrics(card.result)}
                </Step>
              </ol>

              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Technologies">
                {card.tags.map((tag) => (
                  <li key={tag}>
                    <span className="chip-muted">{tag}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          );
        })}
      </SpotlightGroup>
    </Section>
  );
}

const TONES = {
  problem: { dot: "bg-rose-500 dark:bg-rose-400", label: "text-rose-600 dark:text-rose-400" },
  approach: { dot: "bg-accent", label: "text-accent-ink" },
  result: { dot: "bg-success shadow-[0_0_10px_2px_rgb(var(--success)/0.6)]", label: "text-success" },
} as const;

function Step({ tone, label, children }: { tone: keyof typeof TONES; label: string; children: React.ReactNode }) {
  const t = TONES[tone];
  const isResult = tone === "result";
  return (
    <li className="relative">
      <span aria-hidden="true" className={cn("absolute -left-[29px] top-[5px] h-[9px] w-[9px] rounded-full ring-4 ring-card", t.dot)} />
      <p className={cn("font-mono text-[11px] font-semibold uppercase tracking-[0.16em]", t.label)}>{label}</p>
      <div
        className={cn(
          "mt-1.5 text-[15px] leading-relaxed",
          isResult ? "rounded-xl border border-success/20 bg-success/[0.07] px-4 py-3 font-medium text-text/90" : "text-muted",
        )}
      >
        {children}
      </div>
    </li>
  );
}
