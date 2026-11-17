import { Fragment, type ReactNode } from "react";

/**
 * Matches the numbers recruiters skim for: "5h → 3h", "~3,000 tests", "~12 minutes",
 * "6 Spot Awards", "4 releases". Digits glued to letters (k6, mTLS) are skipped.
 */
const METRIC_RE =
  /(\d+h\s?→\s?\d+h|(?<![\w.])~?\d[\d,]*(?:\.\d+)?(?:-(?:hour|minute|day|test)s?\b|\s?(?:%|×|hours?\b|minutes?\b|min\b|seconds?\b|sec\b|tests?\b|microservices\b|releases?\b|hotfixes\b|Spot Awards\b|people\b|services\b))?)/g;

/** Wraps metrics in <strong> so they stand out inside muted body text. */
export function highlightMetrics(text: string): ReactNode {
  const parts = text.split(METRIC_RE);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-text">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
