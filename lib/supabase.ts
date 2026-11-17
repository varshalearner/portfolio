/**
 * Supabase access for blog posts and post images.
 *
 * Server-only: the service role / secret key bypasses row level security, so it
 * must never reach the browser. `import "server-only"` makes the build fail if a
 * client component ever imports this file.
 *
 * Setup: run supabase/schema.sql once in the Supabase SQL editor, then set
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.example). Without them the
 * site falls back to the MDX files in content/blog.
 */
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const POSTS_TABLE = "posts";
export const IMAGES_BUCKET = "blog-images";
/** Cache tag on every public post query. Admin saves call revalidateTag(POSTS_TAG). */
export const POSTS_TAG = "posts";

/** Columns the site reads, in the shape stored in the `posts` table. */
export const POST_COLUMNS = "slug,title,description,date,tags,draft,cover,body";

export interface PostRow {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  cover: string | null;
  body: string;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

type ClientKind = "cached" | "fresh";
const clients: Partial<Record<ClientKind, SupabaseClient>> = {};

/**
 * - "cached": public pages. Responses go through Next's data cache, tagged POSTS_TAG,
 *   so pages stay static and refresh the moment the admin saves (or hourly at most).
 * - "fresh": admin pages and writes. Never cached.
 */
export function getSupabase(kind: ClientKind = "fresh"): SupabaseClient {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  const existing = clients[kind];
  if (existing) return existing;

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) =>
        fetch(
          input,
          kind === "cached"
            ? { ...init, next: { tags: [POSTS_TAG], revalidate: 3600 } }
            : { ...init, cache: "no-store" },
        ),
    },
  });
  clients[kind] = client;
  return client;
}

/** Turns a PostgREST error into a message the owner can act on. */
export function describeSupabaseError(error: { message: string; code?: string }, action: string): Error {
  const missingTable = error.code === "42P01" || error.code === "PGRST205" || /schema cache|does not exist/i.test(error.message);
  if (missingTable) {
    return new Error(
      `Supabase ${action} failed: the "${POSTS_TABLE}" table does not exist yet. Run supabase/schema.sql in the Supabase SQL editor.`,
    );
  }
  if (error.code === "23505") {
    return new Error("A post with this slug already exists. Pick another slug.");
  }
  if (/invalid api key|jwt|unauthorized/i.test(error.message)) {
    return new Error(`Supabase ${action} failed: SUPABASE_SERVICE_ROLE_KEY is wrong or expired.`);
  }
  return new Error(`Supabase ${action} failed: ${error.message}`);
}
