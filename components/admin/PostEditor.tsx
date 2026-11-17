"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bold,
  Code,
  Eye,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  PenLine,
  Quote,
  Save,
  Table,
  Trash2,
  Upload,
} from "lucide-react";
import { deletePostAction, savePostAction, uploadImageAction, type SavePostInput } from "@/lib/admin/actions";
import type { StorageInfo } from "@/lib/admin/storage";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import { TagInput } from "@/components/admin/TagInput";
import { Notice } from "@/components/admin/Notice";
import { cn, slugify } from "@/lib/utils";

export interface PostDraft {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  cover: string;
  body: string;
}

interface PostEditorProps {
  initial: PostDraft;
  originalSlug?: string;
  storage: StorageInfo;
  invalidReason?: string;
  /** Set after a create or rename redirected here, to confirm the save. */
  justSaved?: boolean;
}

type View = "write" | "split" | "preview";
type Status = { kind: "success" | "error" | "info"; text: string } | null;

function savedMessage(storage: StorageInfo): string {
  if (storage.posts === "supabase") return "Post saved to Supabase. The live site updates within a few seconds.";
  if (storage.mode === "github") return `Post committed to ${storage.repo}. Vercel will redeploy in about a minute.`;
  return "Post saved to the local files.";
}

function formatDisplayDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function PostEditor({ initial, originalSlug, storage, invalidReason, justSaved = false }: PostEditorProps) {
  const router = useRouter();
  const isNew = !originalSlug;
  const [post, setPost] = useState<PostDraft>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [view, setView] = useState<View>("write");
  const [status, setStatus] = useState<Status>(
    invalidReason
      ? { kind: "error", text: `This post has invalid fields: ${invalidReason}` }
      : justSaved
        ? { kind: "success", text: savedMessage(storage) }
        : null,
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const savedJson = useRef(JSON.stringify(initial));
  const dirty = JSON.stringify(post) !== savedJson.current;
  // Set right before an intentional full-page navigation (after save or delete).
  const leaving = useRef(false);

  const update = <K extends keyof PostDraft>(key: K, value: PostDraft[K]) => setPost((p) => ({ ...p, [key]: value }));

  // Auto-generate the slug from the title until the owner edits the slug by hand.
  useEffect(() => {
    if (!slugTouched) setPost((p) => ({ ...p, slug: slugify(p.title) }));
  }, [post.title, slugTouched]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (leaving.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const words = useMemo(() => post.body.trim().split(/\s+/).filter(Boolean).length, [post.body]);
  const minutes = Math.max(1, Math.ceil(words / 200));

  const problems = useMemo(() => {
    const list: string[] = [];
    if (!post.title.trim()) list.push("Title is required.");
    if (!post.slug.trim()) list.push("Slug is required.");
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) list.push("Slug may only contain lowercase letters, numbers and single hyphens.");
    if (!post.description.trim()) list.push("Description is required.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) list.push("Date must be YYYY-MM-DD.");
    if (post.tags.length === 0) list.push("Add at least one tag.");
    if (!post.body.trim()) list.push("The post body is empty.");
    return list;
  }, [post]);

  const save = useCallback(async () => {
    if (saving) return;
    if (problems.length) {
      setStatus({ kind: "error", text: problems.join("\n") });
      return;
    }
    setSaving(true);
    setStatus({
      kind: "info",
      text: storage.posts === "supabase" ? "Saving to Supabase…" : storage.mode === "github" ? "Committing to GitHub…" : "Saving…",
    });
    const input: SavePostInput = { ...post, originalSlug };
    const result = await savePostAction(input);
    setSaving(false);
    if (!result.ok) {
      setStatus({ kind: "error", text: result.error });
      return;
    }
    savedJson.current = JSON.stringify(post);
    if (isNew) {
      // The /admin/posts/new route stays valid, so a client-side navigation is safe.
      router.replace(`/admin/posts/${result.slug}?saved=1`);
      return;
    }
    if (result.slug !== originalSlug) {
      // The old URL no longer exists. A full navigation avoids racing the router
      // against the save's own refresh of the (now missing) old page.
      leaving.current = true;
      window.location.replace(`/admin/posts/${result.slug}?saved=1`);
      return;
    }
    setStatus({ kind: "success", text: result.message });
  }, [isNew, originalSlug, post, problems, router, saving, storage.mode, storage.posts]);

  // Ctrl/Cmd + S saves
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  const remove = async () => {
    if (!originalSlug) return;
    setDeleting(true);
    const result = await deletePostAction(originalSlug);
    setDeleting(false);
    if (!result.ok) {
      setStatus({ kind: "error", text: result.error });
      setConfirmDelete(false);
      return;
    }
    savedJson.current = JSON.stringify(post);
    leaving.current = true;
    window.location.assign("/admin?deleted=1");
  };

  /* ---------- Markdown toolbar ---------- */

  const applyFormat = (action: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const selected = value.slice(start, end);
    let replacement = selected;
    let cursorOffset = 0;

    const wrap = (left: string, right = left, placeholder = "text") => {
      const inner = selected || placeholder;
      replacement = `${left}${inner}${right}`;
      cursorOffset = selected ? replacement.length : left.length + inner.length;
    };
    const linePrefix = (prefix: string) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const block = value.slice(lineStart, end);
      const lines = block.split("\n").map((l) => (l.startsWith(prefix) ? l.slice(prefix.length) : `${prefix}${l}`));
      const next = `${value.slice(0, lineStart)}${lines.join("\n")}${value.slice(end)}`;
      update("body", next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(lineStart, lineStart + lines.join("\n").length);
      });
      return true;
    };

    switch (action) {
      case "bold":
        wrap("**");
        break;
      case "italic":
        wrap("_");
        break;
      case "code":
        if (selected.includes("\n")) wrap("```\n", "\n```", "code");
        else wrap("`", "`", "code");
        break;
      case "codeblock":
        wrap("```python\n", "\n```", "# code here");
        break;
      case "h2":
        if (linePrefix("## ")) return;
        break;
      case "h3":
        if (linePrefix("### ")) return;
        break;
      case "ul":
        if (linePrefix("- ")) return;
        break;
      case "ol":
        if (linePrefix("1. ")) return;
        break;
      case "quote":
        if (linePrefix("> ")) return;
        break;
      case "link":
        replacement = `[${selected || "link text"}](https://)`;
        cursorOffset = replacement.length - 1;
        break;
      case "image":
        replacement = `![${selected || "alt text"}](/blog/image.png)`;
        cursorOffset = replacement.length;
        break;
      case "table":
        replacement = `| Column | Column |\n|---|---|\n| Cell | Cell |\n| Cell | Cell |`;
        cursorOffset = replacement.length;
        break;
      default:
        return;
    }

    const next = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
    update("body", next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + cursorOffset;
      el.setSelectionRange(pos, pos);
    });
  };

  const insertAtCursor = (text: string) => {
    const el = textareaRef.current;
    if (!el) {
      update("body", `${post.body}\n${text}\n`);
      return;
    }
    const { selectionStart: start, selectionEnd: end, value } = el;
    const next = `${value.slice(0, start)}${text}${value.slice(end)}`;
    update("body", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  };

  const upload = async (file: File, target: "cover" | "body") => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("prefix", post.slug || "post");
    const result = await uploadImageAction(fd);
    setUploading(false);
    if (!result.ok) {
      setStatus({ kind: "error", text: result.error });
      return;
    }
    if (target === "cover") update("cover", result.url);
    else insertAtCursor(`\n![${file.name.replace(/\.[a-z0-9]+$/i, "")}](${result.url})\n`);
    setStatus({ kind: "success", text: result.message });
  };

  const toolbar: { action: string; label: string; icon: React.ReactNode }[] = [
    { action: "bold", label: "Bold (Ctrl+B)", icon: <Bold size={16} /> },
    { action: "italic", label: "Italic (Ctrl+I)", icon: <Italic size={16} /> },
    { action: "h2", label: "Heading 2", icon: <Heading2 size={16} /> },
    { action: "h3", label: "Heading 3", icon: <Heading3 size={16} /> },
    { action: "ul", label: "Bullet list", icon: <List size={16} /> },
    { action: "ol", label: "Numbered list", icon: <ListOrdered size={16} /> },
    { action: "quote", label: "Quote", icon: <Quote size={16} /> },
    { action: "code", label: "Inline code", icon: <Code size={16} /> },
    { action: "codeblock", label: "Code block", icon: <span className="font-mono text-[12px] font-bold">{"{ }"}</span> },
    { action: "link", label: "Link", icon: <LinkIcon size={16} /> },
    { action: "table", label: "Table", icon: <Table size={16} /> },
  ];

  const showWrite = view !== "preview";
  const showPreview = view !== "write";

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-text">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <h1 className="mt-1 truncate text-xl font-bold tracking-tight md:text-2xl">{isNew ? "New post" : "Edit post"}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Editor view" className="hidden overflow-hidden rounded-lg border border-border md:flex">
            {(["write", "split", "preview"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "px-3 py-2 text-[13px] font-medium capitalize transition-colors",
                  view === v ? "bg-accent-soft text-accent-ink" : "text-muted hover:text-text",
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setView(view === "preview" ? "write" : "preview")}
            className="btn-secondary !min-h-10 text-[13px] md:hidden"
          >
            {view === "preview" ? <PenLine size={15} /> : <Eye size={15} />} {view === "preview" ? "Write" : "Preview"}
          </button>
          <button type="button" onClick={() => void save()} disabled={saving || !storage.postsWritable} className="btn-primary !min-h-10" aria-busy={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {post.draft ? "Save draft" : "Save & publish"}
          </button>
        </div>
      </div>

      {!storage.postsWritable && (
        <Notice variant="warning" className="mt-4">
          <strong>Read-only mode.</strong> {storage.reason}
        </Notice>
      )}
      {status && (
        <Notice variant={status.kind} className="mt-4">
          {status.text}
        </Notice>
      )}
      {dirty && !status && (
        <p className="mt-4 text-[13px] text-muted">Unsaved changes · press Ctrl+S to save.</p>
      )}

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Editor pane */}
        <div className="min-w-0">
          <div className={cn("grid gap-4", view === "split" && "xl:grid-cols-2")}>
            {showWrite && (
              <div className="card overflow-hidden">
                <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5" role="toolbar" aria-label="Formatting">
                  {toolbar.map((item) => (
                    <button
                      key={item.action}
                      type="button"
                      title={item.label}
                      aria-label={item.label}
                      onClick={() => applyFormat(item.action)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-accent-soft hover:text-text"
                    >
                      {item.icon}
                    </button>
                  ))}
                  <button
                    type="button"
                    title="Insert image"
                    aria-label="Insert image"
                    disabled={uploading || !storage.postsWritable}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-accent-soft hover:text-text disabled:opacity-40"
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                  </button>
                  <span className="ml-auto px-2 font-mono text-[12px] text-muted">
                    {words} words · {minutes} min read
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={post.body}
                  onChange={(e) => update("body", e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
                      e.preventDefault();
                      applyFormat("bold");
                    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
                      e.preventDefault();
                      applyFormat("italic");
                    } else if (e.key === "Tab") {
                      e.preventDefault();
                      insertAtCursor("  ");
                    }
                  }}
                  spellCheck
                  aria-label="Post body (Markdown)"
                  placeholder="Write in Markdown…"
                  className="block min-h-[60vh] w-full resize-y bg-transparent p-4 font-mono text-[14px] leading-relaxed outline-none placeholder:text-muted/60"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload(f, "body");
                    e.target.value = "";
                  }}
                />
              </div>
            )}
            {showPreview && (
              <div className="card min-h-[60vh] overflow-auto p-6 md:p-8">
                <p className="font-mono text-[12px] uppercase tracking-wide text-muted">Preview</p>
                <h2 className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight md:text-[34px]">{post.title || "Untitled post"}</h2>
                <p className="mt-3 font-mono text-[13px] text-muted">
                  {formatDisplayDate(post.date)} · {minutes} min read
                </p>
                {post.tags.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span key={t} className="chip">
                        #{t}
                      </span>
                    ))}
                  </p>
                )}
                {post.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover} alt="" className="mt-6 aspect-video w-full rounded-xl border border-border object-cover" />
                )}
                <div className="mt-6">
                  <MarkdownPreview markdown={post.body} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata sidebar */}
        <aside className="space-y-5">
          <div className="card space-y-4 p-5">
            <div>
              <label htmlFor="title" className="label">
                Title
              </label>
              <input id="title" className="input" value={post.title} onChange={(e) => update("title", e.target.value)} placeholder="5 Negative Tests Every API Needs" />
            </div>
            <div>
              <label htmlFor="slug" className="label">
                URL slug
              </label>
              <div className="flex items-center">
                <span className="rounded-l-lg border border-r-0 border-border bg-card px-2.5 py-2 font-mono text-[13px] text-muted">/blog/</span>
                <input
                  id="slug"
                  className="input !rounded-l-none font-mono text-[14px]"
                  value={post.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update("slug", e.target.value.toLowerCase());
                  }}
                  placeholder="my-post"
                />
              </div>
              {!isNew && post.slug !== originalSlug && (
                <p className="mt-1 text-[12px] text-amber-500">Changing the slug changes the URL; old links will stop working.</p>
              )}
            </div>
            <div>
              <label htmlFor="description" className="label">
                Description <span className="font-normal">({post.description.length}/160)</span>
              </label>
              <textarea
                id="description"
                rows={3}
                className="input resize-y"
                value={post.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="One sentence shown on cards and in Google results."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="date" className="label">
                  Date
                </label>
                <input id="date" type="date" className="input font-mono text-[14px]" value={post.date} onChange={(e) => update("date", e.target.value)} />
              </div>
              <div>
                <span className="label">Status</span>
                <div role="group" aria-label="Status" className="flex overflow-hidden rounded-lg border border-border">
                  <button
                    type="button"
                    aria-pressed={post.draft}
                    onClick={() => update("draft", true)}
                    className={cn("flex-1 py-2 text-[13px] font-medium", post.draft ? "bg-amber-500/15 text-amber-500" : "text-muted hover:text-text")}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    aria-pressed={!post.draft}
                    onClick={() => update("draft", false)}
                    className={cn("flex-1 py-2 text-[13px] font-medium", !post.draft ? "bg-accent-soft text-accent-ink" : "text-muted hover:text-text")}
                  >
                    Published
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="tags" className="label">
                Tags
              </label>
              <TagInput
                id="tags"
                value={post.tags}
                onChange={(tags) => update("tags", tags)}
                normalize={(t) => slugify(t)}
                placeholder="api-testing, pytest…"
              />
            </div>
            <div>
              <label htmlFor="cover" className="label">
                Cover image <span className="font-normal">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="cover"
                  className="input font-mono text-[13px]"
                  value={post.cover}
                  onChange={(e) => update("cover", e.target.value)}
                  placeholder="/blog/my-cover.png"
                />
                <label className={cn("btn-secondary !min-h-[42px] shrink-0 cursor-pointer px-3", (uploading || !storage.postsWritable) && "pointer-events-none opacity-50")}>
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span className="sr-only">Upload cover image</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void upload(f, "cover");
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              {post.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover} alt="" className="mt-3 aspect-video w-full rounded-lg border border-border object-cover" />
              )}
            </div>
          </div>

          <div className="card p-5 text-[13px] leading-relaxed text-muted">
            <p className="font-semibold text-text">Writing tips</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Lead with the problem and the number that changed.</li>
              <li>
                Use <span className="font-mono">##</span> headings; they become the table of contents.
              </li>
              <li>
                Fence code with a language, e.g. <span className="font-mono">```python</span>, for highlighting.
              </li>
              <li>Never include employer code, internal service names or data.</li>
            </ul>
          </div>

          {!isNew && (
            <div className="rounded-xl border border-red-500/30 p-5">
              <p className="text-[13px] font-semibold text-red-500">Danger zone</p>
              {confirmDelete ? (
                <div className="mt-3 space-y-2">
                  <p className="text-[13px] text-muted">Delete “{initial.title}” permanently?</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => void remove()} disabled={deleting} className="btn-danger !min-h-9 text-[13px]">
                      {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Yes, delete
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="btn-ghost !min-h-9 text-[13px]">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={!storage.postsWritable}
                  className="btn-danger mt-3 !min-h-9 text-[13px]"
                >
                  <Trash2 size={14} /> Delete post
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
