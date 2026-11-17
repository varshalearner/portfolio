"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { emptyValue, type FieldSchema } from "@/lib/admin/contentSchema";
import { TagInput } from "@/components/admin/TagInput";
import { cn } from "@/lib/utils";

interface FieldProps {
  schema: FieldSchema;
  value: unknown;
  onChange: (next: unknown) => void;
  path: string;
  depth?: number;
}

function Help({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-[12px] leading-relaxed text-muted">{text}</p>;
}

/** Recursive, schema-driven form field. */
export function SchemaField({ schema, value, onChange, path, depth = 0 }: FieldProps) {
  const id = `f-${path.replace(/[^a-zA-Z0-9]+/g, "-")}`;

  switch (schema.kind) {
    case "string":
      return (
        <div>
          <label htmlFor={id} className="label">
            {schema.label}
          </label>
          <input
            id={id}
            className={cn("input", schema.mono && "font-mono text-[14px]")}
            value={typeof value === "string" ? value : ""}
            placeholder={schema.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          <Help text={schema.help} />
        </div>
      );

    case "text":
      return (
        <div>
          <label htmlFor={id} className="label">
            {schema.label}
          </label>
          <textarea
            id={id}
            rows={schema.rows ?? 3}
            className="input resize-y leading-relaxed"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <Help text={schema.help} />
        </div>
      );

    case "boolean": {
      const on = value === true;
      return (
        <div>
          <span className="label">{schema.label}</span>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            id={id}
            onClick={() => onChange(!on)}
            className={cn(
              "inline-flex min-h-[42px] items-center gap-3 rounded-lg border px-3 text-[14px] font-medium transition-colors",
              on ? "border-accent/50 bg-accent-soft text-accent-ink" : "border-border text-muted",
            )}
          >
            <span className={cn("relative inline-block h-5 w-9 rounded-full transition-colors", on ? "bg-accent" : "bg-border")}>
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  on ? "translate-x-[18px]" : "translate-x-0.5",
                )}
              />
            </span>
            {on ? "On" : "Off"}
          </button>
          <Help text={schema.help} />
        </div>
      );
    }

    case "select":
      return (
        <div>
          <label htmlFor={id} className="label">
            {schema.label}
          </label>
          <select id={id} className="input" value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)}>
            {schema.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <Help text={schema.help} />
        </div>
      );

    case "stringList":
      return (
        <div>
          <label htmlFor={id} className="label">
            {schema.label}
          </label>
          <TagInput id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} mono={false} placeholder="Type and press Enter" />
          <Help text={schema.help} />
        </div>
      );

    case "object": {
      const obj = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;
      const fields = Object.entries(schema.fields).map(([key, field]) => (
        <SchemaField
          key={key}
          schema={field}
          value={obj[key]}
          path={`${path}.${key}`}
          depth={depth + 1}
          onChange={(next) => onChange({ ...obj, [key]: next })}
        />
      ));
      if (depth === 0) return <div className="grid gap-5">{fields}</div>;
      return (
        <fieldset className="rounded-xl border border-border p-4">
          <legend className="px-1.5 text-[13px] font-semibold">{schema.label}</legend>
          <div className="grid gap-4">{fields}</div>
          <Help text={schema.help} />
        </fieldset>
      );
    }

    case "list": {
      const items = Array.isArray(value) ? (value as unknown[]) : [];
      const setItems = (next: unknown[]) => onChange(next);
      const move = (from: number, to: number) => {
        if (to < 0 || to >= items.length) return;
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        setItems(next);
      };
      const isScalar = schema.item.kind === "string" || schema.item.kind === "text";

      return (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-semibold">
              {schema.label} <span className="font-normal text-muted">({items.length})</span>
            </span>
          </div>
          <Help text={schema.help} />
          <ol className={cn("mt-2 grid gap-3", isScalar && "gap-2")}>
            {items.map((item, i) => {
              const title =
                schema.itemTitle && typeof item === "object" && item !== null
                  ? String((item as Record<string, unknown>)[schema.itemTitle] ?? "")
                  : "";
              const controls = (
                <div className="flex shrink-0 items-center gap-0.5">
                  <IconButton label="Move up" onClick={() => move(i, i - 1)} disabled={i === 0}>
                    <ChevronUp size={15} />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => move(i, i + 1)} disabled={i === items.length - 1}>
                    <ChevronDown size={15} />
                  </IconButton>
                  <IconButton label="Remove" danger onClick={() => setItems(items.filter((_, j) => j !== i))}>
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              );

              if (isScalar) {
                return (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2.5 w-5 shrink-0 text-right font-mono text-[12px] text-muted">{i + 1}.</span>
                    <div className="min-w-0 flex-1">
                      {schema.item.kind === "text" ? (
                        <textarea
                          rows={schema.item.rows ?? 2}
                          aria-label={`${schema.label} ${i + 1}`}
                          className="input resize-y leading-relaxed"
                          value={typeof item === "string" ? item : ""}
                          onChange={(e) => setItems(items.map((it, j) => (j === i ? e.target.value : it)))}
                        />
                      ) : (
                        <input
                          aria-label={`${schema.label} ${i + 1}`}
                          className="input"
                          value={typeof item === "string" ? item : ""}
                          onChange={(e) => setItems(items.map((it, j) => (j === i ? e.target.value : it)))}
                        />
                      )}
                    </div>
                    {controls}
                  </li>
                );
              }

              return (
                <li key={i} className="rounded-xl border border-border bg-card/60">
                  <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
                    <span className="truncate text-[13px] font-semibold">
                      <span className="mr-2 font-mono text-muted">#{i + 1}</span>
                      {title || `${schema.item.kind === "object" ? schema.item.label : "Item"} ${i + 1}`}
                    </span>
                    {controls}
                  </div>
                  <div className="p-4">
                    <SchemaField
                      schema={schema.item}
                      value={item}
                      path={`${path}[${i}]`}
                      depth={0}
                      onChange={(next) => setItems(items.map((it, j) => (j === i ? next : it)))}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
          <button
            type="button"
            onClick={() => setItems([...items, emptyValue(schema.item)])}
            className="btn-secondary mt-3 !min-h-9 text-[13px]"
          >
            <Plus size={15} /> {schema.addLabel ?? "Add item"}
          </button>
        </div>
      );
    }
  }
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors disabled:opacity-30",
        danger ? "hover:bg-red-500/10 hover:text-red-500" : "hover:bg-accent-soft hover:text-text",
      )}
    >
      {children}
    </button>
  );
}
