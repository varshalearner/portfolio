/**
 * Copies the MDX posts in content/blog into the Supabase `posts` table.
 *
 *   npm run posts:import                  adds posts that are not in Supabase yet
 *   npm run posts:import -- --overwrite   also replaces posts that already exist
 *
 * Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
 * Run supabase/schema.sql in the Supabase SQL editor first.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add both to .env.local first (see .env.example).");
  process.exit(1);
}

const overwrite = process.argv.includes("--overwrite");
const dir = path.join(process.cwd(), "content", "blog");
if (!fs.existsSync(dir)) {
  console.log("No content/blog folder, so there is nothing to import.");
  process.exit(0);
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const rows = [];
const problems = [];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort()) {
  const slug = file.replace(/\.mdx$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
  const tags = Array.isArray(data.tags) ? data.tags.map((t) => String(t).trim()).filter(Boolean) : [];

  const errors = [];
  if (!SLUG_RE.test(slug)) errors.push("the file name is not a valid slug");
  if (typeof data.title !== "string" || !data.title.trim()) errors.push("missing title");
  if (typeof data.description !== "string" || !data.description.trim()) errors.push("missing description");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("date must be YYYY-MM-DD");
  if (tags.length === 0) errors.push("needs at least one tag");
  if (errors.length) {
    problems.push(`${file}: ${errors.join(", ")}`);
    continue;
  }

  rows.push({
    slug,
    title: data.title.trim(),
    description: data.description.trim(),
    date,
    tags,
    draft: data.draft === true,
    cover: typeof data.cover === "string" && data.cover.trim() ? data.cover.trim() : null,
    body: content.replace(/\r\n/g, "\n").replace(/^\n+/, "").replace(/\s+$/, ""),
  });
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: existing, error: readError } = await supabase.from("posts").select("slug");
if (readError) {
  console.error(`Could not read the posts table: ${readError.message}`);
  if (/api key|jwt|unauthorized/i.test(readError.message)) {
    console.error("Check SUPABASE_SERVICE_ROLE_KEY in .env.local (service_role or Secret key, not the anon key).");
  } else if (/schema cache|does not exist/i.test(readError.message) || ["42P01", "PGRST205"].includes(readError.code)) {
    console.error("Run supabase/schema.sql in the Supabase SQL editor first.");
  }
  process.exit(1);
}

const existingSlugs = new Set((existing ?? []).map((r) => r.slug));
const toWrite = overwrite ? rows : rows.filter((r) => !existingSlugs.has(r.slug));
const skipped = rows.length - toWrite.length;

if (toWrite.length > 0) {
  const { error } = await supabase.from("posts").upsert(toWrite, { onConflict: "slug" });
  if (error) {
    console.error(`Import failed: ${error.message}`);
    process.exit(1);
  }
}

console.log(
  `Imported ${toWrite.length} post(s)` +
    (skipped ? `, skipped ${skipped} already in Supabase (add --overwrite to replace them)` : "") +
    ".",
);
for (const row of toWrite) console.log(`  + ${row.slug}${row.draft ? " (draft)" : ""}`);

if (problems.length > 0) {
  console.warn("\nNot imported. Fix the frontmatter and run again:");
  for (const problem of problems) console.warn(`  - ${problem}`);
  process.exitCode = 1;
}
