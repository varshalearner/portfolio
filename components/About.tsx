import Image from "next/image";
import { Briefcase } from "lucide-react";
import { about, experience, hero, site } from "@/data/content";
import { Section } from "@/components/Section";
import { FadeUp } from "@/components/FadeUp";
import { factIcon } from "@/lib/icons";
import { isPlaceholder } from "@/lib/utils";

export function About({ photoAvailable }: { photoAvailable: boolean }) {
  // Facts still holding a [PLACEHOLDER] stay hidden until the owner fills them in.
  const facts = about.facts.filter((fact) => !isPlaceholder(fact.value));
  const status = hero.status.split("·")[0]?.trim();
  const role = site.title.split("·")[0]?.trim();
  const company = experience[0]?.company;

  return (
    <Section id="about" eyebrow="Get to know me" heading={about.heading}>
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <FadeUp>
          <Portrait photoAvailable={photoAvailable} status={status} badge={role && company ? `${role} @ ${company}` : undefined} />
        </FadeUp>

        <div>
          <div className="space-y-5 text-[16.5px] leading-[1.8] text-muted">
            {about.paragraphs.map((paragraph, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <p className={i === 0 ? "text-[18px] leading-[1.7] text-text/90 md:text-xl md:leading-[1.65]" : undefined}>
                  {paragraph}
                </p>
              </FadeUp>
            ))}
          </div>

          {facts.length > 0 && (
            <dl className="mt-10 grid gap-3 sm:grid-cols-2">
              {facts.map((fact, i) => {
                const Icon = factIcon(fact.label);
                return (
                  <FadeUp key={fact.label} delay={0.1 + i * 0.05} className="card card-hover flex items-center gap-4 p-4">
                    <span className="icon-box">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{fact.label}</dt>
                      <dd className="mt-0.5 font-semibold leading-snug">{fact.value}</dd>
                    </div>
                  </FadeUp>
                );
              })}
            </dl>
          )}
        </div>
      </div>
    </Section>
  );
}

/**
 * Cut-out portrait standing in a gradient disc: the photo is clipped to the disc's
 * lower half (rounded-b-full) so the head and shoulders pop out over the top edge.
 */
function Portrait({ photoAvailable, status, badge }: { photoAvailable: boolean; status?: string; badge?: string }) {
  const initials = site.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="relative mx-auto aspect-[1/1.08] w-full max-w-[420px]">
      {/* glow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[4%] bottom-[-6%] top-[18%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.55),rgb(var(--accent-3)/0.25)_55%,transparent)]"
      />
      {/* orbit rings */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[1%] bottom-[-6%] aspect-square animate-spin-slow rounded-full border border-dashed border-line/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-[1%] bottom-[-6%] aspect-square animate-[spin_18s_linear_infinite] rounded-full"
      >
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-2 shadow-[0_0_14px_3px_rgb(var(--accent-2)/0.7)]" />
      </div>
      {/* disc */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[8%] bottom-0 aspect-square overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_20%,rgb(165_180_252/0.9),transparent_45%),linear-gradient(135deg,#4F46E5,#7C3AED_55%,#06B6D4)] shadow-[0_30px_80px_-30px_rgb(79_70_229/0.8)]"
      >
        <div className="grid-bg absolute inset-0 opacity-40 [--line:255_255_255] [background-size:32px_32px]" />
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/25" />
      </div>

      {photoAvailable ? (
        <div className="absolute inset-x-[8%] bottom-0 top-0 overflow-hidden rounded-b-full">
          <div className="absolute bottom-0 left-1/2 aspect-square w-[128%] -translate-x-1/2">
            <Image
              src={about.photo}
              alt={`Portrait of ${site.name}`}
              fill
              sizes="(max-width: 1024px) 90vw, 540px"
              className="object-contain object-bottom drop-shadow-[0_24px_30px_rgba(0,0,0,0.35)]"
            />
          </div>
        </div>
      ) : (
        <span className="absolute inset-x-[8%] bottom-0 flex aspect-square items-center justify-center font-display text-7xl font-extrabold text-white">
          {initials}
        </span>
      )}

      {status && (
        <div className="absolute -left-1 bottom-[12%] inline-flex animate-float items-center gap-2 rounded-full border border-line/10 bg-card/85 px-3.5 py-2 text-[13px] font-semibold shadow-[0_12px_30px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl sm:-left-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {status}
        </div>
      )}
      {badge && (
        <div className="absolute -right-1 top-[34%] inline-flex animate-float items-center gap-2 rounded-full border border-line/10 bg-card/85 px-3.5 py-2 text-[13px] font-semibold shadow-[0_12px_30px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl [animation-delay:-3s] sm:-right-4">
          <Briefcase size={14} className="text-accent-ink" aria-hidden="true" />
          {badge}
        </div>
      )}
    </div>
  );
}
