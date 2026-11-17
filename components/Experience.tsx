import { CircleCheck } from "lucide-react";
import { experience } from "@/data/content";
import { Section } from "@/components/Section";
import { FadeUp } from "@/components/FadeUp";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { highlightMetrics } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <Section id="experience" eyebrow="Career" heading="Experience">
      <SpotlightGroup className="relative mx-auto max-w-5xl">
        {/* timeline rail */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[11px] top-2 w-px bg-gradient-to-b from-accent via-accent-3/40 to-transparent md:left-[211px]"
        />
        <ol>
          {experience.map((item, i) => (
            <FadeUp
              as="li"
              key={`${item.role}-${item.period}`}
              delay={i * 0.1}
              className="relative grid grid-cols-1 gap-4 pb-12 pl-10 last:pb-0 md:grid-cols-[180px_minmax(0,1fr)] md:gap-16 md:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-[4px] top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-accent/60 bg-bg md:left-[204px]"
              >
                <span
                  className={cn(
                    "h-[7px] w-[7px] rounded-full bg-accent",
                    i === 0 && "shadow-[0_0_12px_3px_rgb(var(--accent)/0.75)]",
                  )}
                />
              </span>

              <div className="md:text-right">
                <p className="font-mono text-[13px] text-accent-ink">{item.period}</p>
                <p className="mt-1.5 font-display text-lg font-bold">{item.company}</p>
                <p className="text-[14px] text-muted">{item.location}</p>
              </div>

              <div className="card card-hover spotlight p-6 md:p-7">
                <h3 className="text-[1.25rem] font-bold leading-snug tracking-tight">{item.role}</h3>
                <ul className="mt-5 space-y-3 text-[15.5px] leading-relaxed text-muted">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <CircleCheck size={18} className="mt-[3px] shrink-0 text-accent" aria-hidden="true" />
                      <span>{highlightMetrics(point)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </ol>
      </SpotlightGroup>
    </Section>
  );
}
