import { hero } from "@/data/content";
import { FadeUp } from "@/components/FadeUp";
import { CountUp } from "@/components/ui/CountUp";
import { cn } from "@/lib/utils";

/** The numbers strip under the hero. Edited in the admin under Hero → Stats strip. */
export function HeroStats() {
  const stats = hero.stats ?? [];
  if (stats.length === 0) return null;
  const columns = stats.length >= 4 ? "md:grid-cols-4" : stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <FadeUp delay={0.3} className="mt-20 md:mt-24">
      <dl
        className={cn(
          "relative grid grid-cols-2 overflow-hidden rounded-3xl border border-line/10 bg-card/50 backdrop-blur-xl",
          columns,
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        />
        {stats.map((stat, i) => (
          <div
            key={`${stat.value}-${stat.label}`}
            className={cn(
              "flex flex-col-reverse justify-end gap-1.5 border-line/10 px-5 py-6 sm:px-7 md:py-8",
              i % 2 === 1 && "border-l",
              i >= 2 && "border-t md:border-t-0",
              i > 0 && "md:border-l",
            )}
          >
            <dt className="text-[13.5px] leading-snug text-muted">{stat.label}</dt>
            <dd className="font-display text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl">
              <CountUp value={stat.value} className="text-gradient" />
            </dd>
          </div>
        ))}
      </dl>
    </FadeUp>
  );
}
