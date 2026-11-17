import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getSupabase, isSupabaseConfigured, POST_COLUMNS, POSTS_TABLE, type PostRow } from "@/lib/supabase";

export const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  draft: boolean;
  cover?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  body: string;
  readingTime: string; // e.g. "4 min read"
  words: number;
}

/** Where blog posts live: the Supabase `posts` table when configured, otherwise content/blog/*.mdx. */
export type PostsSource = "supabase" | "files";

export function getPostsSource(): PostsSource {
  return isSupabaseConfigured() ? "supabase" : "files";
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Check a post's metadata. Throws with a clear message naming where the post came
 * from (`where`), so a bad post is reported instead of silently disappearing.
 */
export function validatePostFields(data: Record<string, unknown>, where: string): PostFrontmatter {
  const errors: string[] = [];

  const title = data.title;
  if (typeof title !== "string" || title.trim() === "") errors.push("`title` must be a non-empty string");

  const description = data.description;
  if (typeof description !== "string" || description.trim() === "")
    errors.push("`description` must be a non-empty string");

  const rawDate = data.date;
  const date = rawDate instanceof Date ? rawDate.toISOString().slice(0, 10) : rawDate;
  if (typeof date !== "string" || !DATE_RE.test(date) || Number.isNaN(Date.parse(date)))
    errors.push('`date` must be a quoted string in YYYY-MM-DD format, e.g. "2026-11-20"');

  const tags = data.tags;
  if (!Array.isArray(tags) || tags.length === 0 || !tags.every((t) => typeof t === "string" && t.trim() !== ""))
    errors.push("`tags` must be a non-empty array of strings");

  const draft = data.draft;
  if (draft !== undefined && typeof draft !== "boolean") errors.push("`draft` must be true or false");

  const cover = data.cover;
  if (cover !== undefined && cover !== null && typeof cover !== "string")
    errors.push("`cover` must be an image path or URL");

  if (errors.length) {
    throw new Error(`Invalid ${where}:\n  - ${errors.join("\n  - ")}`);
  }

  return {
    title: (title as string).trim(),
    description: (description as string).trim(),
    date: date as string,
    tags: (tags as string[]).map((t) => t.trim()),
    draft: draft === true,
    cover: typeof cover === "string" && cover.trim() !== "" ? cover.trim() : undefined,
  };
}

/** Frontmatter check for an MDX file in content/blog. */
export function validateFrontmatter(file: string, data: Record<string, unknown>): PostFrontmatter {
  return validatePostFields(data, `frontmatter in content/blog/${file}`);
}

function toPost(fm: PostFrontmatter, slug: string, body: string): Post {
  const stats = readingTime(body);
  return { ...fm, slug, body, readingTime: stats.text, words: stats.words };
}

/** Drafts are visible in `next dev` and hidden in production builds. */
export function isDraftVisible(): boolean {
  return process.env.NODE_ENV !== "production";
}

/* ---------------- Source: MDX files ---------------- */

function readFilePosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return toPost(validateFrontmatter(file, data), file.replace(/\.mdx$/, ""), content);
    });
}

/* ---------------- Source: Supabase ---------------- */

async function readSupabasePosts(includeDrafts: boolean): Promise<Post[]> {
  let query = getSupabase("cached").from(POSTS_TABLE).select(POST_COLUMNS).order("date", { ascending: false });
  if (!includeDrafts) query = query.eq("draft", false);
  const { data, error } = await query;
  if (error) {
    throw new Error(`Could not load posts from Supabase: ${error.message}. Did you run supabase/schema.sql?`);
  }
  const posts: Post[] = [];
  for (const row of (data ?? []) as PostRow[]) {
    try {
      const fm = validatePostFields(row as unknown as Record<string, unknown>, `post "${row.slug}" in Supabase`);
      posts.push(toPost(fm, row.slug, row.body ?? ""));
    } catch (err) {
      // The admin validates before saving, so this only happens after manual edits in the
      // Supabase dashboard. Skip the row instead of taking the whole blog down.
      console.error(err instanceof Error ? err.message : err);
    }
  }
  return posts;
}

/* ---------------- Public API ---------------- */

function sortNewestFirst(posts: Post[]): Post[] {
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

/** All posts the current environment may show, newest first. */
export async function getAllPosts(): Promise<Post[]> {
  const includeDrafts = isDraftVisible();
  const posts = getPostsSource() === "supabase" ? await readSupabasePosts(includeDrafts) : readFilePosts();
  return sortNewestFirst(includeDrafts ? posts : posts.filter((p) => !p.draft));
}

/** Only non-draft posts, newest first (used for RSS, sitemap and metadata). */
export async function getPublishedPosts(): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => !p.draft);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug);
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const post of await getAllPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Previous = older post, next = newer post (list is newest first). */
export async function getAdjacentPosts(slug: string): Promise<{ previous?: Post; next?: Post }> {
  const posts = await getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  return {
    next: index > 0 ? posts[index - 1] : undefined,
    previous: index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export { formatDate } from "./format";
