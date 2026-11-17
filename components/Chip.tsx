import { cn } from "@/lib/utils";

export function Chip({
  children,
  muted = false,
  className,
}: {
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return <span className={cn(muted ? "chip-muted" : "chip", className)}>{children}</span>;
}
