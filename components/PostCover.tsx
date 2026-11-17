import Image from "next/image";
import { postIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const PALETTES: [string, string][] = [
  ["var(--accent)", "var(--accent-2)"],
  ["var(--accent-3)", "var(--accent)"],
  ["var(--accent-2)", "var(--accent-3)"],
  ["var(--accent)", "var(--accent-3)"],
];

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Post cover: the frontmatter `cover` image if set, otherwise generated art from the slug and tags. */
export function PostCover({
  slug,
  tags,
  cover,
  compact = false,
}: {
  slug: string;
  tags: string[];
  cover?: string;
  compact?: boolean;
}) {
  const aspect = compact ? "aspect-[2/1]" : "aspect-[12/5]";
  if (cover) {
    return (
      <div className={cn("relative overflow-hidden border-b border-line/10 bg-card", aspect)}>
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 768px) 92vw, 560px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  const [a, b] = PALETTES[hash(slug) % PALETTES.length];
  const Icon = postIcon(tags);
  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden border-b border-line/10", aspect)}
      style={{
        backgroundImage: `radial-gradient(90% 130% at 0% 0%, rgb(${a} / 0.42), transparent 62%), radial-gradient(90% 130% at 100% 100%, rgb(${b} / 0.36), transparent 62%)`,
      }}
    >
      <div className="grid-bg absolute inset-0 [background-size:28px_28px] [mask-image:linear-gradient(to_bottom_right,#000,transparent_80%)]" />
      {tags[0] && (
        <span className="absolute left-5 top-5 rounded-full border border-line/15 bg-bg/40 px-2.5 py-1 font-mono text-[11px] text-text/80 backdrop-blur">
          #{tags[0]}
        </span>
      )}
      <Icon
        className="absolute bottom-5 right-6 h-14 w-14 text-text/75 transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-6"
        strokeWidth={1.25}
      />
    </div>
  );
}
