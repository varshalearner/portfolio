import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { PostCover } from "@/components/PostCover";
import { cn } from "@/lib/utils";

export function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <article className="card card-hover spotlight group relative flex h-full flex-col overflow-hidden">
      <PostCover slug={post.slug} tags={post.tags} cover={post.cover} compact={compact} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[12.5px] text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={13} aria-hidden="true" /> {post.readingTime}
          </span>
          {post.draft && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-amber-500">
              Draft
            </span>
          )}
        </div>
        <h3
          className={cn(
            "mt-3 font-bold leading-snug tracking-tight transition-colors group-hover:text-accent-ink",
            compact ? "text-[1.15rem]" : "text-xl",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:z-10 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-3 flex-1 text-[15px] leading-relaxed text-muted">{post.description}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
            {post.tags.slice(0, compact ? 2 : 3).map((tag) => (
              <li key={tag}>
                <span className="chip-muted">#{tag}</span>
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line/10 text-muted transition-all duration-300 group-hover:border-transparent group-hover:bg-accent group-hover:text-white dark:group-hover:text-[#040616]"
          >
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}
