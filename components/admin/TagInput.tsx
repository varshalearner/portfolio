"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  id?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** Transform each new entry, e.g. lowercase-kebab for blog tags. */
  normalize?: (raw: string) => string;
  mono?: boolean;
}

export function TagInput({ id, value, onChange, placeholder = "Type and press Enter", normalize, mono = true }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const parts = raw
      .split(",")
      .map((p) => (normalize ? normalize(p.trim()) : p.trim()))
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    for (const p of parts) if (!next.includes(p)) next.push(p);
    onChange(next);
    setDraft("");
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="input flex min-h-[42px] flex-wrap items-center gap-1.5 py-1.5">
      {value.map((item, i) => (
        <span key={`${item}-${i}`} className={`chip gap-1 pr-1 ${mono ? "" : "font-sans"}`}>
          {item}
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label={`Remove ${item}`}
            className="rounded p-0.5 text-accent-ink/70 hover:bg-accent/20 hover:text-accent-ink"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => {
          const v = e.target.value;
          if (v.includes(",")) commit(v);
          else setDraft(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(draft);
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            remove(value.length - 1);
          }
        }}
        onBlur={() => commit(draft)}
        placeholder={value.length === 0 ? placeholder : ""}
        className={`min-w-[120px] flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted/60 ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}
