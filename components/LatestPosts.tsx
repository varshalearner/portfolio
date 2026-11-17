import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blog } from "@/data/content";
import { getAllPosts, getPublishedPosts } from "@/lib/posts";
import { Section } from "@/components/Section";
import { FadeUp } from "@/components/FadeUp";
import { PostCard } from "@/components/PostCard";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";

export async function LatestPosts() {
  if ((await getPublishedPosts()).length === 0) return null;
  const posts = (await getAllPosts()).slice(0, 3);
  const viewAll = blog.viewAll.replace(/\s*→\s*$/, "");

  return (
    <Section id="writing" eyebrow="Blog" heading={blog.homeHeading} subheading={blog.subheading}>
      <SpotlightGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <FadeUp key={post.slug} delay={i * 0.08} className="h-full">
            <PostCard post={post} compact />
          </FadeUp>
        ))}
      </SpotlightGroup>
      <FadeUp className="mt-12 flex justify-center">
        <Link href="/blog" className="btn-secondary group h-12 px-6">
          {viewAll}
          <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </FadeUp>
    </Section>
  );
}
