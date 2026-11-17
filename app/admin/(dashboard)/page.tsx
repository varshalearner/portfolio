import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { AlertTriangle, ExternalLink, FileText, PenLine, Pencil, Settings } from "lucide-react";
import { listAdminPosts } from "@/lib/admin/posts";
import { getStorageInfo } from "@/lib/admin/storage";
import { formatDate } from "@/lib/posts";
import { site } from "@/data/content";
import { Notice } from "@/components/admin/Notice";
import { ClearSearchParams } from "@/components/admin/ClearSearchParams";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage({ searchParams }: { searchParams: { deleted?: string } }) {
  const storage = getStorageInfo();
  let posts: Awaited<ReturnType<typeof listAdminPosts>> = [];
  let loadError: string | null = null;
  try {
    posts = await listAdminPosts();
  } catch (err) {
    loadError = err instanceof Error ? err.message : String(err);
  }

  const published = posts.filter((p) => !p.draft && p.valid);
  const drafts = posts.filter((p) => p.draft);
  const invalid = posts.filter((p) => !p.valid);
  const isDev = process.env.NODE_ENV !== "production";
  const inSupabase = storage.posts === "supabase";
  // MDX posts still in the repo that could be imported into an empty Supabase table.
  const mdxDir = path.join(process.cwd(), "content", "blog");
  const mdxCount = fs.existsSync(mdxDir) ? fs.readdirSync(mdxDir).filter((f) => f.endsWith(".mdx")).length : 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-[14px] text-muted">Manage blog posts and the text on every section of the site.</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <PenLine size={18} /> New post
        </Link>
      </div>

      {searchParams.deleted === "1" && (
        <>
          <ClearSearchParams />
          <Notice variant="success" className="mt-6">
            Post deleted.
          </Notice>
        </>
      )}
      {!storage.writable && (
        <Notice variant="warning" className="mt-6">
          <strong>{storage.postsWritable ? "Site content is read-only here." : "Read-only mode."}</strong> {storage.reason}
        </Notice>
      )}
      {inSupabase && (
        <Notice variant="info" className="mt-6">
          Posts are stored in <strong>Supabase</strong>. Saving a post updates the live site within a few seconds, with no
          redeploy.
        </Notice>
      )}
      {inSupabase && !loadError && posts.length === 0 && mdxCount > 0 && (
        <Notice variant="warning" className="mt-6">
          Supabase is connected but has no posts yet. Run <code className="font-mono text-text">npm run posts:import</code> once
          to copy the {mdxCount} posts from <code className="font-mono text-text">content/blog</code>.
        </Notice>
      )}
      {storage.mode === "github" && (
        <Notice variant="info" className="mt-6">
          {inSupabase ? "Site content saves become" : "Every save becomes"} a commit to{" "}
          <span className="font-mono text-text">{storage.repo}</span> on branch{" "}
          <span className="font-mono text-text">{storage.branch}</span>. Vercel redeploys automatically, so changes appear on the live
          site after about a minute.
        </Notice>
      )}
      {loadError && (
        <Notice variant="error" className="mt-6">
          Could not load posts: {loadError}
        </Notice>
      )}

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Published" value={published.length} />
        <Stat label="Drafts" value={drafts.length} hint="Visible only in local dev" />
        <Stat label="Needs attention" value={invalid.length} warn={invalid.length > 0} hint={invalid.length ? (inSupabase ? "Invalid posts are hidden on the site" : "Invalid frontmatter breaks the build") : undefined} />
      </dl>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/admin/content" className="card card-hover flex items-start gap-4 p-5">
          <span className="rounded-lg bg-accent-soft p-2.5 text-accent-ink">
            <Settings size={20} />
          </span>
          <span>
            <span className="block text-[15px] font-semibold">Edit site content</span>
            <span className="mt-1 block text-[13px] leading-relaxed text-muted">
              Hero, about, experience, impact cards, skills, projects, contact and footer.
            </span>
          </span>
        </Link>
        <Link href="/admin/posts/new" className="card card-hover flex items-start gap-4 p-5">
          <span className="rounded-lg bg-accent-soft p-2.5 text-accent-ink">
            <FileText size={20} />
          </span>
          <span>
            <span className="block text-[15px] font-semibold">Write a new post</span>
            <span className="mt-1 block text-[13px] leading-relaxed text-muted">
              Markdown editor with live preview, tags, cover image and draft/publish toggle.
            </span>
          </span>
        </Link>
      </div>

      <section className="mt-10" aria-labelledby="posts-heading">
        <h2 id="posts-heading" className="text-lg font-semibold">
          Posts <span className="font-normal text-muted">({posts.length})</span>
        </h2>
        <div className="card mt-4 overflow-hidden">
          {posts.length === 0 ? (
            <p className="p-8 text-center text-[14px] text-muted">No posts yet. Write your first one.</p>
          ) : (
            <ul className="divide-y divide-border">
              {posts.map((post) => {
                const canView = post.valid && (isDev || !post.draft);
                return (
                  <li key={post.slug} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/posts/${post.slug}`} className="truncate text-[15px] font-semibold hover:text-accent-ink">
                          {post.title}
                        </Link>
                        <StatusPill draft={post.draft} valid={post.valid} />
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-[12px] text-muted">
                        <span>{post.date ? formatDate(post.date) : "no date"}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readingTime}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">/blog/{post.slug}</span>
                      </p>
                      {!post.valid && (
                        <p className="mt-1 flex items-start gap-1.5 text-[12px] text-amber-500">
                          <AlertTriangle size={13} className="mt-0.5 shrink-0" /> {post.error}
                        </p>
                      )}
                      {post.tags.length > 0 && (
                        <p className="mt-1.5 flex flex-wrap gap-1.5">
                          {post.tags.map((t) => (
                            <span key={t} className="chip !text-[11px]">
                              #{t}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link href={`/admin/posts/${post.slug}`} className="btn-secondary !min-h-9 px-3 text-[13px]">
                        <Pencil size={14} /> Edit
                      </Link>
                      {canView && (
                        <a
                          href={storage.mode === "github" ? `${site.url}/blog/${post.slug}` : `/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost !min-h-9 px-3 text-[13px]"
                        >
                          <ExternalLink size={14} /> View
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, hint, warn }: { label: string; value: number; hint?: string; warn?: boolean }) {
  return (
    <div className="card px-5 py-4">
      <dt className="font-mono text-[12px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className={cn("mt-1 text-3xl font-bold", warn && "text-amber-500")}>{value}</dd>
      {hint && <dd className="mt-1 text-[12px] text-muted">{hint}</dd>}
    </div>
  );
}

function StatusPill({ draft, valid }: { draft: boolean; valid: boolean }) {
  if (!valid)
    return <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-500">Invalid</span>;
  if (draft)
    return <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-500">Draft</span>;
  return <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-ink">Published</span>;
}
