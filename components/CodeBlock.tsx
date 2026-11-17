"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type PreProps = React.ComponentPropsWithoutRef<"pre"> & { "data-language"?: string };

/** Code block with a language label and a copy button. Wraps the <pre> rehype-pretty-code emits. */
export function CodeBlock({ children, ...props }: PreProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const language = props["data-language"];

  const copy = async () => {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (insecure context); fail quietly.
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-4 py-1.5 font-mono text-[12px] text-muted">
        <span className="uppercase tracking-wide">{language && language !== "text" ? language : "code"}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code to clipboard"}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-accent-soft hover:text-text"
        >
          {copied ? <Check size={14} className="text-accent-ink" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre ref={ref} {...props}>
        {children}
      </pre>
    </>
  );
}
