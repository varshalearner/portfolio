import { FadeUp } from "@/components/FadeUp";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "center" | "left";
}

export function SectionHeading({ id, eyebrow, heading, subheading, align = "center" }: SectionHeadingProps) {
  return (
    <FadeUp className={cn("mb-12 md:mb-16", align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl")}>
      {eyebrow && (
        <span className="eyebrow">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-accent-2" />
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="mt-5 text-[2.25rem] font-bold leading-[1.1] tracking-[-0.03em] md:text-5xl">
        <span className="text-gradient-muted">{heading}</span>
      </h2>
      {subheading && <p className="mt-4 text-[17px] leading-relaxed text-muted md:text-lg">{subheading}</p>}
    </FadeUp>
  );
}

interface SectionProps {
  id: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "center" | "left";
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, eyebrow, heading, subheading, align, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("relative py-20 md:py-28", className)}>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-container bg-gradient-to-r from-transparent via-line/10 to-transparent"
      />
      <div className="container-site">
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} heading={heading} subheading={subheading} align={align} />
        {children}
      </div>
    </section>
  );
}
