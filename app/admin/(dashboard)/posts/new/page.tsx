import { getStorageInfo } from "@/lib/admin/storage";
import { PostEditor } from "@/components/admin/PostEditor";
import { todayIso } from "@/lib/utils";

export const metadata = { title: "New post" };

const starterBody = `## Why this matters

Start with the problem in two or three sentences. Say who it affected and what it cost (time, bugs, releases).

## What I did

1. First step.
2. Second step.
3. Third step.

\`\`\`python
def test_example(api_client):
    response = api_client.get("/health")
    assert response.status_code == 200
\`\`\`

## The result

- **Measure it:** before → after.
- One more concrete outcome.

## What I learned

- **Lesson one.** One sentence of explanation.
- **Lesson two.** One sentence of explanation.
`;

export default function NewPostPage() {
  const storage = getStorageInfo();
  return (
    <PostEditor
      storage={storage}
      initial={{
        slug: "",
        title: "",
        description: "",
        date: todayIso(),
        tags: [],
        draft: true,
        cover: "",
        body: starterBody,
      }}
    />
  );
}
