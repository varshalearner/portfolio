import { ImageResponse } from "next/og";
import { hero, site } from "@/data/content";

export const runtime = "edge";
export const alt = "Varsha Sharma — SDET · QA Automation Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          <div style={{ fontSize: 26, color: "#A5B4FC", letterSpacing: 1 }}>{hero.label}</div>
          <div style={{ fontSize: 84, fontWeight: 800, marginTop: 12, letterSpacing: -2 }}>{site.name}</div>
          <div style={{ fontSize: 34, color: "#949BBE", marginTop: 16, maxWidth: 980, lineHeight: 1.3 }}>
            {hero.tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#080A1C",
            border: "2px solid #2A3060",
            borderRadius: 16,
            padding: "24px 32px",
            fontSize: 28,
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", color: "#E2E8F0" }}>
            <span style={{ color: "#A5B4FC", marginRight: 12 }}>$</span>
            {hero.terminal.command.replace(/^\$\s*/, "")}
          </div>
          <div style={{ display: "flex", color: "#4ADE80", marginTop: 8 }}>✔ {hero.terminal.output}</div>
        </div>
      </div>
    ),
    size,
  );
}
