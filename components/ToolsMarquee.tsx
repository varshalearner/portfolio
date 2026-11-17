import { skills } from "@/data/content";
import { skillGroupIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface Tool {
  name: string;
  group: string;
}

/**
 * Two rows of tools scrolling in opposite directions. Decorative (aria-hidden):
 * the Skills section lists the same tools for screen readers.
 */
export function ToolsMarquee() {
  const tools: Tool[] = [
    ...skills.groups.flatMap((g) => g.items.map((name) => ({ name, group: g.name }))),
    ...skills.learning.items.map((name) => ({ name, group: skills.learning.name })),
  ];
  if (tools.length === 0) return null;
  const half = Math.ceil(tools.length / 2);
  const rows = [tools.slice(0, half), tools.slice(half)].filter((row) => row.length > 0);

  return (
    <div aria-hidden="true" className="relative py-8 md:py-12">
      <p className="text-center font-mono text-[11.5px] uppercase tracking-[0.22em] text-muted">Tools I work with</p>
      <div className="mt-7 space-y-3 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        {rows.map((row, r) => (
          <MarqueeRow key={r} tools={row} reverse={r % 2 === 1} />
        ))}
      </div>
    </div>
  );
}

function MarqueeRow({ tools, reverse }: { tools: Tool[]; reverse: boolean }) {
  const duration = `${Math.max(28, tools.length * 3.2)}s`;
  return (
    <div className="group flex overflow-hidden" style={{ "--marquee-duration": duration } as React.CSSProperties}>
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          className={cn(
            "flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {tools.map((tool) => {
            const Icon = skillGroupIcon(tool.group);
            return (
              <li key={`${copy}-${tool.name}`} className="mr-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-line/10 bg-card/60 px-4 py-2 text-[14px] font-medium text-text/80">
                  <Icon size={15} className="text-accent-ink" />
                  {tool.name}
                </span>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
