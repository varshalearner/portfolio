import { readFile, getStorageInfo } from "@/lib/admin/storage";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { Notice } from "@/components/admin/Notice";
import fallback from "@/data/content.json";

export const metadata = { title: "Site content" };

export default async function ContentPage() {
  const storage = getStorageInfo();
  let data: unknown = fallback;
  let loadError: string | null = null;
  try {
    const raw = await readFile("data/content.json");
    if (raw) data = JSON.parse(raw);
  } catch (err) {
    loadError = err instanceof Error ? err.message : String(err);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Site content</h1>
      <p className="mt-1 text-[14px] text-muted">
        Everything a recruiter reads on the home page lives here. Edit a section, then press Save.
      </p>
      {loadError && (
        <Notice variant="error" className="mt-4">
          Could not load the latest content from storage ({loadError}). Showing the version bundled with this deployment.
        </Notice>
      )}
      <ContentEditor initial={data as Record<string, unknown>} storage={storage} />
    </div>
  );
}
