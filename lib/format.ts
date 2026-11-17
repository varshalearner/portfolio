/** Browser-safe formatting helpers (no Node imports) so client components can use them. */

/** "2026-11-16" -> "16 Nov 2026" */
export function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
