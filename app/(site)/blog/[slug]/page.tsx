import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { about, blog, site } from "@/data/content";
import { formatDate, getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/posts";
import { extractToc } from "@/lib/toc";
import { hasFile } from "@/lib/site";
import { mdxComponents } from "@/components/MDXComponents";
import { TableOfContents } from "@/components/TableOfContents";
import { Chip } from "@/components/Chip";
import { LinkedInIcon } from "@/components/Icons";
import { PageGlow } from "@/components/ui/PageGlow";

// Posts published from the admin after a deploy render on first visit, then stay cached.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

function ogImageFor(post: { title: string; date: string; tags: string[] }) {
  const params = new URLSearchParams({
    title: post.title,
    date: formatDate(post.date),
    tags: post.tags.join(","),
  });
  return `/api/og?${params.toString()}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const url = `${site.url}/blog/${post.slug}`;
  const image = ogImageFor(post);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { dark: "github-dark-dimmed", light: "github-light" },
  keepBackground: false,
  defaultLang: "text",
};

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.body,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
      },
    },
  });

  const toc = extractToc(post.body);
  const { previous, next } = await getAdjacentPosts(post.slug);
  const photoAvailable = hasFile(about.photo);
  const url = `${site.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(", "),
    url,
    mainEntityOfPage: url,
    image: `${site.url}${ogImageFor(post)}`,
    author: { "@type": "Person", name: site.name, url: site.url },
    publisher: { "@type": "Person", name: site.name },
  };

  return (
    <div className="relative">
      <PageGlow />
      <div className="container-site pb-16 pt-28 md:pb-24 md:pt-36">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="mx-auto max-w-post lg:grid lg:max-w-[1000px] lg:grid-cols-[minmax(0,720px)_1fr] lg:gap-14">
          <article>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full border border-line/10 bg-line/[0.03] px-3.5 py-1.5 text-[13.5px] font-medium text-muted transition-colors hover:border-line/20 hover:text-text"
            >
              <ArrowLeft size={16} aria-hidden="true" /> All posts
            </Link>

            <header className="mt-6">
              <h1 className="text-[2.1rem] font-extrabold leading-[1.12] tracking-[-0.03em] md:text-[2.9rem]">{post.title}</h1>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[14px] text-muted">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} aria-hidden="true" /> {post.readingTime}
                </span>
                {post.draft && (
                  <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-500">
                    Draft · hidden in production
                  </span>
                )}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link href={`/blog?tag=${encodeURIComponent(tag)}`} className="chip hover:bg-accent/20">
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
              {post.cover && (
                <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-line/10 bg-card">
                  <Image src={post.cover} alt="" fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" priority />
                </div>
              )}
            </header>

            {toc.length > 0 && (
              <details className="card mt-8 px-5 py-3 lg:hidden">
                <summary className="cursor-pointer text-[14px] font-semibold">On this page</summary>
                <TableOfContents items={toc} inline />
              </details>
            )}

            <div className="prose prose-lg mt-8 dark:prose-invert">{content}</div>

            <footer className="mt-14 border-t border-line/10 pt-8">
              <nav aria-label="Adjacent posts" className="grid gap-4 sm:grid-cols-2">
                {previous ? (
                  <Link href={`/blog/${previous.slug}`} className="card card-hover group p-5">
                    <span className="inline-flex items-center gap-1 font-mono text-[12px] uppercase tracking-wide text-muted">
                      <ArrowLeft size={13} aria-hidden="true" /> Previous post
                    </span>
                    <span className="mt-2 block text-[15px] font-semibold leading-snug group-hover:text-accent-ink">{previous.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link href={`/blog/${next.slug}`} className="card card-hover group p-5 text-right">
                    <span className="inline-flex items-center gap-1 font-mono text-[12px] uppercase tracking-wide text-muted">
                      Next post <ArrowRight size={13} aria-hidden="true" />
                    </span>
                    <span className="mt-2 block text-[15px] font-semibold leading-snug group-hover:text-accent-ink">{next.title}</span>
                  </Link>
                )}
              </nav>

              <div className="card mt-8 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[linear-gradient(135deg,#4F46E5,#7C3AED_55%,#06B6D4)] ring-2 ring-accent/30 ring-offset-2 ring-offset-bg">
                  {photoAvailable ? (
                    <Image src={about.photo} alt="" fill sizes="64px" className="object-cover object-top" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-white">VS</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold">Written by {site.name}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{blog.authorLine}</p>
                </div>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary !min-h-10 text-[14px]">
                  <LinkedInIcon size={16} /> Connect on LinkedIn
                </a>
              </div>
            </footer>
          </article>

          <aside className="hidden lg:block">
            {toc.length > 0 && (
              <div className="sticky top-24">
                <p className="font-mono text-[12px] uppercase tracking-wide text-muted">On this page</p>
                <TableOfContents items={toc} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
