import { Telescope } from "lucide-react";
import { skills } from "@/data/content";
import { Section } from "@/components/Section";
import { FadeUp } from "@/components/FadeUp";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { skillGroupIcon } from "@/lib/icons";

export function Skills() {
  return (
    <Section id="skills" eyebrow="Toolbox" heading={skills.heading}>
      <SpotlightGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.groups.map((group, i) => {
          const Icon = skillGroupIcon(group.name);
          return (
            <FadeUp key={group.name} delay={(i % 4) * 0.06} className="card card-hover spotlight p-6">
              <span className="icon-box">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{group.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={group.name}>
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="chip">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          );
        })}

        {skills.learning.items.length > 0 && (
          <FadeUp delay={(skills.groups.length % 4) * 0.06} className="card spotlight border-dashed border-line/20 p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-line/20 text-muted">
                <Telescope size={20} aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" aria-hidden="true" />
                In progress
              </span>
            </div>
            <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{skills.learning.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={skills.learning.name}>
              {skills.learning.items.map((item) => (
                <li key={item}>
                  <span className="chip-muted">{item}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        )}
      </SpotlightGroup>
    </Section>
  );
}
