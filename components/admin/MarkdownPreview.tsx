"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  pre: ({ children }) => <pre className="preview-pre">{children}</pre>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  img: ({ src, alt }) => <img src={src} alt={alt ?? ""} loading="lazy" />,
};

/** Client-side Markdown preview (GitHub-flavoured). Custom MDX components render on the live site only. */
export function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-lg dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
