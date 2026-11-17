import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/utils";

type HeadingProps = React.ComponentPropsWithoutRef<"h2">;

function AnchorHeading({ as: Tag, id, children, className, ...props }: HeadingProps & { as: "h2" | "h3" | "h4" }) {
  return (
    <Tag id={id} className={cn("group relative", className)} {...props}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 !border-0 font-normal text-muted/50 no-underline opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        >
          #
        </a>
      )}
    </Tag>
  );
}

function MdxLink({ href = "", children, ...props }: React.ComponentPropsWithoutRef<"a">) {
  const isExternal = /^https?:\/\//.test(href) || href.startsWith("mailto:");
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

type CalloutType = "note" | "tip" | "warning";

/** Usage in MDX: <Callout type="tip" title="Optional title">Body text</Callout> */
export function Callout({ type = "note", title, children }: { type?: CalloutType; title?: string; children: React.ReactNode }) {
  const styles: Record<CalloutType, { icon: React.ReactNode; border: string; label: string }> = {
    note: { icon: <Info size={18} />, border: "border-sky-500/40", label: "Note" },
    tip: { icon: <Lightbulb size={18} />, border: "border-accent/50", label: "Tip" },
    warning: { icon: <AlertTriangle size={18} />, border: "border-amber-500/50", label: "Warning" },
  };
  const s = styles[type] ?? styles.note;
  return (
    <aside className={cn("not-prose my-6 rounded-xl border-l-4 border bg-card px-5 py-4 text-[15px] leading-relaxed", s.border)}>
      <p className="mb-1 flex items-center gap-2 font-semibold">
        {s.icon} {title ?? s.label}
      </p>
      <div className="text-text/90 [&_code]:rounded [&_code]:bg-accent-soft [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em]">
        {children}
      </div>
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => <AnchorHeading as="h2" {...props} />,
  h3: (props) => <AnchorHeading as="h3" {...props} />,
  h4: (props) => <AnchorHeading as="h4" {...props} />,
  a: MdxLink,
  pre: (props) => <CodeBlock {...props} />,
  table: (props) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  img: (props) => <img loading="lazy" decoding="async" {...props} alt={props.alt ?? ""} />,
  Callout,
};
