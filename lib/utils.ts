/** Join class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** A value wrapped in [SQUARE BRACKETS] is a placeholder the owner still has to fill in. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.trim().startsWith("[");
}

/** True when a URL is usable for a link (not empty, not a placeholder). */
export function isUsableUrl(value: string | undefined | null): value is string {
  return !isPlaceholder(value);
}

/** "Hello World!" -> "hello-world" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
