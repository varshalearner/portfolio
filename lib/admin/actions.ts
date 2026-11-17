"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { validatePostFields } from "@/lib/posts";
import { getSupabase, IMAGES_BUCKET, POSTS_TAG } from "@/lib/supabase";
import { adminEnabled, clearSession, requireAdmin, setSession, verifyPassword } from "./auth";
import { validateContent } from "./contentSchema";
import { deletePost, getAdminPost, postExists, savePost, SLUG_RE } from "./posts";
import { getStorageInfo, writeFile } from "./storage";

export type SaveMode = "github" | "local" | "supabase";

export type ActionResult<T = Record<never, never>> =
  | ({ ok: true; message: string; mode: SaveMode } & T)
  | { ok: false; error: string };

export interface LoginState {
  error?: string;
}

/* ---------------- Login rate limiting (per server instance) ---------------- */
const attempts = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function clientKey(): string {
  const h = headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(key, recent);
  return recent.length >= MAX_ATTEMPTS;
}

function recordAttempt(key: string): void {
  attempts.set(key, [...(attempts.get(key) ?? []), Date.now()]);
}

/* ---------------- Helpers ---------------- */

/** Where a save of this kind goes: posts can live in Supabase, site content is always files. */
function saveMode(kind: "post" | "content"): SaveMode {
  const info = getStorageInfo();
  return kind === "post" && info.posts === "supabase" ? "supabase" : info.mode;
}

function successMessage(what: string, kind: "post" | "content"): string {
  const info = getStorageInfo();
  const mode = saveMode(kind);
  if (mode === "supabase") return `${what} saved to Supabase. The live site updates within a few seconds.`;
  if (mode === "github") return `${what} committed to ${info.repo} (${info.branch}). Vercel will redeploy in about a minute.`;
  return `${what} saved to the local files.`;
}

function revalidateSite(): void {
  revalidateTag(POSTS_TAG);
  for (const p of ["/", "/blog", "/rss.xml", "/sitemap.xml"]) revalidatePath(p);
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin", "layout");
}

function errorResult(err: unknown): ActionResult<never> {
  return { ok: false, error: err instanceof Error ? err.message : String(err) };
}

/* ---------------- Auth ---------------- */

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminEnabled()) return { error: "The admin panel is disabled: set ADMIN_PASSWORD first." };
  const key = clientKey();
  if (tooManyAttempts(key)) return { error: "Too many attempts. Try again in 15 minutes." };
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    recordAttempt(key);
    return { error: "Wrong password." };
  }
  setSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  clearSession();
  redirect("/admin/login");
}

/* ---------------- Posts ---------------- */

export interface SavePostInput {
  originalSlug?: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  cover: string;
  body: string;
}

export async function savePostAction(input: SavePostInput): Promise<ActionResult<{ slug: string }>> {
  try {
    requireAdmin();
    const slug = input.slug.trim();
    if (!SLUG_RE.test(slug)) return { ok: false, error: "Slug may only contain lowercase letters, numbers and single hyphens." };

    const fm = validatePostFields(
      {
        title: input.title,
        description: input.description,
        date: input.date,
        tags: input.tags.map((t) => t.trim()).filter(Boolean),
        draft: input.draft,
        cover: input.cover.trim() || undefined,
      },
      "post",
    );
    if (input.body.trim() === "") return { ok: false, error: "The post body is empty." };

    const renaming = Boolean(input.originalSlug && input.originalSlug !== slug);
    const isNew = !input.originalSlug;
    if ((isNew || renaming) && (await postExists(slug))) {
      return { ok: false, error: `A post with the slug "${slug}" already exists. Pick another slug.` };
    }

    await savePost(slug, fm, input.body, input.originalSlug);
    revalidateSite();
    return { ok: true, slug, mode: saveMode("post"), message: successMessage(`Post “${fm.title}”`, "post") };
  } catch (err) {
    return errorResult(err);
  }
}

export async function deletePostAction(slug: string): Promise<ActionResult> {
  try {
    requireAdmin();
    if (!SLUG_RE.test(slug)) return { ok: false, error: "Invalid slug." };
    const post = await getAdminPost(slug);
    if (!post) return { ok: false, error: "Post not found." };
    await deletePost(slug, post.title);
    revalidateSite();
    return { ok: true, mode: saveMode("post"), message: successMessage(`Post “${post.title}” deleted;`, "post") };
  } catch (err) {
    return errorResult(err);
  }
}

/* ---------------- Site content ---------------- */

export async function saveContentAction(json: string): Promise<ActionResult> {
  try {
    requireAdmin();
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return { ok: false, error: "The content is not valid JSON." };
    }
    const problems = validateContent(parsed);
    if (problems.length) return { ok: false, error: `Please fix these fields:\n• ${problems.join("\n• ")}` };

    await writeFile("data/content.json", `${JSON.stringify(parsed, null, 2)}\n`, "admin: update site content");
    revalidateSite();
    return { ok: true, mode: saveMode("content"), message: successMessage("Site content", "content") };
  } catch (err) {
    return errorResult(err);
  }
}

/* ---------------- Images ---------------- */

// No SVG: an SVG can carry scripts, and uploads are served from a public URL.
const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export async function uploadImageAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
  try {
    requireAdmin();
    const file = formData.get("file");
    const prefix = String(formData.get("prefix") ?? "image");
    if (!(file instanceof File)) return { ok: false, error: "No file received." };
    const ext = IMAGE_TYPES[file.type];
    if (!ext) return { ok: false, error: "Only PNG, JPG, WebP or GIF images are allowed." };
    if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: "Image is larger than 2 MB. Please compress it first." };

    const safePrefix = prefix.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
    const name = `${safePrefix}-${Date.now().toString(36)}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    if (saveMode("post") === "supabase") {
      const bucket = getSupabase("fresh").storage.from(IMAGES_BUCKET);
      const { error } = await bucket.upload(name, bytes, { contentType: file.type, cacheControl: "31536000", upsert: false });
      if (error) {
        const hint = /not found/i.test(error.message) ? ` Run supabase/schema.sql: it creates the "${IMAGES_BUCKET}" bucket.` : "";
        return { ok: false, error: `Image upload to Supabase failed: ${error.message}.${hint}` };
      }
      const url = bucket.getPublicUrl(name).data.publicUrl;
      return { ok: true, url, mode: "supabase", message: `Image ${name} uploaded to Supabase Storage.` };
    }

    await writeFile(`public/blog/${name}`, bytes, `admin: upload image ${name}`);
    return { ok: true, url: `/blog/${name}`, mode: saveMode("post"), message: successMessage(`Image ${name}`, "post") };
  } catch (err) {
    return errorResult(err);
  }
}
