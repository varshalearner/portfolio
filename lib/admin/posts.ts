/**
 * Blog post storage for the admin panel.
 *
 * - Supabase (when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set): posts are rows in
 *   the `posts` table. Saves are live within seconds, no redeploy.
 * - Files (fallback): posts are content/blog/<slug>.mdx, written locally in dev or
 *   committed to GitHub in production (see ./storage.ts).
 */
import matter from "gray-matter";
import readingTime from "reading-time";
import { getPostsSource, validatePostFields, type PostFrontmatter } from "@/lib/posts";
import { describeSupabaseError, getSupabase, POST_COLUMNS, POSTS_TABLE, type PostRow } from "@/lib/supabase";
import { deleteFile, fileExists, listDir, readFile, writeFile } from "./storage";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const POSTS_PATH = "content/blog";

export interface AdminPost extends PostFrontmatter {
  slug: string;
  body: string;
  readingTime: string;
  words: number;
  /** False when the post's metadata would fail validation (files: breaks the build; Supabase: hidden on the site). */
  valid: boolean;
  error?: string;
}

function normalizeBody(body: string): string {
  return body.replace(/\r\n/g, "\n").replace(/^\n+/, "").replace(/\s+$/, "");
}

/** Builds an AdminPost from raw metadata, keeping invalid posts visible so they can be fixed. */
function toAdminPost(slug: string, data: Record<string, unknown>, body: string, where: string): AdminPost {
  const stats = readingTime(body);
  try {
    const fm = validatePostFields(data, where);
    return { ...fm, slug, body, readingTime: stats.text, words: stats.words, valid: true };
  } catch (err) {
    const rawDate = data.date;
    const date = rawDate instanceof Date ? rawDate.toISOString().slice(0, 10) : String(rawDate ?? "");
    return {
      slug,
      title: typeof data.title === "string" && data.title ? data.title : slug,
      description: typeof data.description === "string" ? data.description : "",
      date,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      draft: data.draft === true,
      cover: typeof data.cover === "string" && data.cover ? data.cover : undefined,
      body,
      readingTime: stats.text,
      words: stats.words,
      valid: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function sortNewestFirst<T extends { date: string; slug: string }>(posts: T[]): T[] {
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

/* ---------------- Files ---------------- */

export function parseAdminPost(file: string, raw: string): AdminPost {
  const slug = file.replace(/\.mdx$/, "");
  try {
    const { data, content } = matter(raw);
    return toAdminPost(slug, data, content.replace(/^\n+/, ""), `frontmatter in content/blog/${file}`);
  } catch (err) {
    // The YAML itself could not be parsed.
    const post = toAdminPost(slug, {}, raw, `content/blog/${file}`);
    return { ...post, error: err instanceof Error ? err.message : String(err) };
  }
}

/** Builds the .mdx file text with the same frontmatter style as the template post. */
export function serializePost(fm: PostFrontmatter, body: string): string {
  const lines = [
    "---",
    `title: ${JSON.stringify(fm.title)}`,
    `description: ${JSON.stringify(fm.description)}`,
    `date: ${JSON.stringify(fm.date)}`,
    `tags: [${fm.tags.map((t) => JSON.stringify(t)).join(", ")}]`,
    `draft: ${fm.draft ? "true" : "false"}`,
  ];
  if (fm.cover) lines.push(`cover: ${JSON.stringify(fm.cover)}`);
  lines.push("---", "");
  return `${lines.join("\n")}\n${normalizeBody(body)}\n`;
}

/* ---------------- Supabase ---------------- */

function rowToAdminPost(row: PostRow): AdminPost {
  return toAdminPost(row.slug, row as unknown as Record<string, unknown>, row.body ?? "", `post "${row.slug}" in Supabase`);
}

/* ---------------- Public API ---------------- */

export async function listAdminPosts(): Promise<AdminPost[]> {
  if (getPostsSource() === "supabase") {
    const { data, error } = await getSupabase("fresh").from(POSTS_TABLE).select(POST_COLUMNS);
    if (error) throw describeSupabaseError(error, "read");
    return sortNewestFirst(((data ?? []) as PostRow[]).map(rowToAdminPost));
  }
  const files = (await listDir(POSTS_PATH)).filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => parseAdminPost(file, (await readFile(`${POSTS_PATH}/${file}`)) ?? "")),
  );
  return sortNewestFirst(posts);
}

export async function getAdminPost(slug: string): Promise<AdminPost | null> {
  if (!SLUG_RE.test(slug)) return null;
  if (getPostsSource() === "supabase") {
    const { data, error } = await getSupabase("fresh").from(POSTS_TABLE).select(POST_COLUMNS).eq("slug", slug).maybeSingle();
    if (error) throw describeSupabaseError(error, "read");
    return data ? rowToAdminPost(data as PostRow) : null;
  }
  const raw = await readFile(`${POSTS_PATH}/${slug}.mdx`);
  return raw === null ? null : parseAdminPost(`${slug}.mdx`, raw);
}

export async function postExists(slug: string): Promise<boolean> {
  if (getPostsSource() === "supabase") {
    const { data, error } = await getSupabase("fresh").from(POSTS_TABLE).select("slug").eq("slug", slug).maybeSingle();
    if (error) throw describeSupabaseError(error, "read");
    return data !== null;
  }
  return fileExists(`${POSTS_PATH}/${slug}.mdx`);
}

/**
 * Creates a post (no originalSlug) or updates one, renaming it when the slug changed.
 * Callers validate the fields and check slug collisions first.
 */
export async function savePost(slug: string, fm: PostFrontmatter, body: string, originalSlug?: string): Promise<void> {
  if (getPostsSource() === "supabase") {
    const row: PostRow = {
      slug,
      title: fm.title,
      description: fm.description,
      date: fm.date,
      tags: fm.tags,
      draft: fm.draft,
      cover: fm.cover ?? null,
      body: normalizeBody(body),
    };
    const db = getSupabase("fresh").from(POSTS_TABLE);
    if (!originalSlug) {
      const { error } = await db.insert(row);
      if (error) throw describeSupabaseError(error, "save");
      return;
    }
    const { data, error } = await db.update(row).eq("slug", originalSlug).select("slug");
    if (error) throw describeSupabaseError(error, "save");
    if (!data || data.length === 0) throw new Error(`Post "${originalSlug}" no longer exists. It may have been deleted.`);
    return;
  }

  const verb = originalSlug ? "update" : "add";
  await writeFile(`${POSTS_PATH}/${slug}.mdx`, serializePost(fm, body), `admin: ${verb} post "${fm.title}"`);
  if (originalSlug && originalSlug !== slug) {
    await deleteFile(`${POSTS_PATH}/${originalSlug}.mdx`, `admin: rename post ${originalSlug} → ${slug}`);
  }
}

export async function deletePost(slug: string, title: string): Promise<void> {
  if (getPostsSource() === "supabase") {
    const { error } = await getSupabase("fresh").from(POSTS_TABLE).delete().eq("slug", slug);
    if (error) throw describeSupabaseError(error, "delete");
    return;
  }
  await deleteFile(`${POSTS_PATH}/${slug}.mdx`, `admin: delete post "${title}"`);
}
