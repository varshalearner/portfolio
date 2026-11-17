import type { Metadata } from "next";
import { Suspense } from "react";
import { blog, site } from "@/data/content";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostList, type PostMeta } from "@/components/PostList";
import { PageGlow } from "@/components/ui/PageGlow";
import { FadeUp } from "@/components/FadeUp";

export const metadata: Metadata = {
  title: blog.heading,
  description: blog.subheading,
  alternates: { canonical: `${site.url}/blog` },
  openGraph: {
    type: "website",
    title: `${blog.heading} — ${site.name}`,
    description: blog.subheading,
    url: `${site.url}/blog`,
  },
};

export default async function BlogPage() {
  const posts: PostMeta[] = (await getAllPosts()).map(({ body: _body, ...meta }) => meta);
  const tags = await getAllTags();

  return (
    <div className="relative">
      <PageGlow />
      <div className="container-site pb-16 pt-32 md:pb-24 md:pt-40">
        <FadeUp>
          <header className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-accent-2" />
              ~/blog
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] md:text-6xl">
              <span className="text-gradient-muted">{blog.heading}</span>
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-muted md:text-lg">{blog.subheading}</p>
          </header>
        </FadeUp>
        <div className="mx-auto max-w-5xl">
          <Suspense fallback={<PostList posts={posts} tags={tags} />}>
            <PostList posts={posts} tags={tags} useQuery />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
