import Link from "next/link";
import { site } from "@/data/content";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-7 w-7 rounded-lg text-[11px]",
  md: "h-8 w-8 rounded-lg text-[12px]",
  lg: "h-9 w-9 rounded-xl text-[13px]",
  xl: "h-10 w-10 rounded-xl text-[14px]",
} as const;

/** Gradient "VS" monogram. Decorative: the name next to it carries the meaning. */
export function LogoMark({ size = "lg", className }: { size?: keyof typeof SIZES; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden font-display font-extrabold tracking-tight text-white ring-1 ring-inset ring-white/25",
        SIZES[size],
        "bg-[linear-gradient(135deg,#6366F1_0%,#8B5CF6_55%,#22D3EE_120%)] shadow-[0_8px_24px_-8px_rgb(99_102_241/0.85)]",
        className,
      )}
    >
      <span className="absolute inset-x-0 top-0 h-1/2 bg-white/15" />
      <span className="relative">VS</span>
    </span>
  );
}

export function Logo({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <Link href="/" onClick={onClick} className={cn("group flex items-center gap-2.5 rounded-full", className)}>
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
      <span className="font-display text-[16px] font-bold tracking-tight text-text">{site.name}</span>
    </Link>
  );
}
