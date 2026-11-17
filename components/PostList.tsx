"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Post } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { cn } from "@/lib/utils";

export type PostMeta = Omit<Post, "body">;

/** Tags are sorted by post count, so the first few are the useful filters. */
const VISIBLE_TAGS = 10;

interface PostListProps {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
  /** When true, reads ?tag= from the URL so filtered views are shareable. */
  useQuery?: boolean;
}

export function PostList(props: PostListProps) {
  if (props.useQuery) return <PostListWithQuery {...props} />;
  return <PostListView {...props} activeTag={null} />;
}

function PostListWithQuery(props: PostListProps) {
  const params = useSearchParams();
  const tag = params.get("tag");
  const activeTag = tag && props.tags.some((t) => t.tag === tag) ? tag : null;
  return <PostListView {...props} activeTag={activeTag} />;
}

function PostListView({ posts, tags, activeTag }: PostListProps & { activeTag: string | null }) {
  const [showAllTags, setShowAllTags] = useState(false);
  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;
  const collapsible = tags.length > VISIBLE_TAGS;
  const visibleTags = showAllTags ? tags : tags.filter((t, i) => i < VISIBLE_TAGS || t.tag === activeTag);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <>
      <nav aria-label="Filter posts by tag" className="mx-auto mt-10 max-w-4xl">
        <ul className="flex flex-wrap justify-center gap-2">
          <li>
            <TagLink href="/blog" active={activeTag === null}>
              All <span className="opacity-60">{posts.length}</span>
            </TagLink>
          </li>
          {visibleTags.map(({ tag, count }) => (
            <li key={tag}>
              <TagLink href={`/blog?tag=${encodeURIComponent(tag)}`} active={activeTag === tag}>
                #{tag} <span className="opacity-60">{count}</span>
              </TagLink>
            </li>
          ))}
          {collapsible && (showAllTags || hiddenCount > 0) && (
            <li>
              <button
                type="button"
                onClick={() => setShowAllTags((v) => !v)}
                aria-expanded={showAllTags}
                className="inline-flex min-h-9 items-center rounded-full border border-dashed border-line/20 px-3.5 font-mono text-[12.5px] text-muted transition-colors hover:border-line/30 hover:text-text"
              >
                {showAllTags ? "Show fewer" : `+${hiddenCount} more`}
              </button>
            </li>
          )}
        </ul>
      </nav>

      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        {activeTag ? ` tagged ${activeTag}` : ""}
      </p>

      <SpotlightGroup as="ul" className="mt-12 grid gap-6 md:grid-cols-2">
        {filtered.map((post) => (
          <li key={post.slug}>
            <PostCard post={post as Post} />
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="card p-10 text-center text-muted md:col-span-2">No posts with this tag yet.</li>
        )}
      </SpotlightGroup>
    </>
  );
}

function TagLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 font-mono text-[12.5px] transition-all duration-200",
        active
          ? "border-transparent bg-[linear-gradient(135deg,rgb(var(--btn-from)),rgb(var(--btn-to)))] text-white shadow-[0_8px_20px_-8px_rgb(var(--btn-from)/0.8)]"
          : "border-line/10 bg-line/[0.03] text-muted hover:border-line/20 hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}
