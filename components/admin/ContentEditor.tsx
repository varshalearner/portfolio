"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Braces, Loader2, RotateCcw, Save } from "lucide-react";
import { saveContentAction } from "@/lib/admin/actions";
import { contentSections, validateContent } from "@/lib/admin/contentSchema";
import type { StorageInfo } from "@/lib/admin/storage";
import { SchemaField } from "@/components/admin/SchemaForm";
import { Notice } from "@/components/admin/Notice";
import { cn } from "@/lib/utils";

type Status = { kind: "success" | "error" | "info"; text: string } | null;

export function ContentEditor({ initial, storage }: { initial: Record<string, unknown>; storage: StorageInfo }) {
  const router = useRouter();
  const [content, setContent] = useState<Record<string, unknown>>(initial);
  const [section, setSection] = useState(contentSections[0].key);
  const [status, setStatus] = useState<Status>(null);
  const [saving, setSaving] = useState(false);
  const [rawMode, setRawMode] = useState(false);
  const [rawText, setRawText] = useState("");
  const savedJson = useRef(JSON.stringify(initial));

  const dirty = JSON.stringify(content) !== savedJson.current;
  const changedSections = useMemo(() => {
    const saved = JSON.parse(savedJson.current) as Record<string, unknown>;
    return new Set(contentSections.filter((s) => JSON.stringify(saved[s.key]) !== JSON.stringify(content[s.key])).map((s) => s.key));
  }, [content]);

  const problems = useMemo(() => validateContent(content), [content]);
  const active = contentSections.find((s) => s.key === section) ?? contentSections[0];

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const save = useCallback(async () => {
    if (saving) return;
    if (problems.length) {
      setStatus({ kind: "error", text: `Please fix these fields:\n• ${problems.join("\n• ")}` });
      return;
    }
    setSaving(true);
    setStatus({ kind: "info", text: storage.mode === "github" ? "Committing to GitHub…" : "Saving…" });
    const result = await saveContentAction(JSON.stringify(content));
    setSaving(false);
    if (!result.ok) {
      setStatus({ kind: "error", text: result.error });
      return;
    }
    savedJson.current = JSON.stringify(content);
    setStatus({ kind: "success", text: result.message });
    router.refresh();
  }, [content, problems, router, saving, storage.mode]);

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

  const reset = () => {
    setContent(JSON.parse(savedJson.current) as Record<string, unknown>);
    setStatus(null);
  };

  const openRaw = () => {
    setRawText(JSON.stringify(content, null, 2));
    setRawMode(true);
  };

  const applyRaw = () => {
    try {
      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      const errs = validateContent(parsed);
      if (errs.length) {
        setStatus({ kind: "error", text: `JSON is valid but some fields are wrong:\n• ${errs.join("\n• ")}` });
        return;
      }
      setContent(parsed);
      setRawMode(false);
      setStatus({ kind: "info", text: "JSON applied. Press Save to publish it." });
    } catch (err) {
      setStatus({ kind: "error", text: `Invalid JSON: ${err instanceof Error ? err.message : String(err)}` });
    }
  };

  return (
    <div className="mt-6">
      {!storage.writable && (
        <Notice variant="warning" className="mb-4">
          <strong>Read-only mode.</strong> {storage.reason}
        </Notice>
      )}
      {status && (
        <Notice variant={status.kind} className="mb-4">
          {status.text}
        </Notice>
      )}

      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Content sections" className="md:sticky md:top-8 md:self-start">
          <ul className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
            {contentSections.map((s) => {
              const current = s.key === section && !rawMode;
              return (
                <li key={s.key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSection(s.key);
                      setRawMode(false);
                    }}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[14px] font-medium transition-colors",
                      current ? "bg-accent-soft text-accent-ink" : "text-muted hover:bg-card hover:text-text",
                    )}
                  >
                    {s.label}
                    {changedSections.has(s.key) && <span className="h-2 w-2 rounded-full bg-amber-500" aria-label="Unsaved changes" />}
                  </button>
                </li>
              );
            })}
            <li className="shrink-0 md:mt-2 md:border-t md:border-border md:pt-2">
              <button
                type="button"
                onClick={openRaw}
                aria-current={rawMode ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] font-medium transition-colors",
                  rawMode ? "bg-accent-soft text-accent-ink" : "text-muted hover:bg-card hover:text-text",
                )}
              >
                <Braces size={15} /> Raw JSON
              </button>
            </li>
          </ul>
        </nav>

        <div className="min-w-0">
          {rawMode ? (
            <div className="card p-5">
              <h2 className="text-lg font-semibold">Raw JSON</h2>
              <p className="mt-1 text-[13px] text-muted">
                The full <span className="font-mono">data/content.json</span>. Edit carefully, then apply.
              </p>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                spellCheck={false}
                aria-label="Raw content JSON"
                className="input mt-4 min-h-[60vh] resize-y font-mono text-[13px] leading-relaxed"
              />
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={applyRaw} className="btn-secondary !min-h-10 text-[14px]">
                  Apply JSON
                </button>
                <button type="button" onClick={() => setRawMode(false)} className="btn-ghost !min-h-10 text-[14px]">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-5 md:p-6">
              <h2 className="text-lg font-semibold">{active.label}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{active.description}</p>
              <div className="mt-6">
                <SchemaField
                  schema={active.schema}
                  value={content[active.key]}
                  path={active.key}
                  depth={0}
                  onChange={(next) => setContent((c) => ({ ...c, [active.key]: next }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 z-30 mt-6 -mx-4 border-t border-border bg-bg/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-muted">
            {dirty ? (
              <>
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                Unsaved changes in {changedSections.size} {changedSections.size === 1 ? "section" : "sections"} · Ctrl+S to save
              </>
            ) : (
              "All changes saved"
            )}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={reset} disabled={!dirty || saving} className="btn-ghost !min-h-10 text-[14px] disabled:opacity-40">
              <RotateCcw size={15} /> Discard
            </button>
            <button type="button" onClick={() => void save()} disabled={!dirty || saving || !storage.writable} className="btn-primary !min-h-10 disabled:opacity-50" aria-busy={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
