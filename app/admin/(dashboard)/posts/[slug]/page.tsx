import { notFound } from "next/navigation";
import { getAdminPost } from "@/lib/admin/posts";
import { getStorageInfo } from "@/lib/admin/storage";
import { PostEditor } from "@/components/admin/PostEditor";
import { ClearSearchParams } from "@/components/admin/ClearSearchParams";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getAdminPost(params.slug);
  return { title: post ? `Edit: ${post.title}` : "Post not found" };
}

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { saved?: string };
}) {
  const post = await getAdminPost(params.slug);
  if (!post) notFound();
  const storage = getStorageInfo();
  const justSaved = searchParams.saved === "1";

  return (
    <>
      {justSaved && <ClearSearchParams />}
      <PostEditor
        storage={storage}
        originalSlug={post.slug}
        invalidReason={post.valid ? undefined : post.error}
        justSaved={justSaved}
        initial={{
          slug: post.slug,
          title: post.title,
          description: post.description,
          date: post.date,
          tags: post.tags,
          draft: post.draft,
          cover: post.cover ?? "",
          body: post.body,
        }}
      />
    </>
  );
}
