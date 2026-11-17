import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, Download, Mail } from "lucide-react";
import { hero, site, skills } from "@/data/content";
import { FadeUp } from "@/components/FadeUp";
import { WordReveal } from "@/components/ui/WordReveal";
import { TestRunner } from "@/components/TestRunner";
import { HeroStats } from "@/components/HeroStats";
import { GitHubIcon, LinkedInIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

/** Tools shown as floating chips around the terminal, if they appear in Skills. */
const FLOATING_TOOLS = ["pytest", "k6", "Chaos Mesh", "Kubernetes", "Rest Assured", "Jenkins"];

export function Hero({ resumeAvailable }: { resumeAvailable: boolean }) {
  // Hide the resume button until public/resume.pdf exists; promote the next button if needed.
  const buttons = hero.buttons.filter((b) => b.href !== site.resume || resumeAvailable);
  const hasPrimary = buttons.some((b) => b.variant === "primary");

  const allTools = skills.groups.flatMap((g) => g.items.map((name) => ({ name, group: g.name })));
  const preferred = FLOATING_TOOLS.flatMap((name) => allTools.filter((t) => t.name.toLowerCase() === name.toLowerCase()));
  const floating = (preferred.length >= 3 ? preferred : allTools).slice(0, 3);

  const labelParts = hero.label
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section id="home" aria-label="Introduction" className="relative isolate overflow-hidden pb-6 pt-32 md:pt-36">
      <HeroBackdrop />

      <div className="container-site">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <FadeUp>
              <p className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-success/25 bg-success/10 py-1.5 pl-3 pr-4 text-[13px] font-medium text-text/90">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                <span>{hero.status}</span>
              </p>
            </FadeUp>

            <FadeUp delay={0.08}>
              <p className="mt-7 font-display text-xl font-medium text-muted md:text-2xl">Hi, I&apos;m</p>
              <h1 className="mt-1 pb-2 text-[3.1rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-7xl lg:text-[4.25rem] xl:text-[5rem]">
                <span className="text-gradient animate-gradient-x bg-[length:200%_auto]">{hero.name}</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.16}>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-xl font-semibold tracking-tight text-text/90 md:text-2xl">
                {labelParts.map((part, i) => (
                  <Fragment key={part}>
                    {i > 0 && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    <span>{part}</span>
                  </Fragment>
                ))}
              </p>
            </FadeUp>

            <WordReveal
              text={hero.tagline}
              delay={0.3}
              className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted md:text-lg"
            />

            <FadeUp delay={0.45}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {buttons.map((button, i) => {
                  const primary = button.variant === "primary" || (!hasPrimary && i === 0);
                  const classes = cn(primary ? "btn-primary" : "btn-secondary", "group h-12 px-6");
                  if (button.href === site.resume) {
                    return (
                      <a key={button.label} href={button.href} download className={classes}>
                        <Download size={18} aria-hidden="true" /> {button.label}
                      </a>
                    );
                  }
                  const href = button.href.startsWith("#") ? `/${button.href}` : button.href;
                  return (
                    <Link key={button.label} href={href} className={classes}>
                      {button.label}
                      <ArrowRight size={17} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
                <span aria-hidden="true" className="mx-1 hidden h-6 w-px bg-line/15 sm:block" />
                <div className="flex items-center gap-2">
                  <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon-btn">
                    <GitHubIcon size={17} />
                  </a>
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-btn">
                    <LinkedInIcon size={16} />
                  </a>
                  <a href={`mailto:${site.email}`} aria-label="Email" className="icon-btn">
                    <Mail size={17} />
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.25} className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <TestRunner command={hero.terminal.command} output={hero.terminal.output} tools={floating} />
          </FadeUp>
        </div>

        <HeroStats />
      </div>
    </section>
  );
}

/** Grid that fades out from the top, plus three soft light beams that sweep in on load. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_30%,transparent_100%)]" />
      <div className="beam absolute -left-[12%] -top-[32%] h-[64rem] w-[24rem] animate-beam opacity-0 [--beam-rot:-38deg]" />
      <div className="beam absolute left-[32%] -top-[42%] h-[56rem] w-[13rem] animate-beam opacity-0 [--beam-rot:-24deg] [animation-delay:0.45s]" />
      <div className="beam-violet absolute -right-[8%] -top-[34%] h-[60rem] w-[22rem] animate-beam opacity-0 [--beam-rot:34deg] [animation-delay:0.3s]" />
    </div>
  );
}
