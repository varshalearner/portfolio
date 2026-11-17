import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { site } from "@/data/content";

export const runtime = "edge";

/**
 * Per-post Open Graph image: /api/og?title=...&date=...&tags=a,b
 * Used by blog post metadata so every post gets a card with its title.
 */
export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = (searchParams.get("title") ?? "Blog").slice(0, 120);
  const date = (searchParams.get("date") ?? "").slice(0, 24);
  const tags = (searchParams.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);

  const fontSize = title.length > 70 ? 52 : title.length > 45 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #040616 0%, #0C0F26 55%, #1E1B4B 100%)",
          color: "#EDF0FC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, color: "#A5B4FC", fontFamily: "monospace" }}>
            $ cat blog/{date || "post"}.md
          </div>
          <div style={{ fontSize, fontWeight: 800, marginTop: 20, lineHeight: 1.15, letterSpacing: -1.5 }}>{title}</div>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    fontSize: 22,
                    fontFamily: "monospace",
                    color: "#C7D2FE",
                    background: "rgba(129,140,248,0.16)",
                    borderRadius: 8,
                    padding: "6px 14px",
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 12,
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 60%, #22D3EE 120%)",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: 26,
              }}
            >
              VS
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{`${site.name} · SDET`}</div>
              <div style={{ fontSize: 22, color: "#949BBE" }}>{date}</div>
            </div>
          </div>
          <div style={{ fontSize: 24, color: "#949BBE", fontFamily: "monospace" }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
