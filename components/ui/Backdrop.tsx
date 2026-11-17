/**
 * Fixed ambient background for the public site: three slow-drifting color glows
 * plus a faint noise texture. Gradients (not blur filters) keep it cheap to paint.
 */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -left-[18%] -top-[28%] h-[75vmax] w-[75vmax] animate-aurora rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(var(--glow-1) / var(--glow-strength)), transparent)" }}
      />
      <div
        className="absolute -right-[22%] -top-[12%] h-[62vmax] w-[62vmax] animate-aurora rounded-full [animation-delay:-7s]"
        style={{
          background: "radial-gradient(closest-side, rgb(var(--glow-2) / calc(var(--glow-strength) * 0.75)), transparent)",
        }}
      />
      <div
        className="absolute left-[18%] top-[58%] h-[52vmax] w-[52vmax] animate-aurora rounded-full [animation-delay:-13s]"
        style={{
          background: "radial-gradient(closest-side, rgb(var(--glow-3) / calc(var(--glow-strength) * 0.4)), transparent)",
        }}
      />
      <div className="noise absolute inset-0 opacity-[0.03] dark:opacity-[0.045]" />
    </div>
  );
}
