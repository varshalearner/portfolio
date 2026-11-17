import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "success" | "error" | "info" | "warning";

const styles: Record<Variant, { box: string; icon: React.ReactNode }> = {
  success: { box: "border-accent/40 bg-accent-soft text-text", icon: <CheckCircle2 size={18} className="text-accent-ink" /> },
  error: { box: "border-red-500/40 bg-red-500/10 text-red-500", icon: <AlertTriangle size={18} /> },
  warning: { box: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: <AlertTriangle size={18} /> },
  info: { box: "border-border bg-card text-muted", icon: <Info size={18} /> },
};

export function Notice({
  variant = "info",
  children,
  className,
  role,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  role?: "alert" | "status";
}) {
  const s = styles[variant];
  return (
    <div
      role={role ?? (variant === "error" ? "alert" : "status")}
      className={cn("flex items-start gap-2.5 whitespace-pre-line rounded-lg border px-3.5 py-2.5 text-[14px] leading-relaxed", s.box, className)}
    >
      <span className="mt-0.5 shrink-0">{s.icon}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
