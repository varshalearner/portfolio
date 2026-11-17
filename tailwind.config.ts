import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/** Colors are RGB triplets in CSS variables so opacity modifiers (bg-accent/20) work in both themes. */
const rgb = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        bg: rgb("--bg"),
        card: rgb("--card"),
        border: rgb("--border"),
        /** Hairline color: white in dark mode, navy in light mode. Use with low alpha (border-line/10). */
        line: rgb("--line"),
        text: rgb("--text"),
        muted: rgb("--muted"),
        accent: rgb("--accent"),
        "accent-ink": rgb("--accent-ink"),
        "accent-2": rgb("--accent-2"),
        "accent-3": rgb("--accent-3"),
        success: rgb("--success"),
        "accent-soft": "var(--accent-soft)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        container: "1180px",
        post: "720px",
        list: "760px",
      },
      boxShadow: {
        card: "0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.25)",
        glow: "0 0 0 1px rgb(var(--accent) / 0.18), 0 24px 60px -24px rgb(var(--accent) / 0.45)",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.8)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(5%, 7%, 0) scale(1.12)" },
        },
        beam: {
          "0%": { opacity: "0", transform: "translate3d(-6%, -10%, 0) rotate(var(--beam-rot, -35deg)) scale(0.7)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0) rotate(var(--beam-rot, -35deg)) scale(1)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        float: "float 6s ease-in-out infinite",
        aurora: "aurora 20s ease-in-out infinite",
        beam: "beam 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
        "gradient-x": "gradient-x 8s ease-in-out infinite",
        "spin-slow": "spin 40s linear infinite",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(var(--text) / 0.88)",
            "--tw-prose-headings": "rgb(var(--text))",
            "--tw-prose-lead": "rgb(var(--muted))",
            "--tw-prose-links": "rgb(var(--accent-ink))",
            "--tw-prose-bold": "rgb(var(--text))",
            "--tw-prose-counters": "rgb(var(--muted))",
            "--tw-prose-bullets": "rgb(var(--accent) / 0.7)",
            "--tw-prose-hr": "rgb(var(--line) / 0.1)",
            "--tw-prose-quotes": "rgb(var(--text))",
            "--tw-prose-quote-borders": "rgb(var(--accent))",
            "--tw-prose-captions": "rgb(var(--muted))",
            "--tw-prose-code": "rgb(var(--text))",
            "--tw-prose-pre-code": "rgb(var(--text))",
            "--tw-prose-pre-bg": "rgb(var(--card))",
            "--tw-prose-th-borders": "rgb(var(--line) / 0.12)",
            "--tw-prose-td-borders": "rgb(var(--line) / 0.08)",
            "--tw-prose-invert-body": "rgb(var(--text) / 0.88)",
            "--tw-prose-invert-headings": "rgb(var(--text))",
            "--tw-prose-invert-lead": "rgb(var(--muted))",
            "--tw-prose-invert-links": "rgb(var(--accent-ink))",
            "--tw-prose-invert-bold": "rgb(var(--text))",
            "--tw-prose-invert-counters": "rgb(var(--muted))",
            "--tw-prose-invert-bullets": "rgb(var(--accent) / 0.7)",
            "--tw-prose-invert-hr": "rgb(var(--line) / 0.1)",
            "--tw-prose-invert-quotes": "rgb(var(--text))",
            "--tw-prose-invert-quote-borders": "rgb(var(--accent))",
            "--tw-prose-invert-captions": "rgb(var(--muted))",
            "--tw-prose-invert-code": "rgb(var(--text))",
            "--tw-prose-invert-pre-code": "rgb(var(--text))",
            "--tw-prose-invert-pre-bg": "rgb(var(--card))",
            "--tw-prose-invert-th-borders": "rgb(var(--line) / 0.12)",
            "--tw-prose-invert-td-borders": "rgb(var(--line) / 0.08)",
            maxWidth: "none",
            lineHeight: "1.75",
            a: {
              textDecoration: "none",
              fontWeight: "500",
              borderBottom: "1px solid rgb(var(--accent) / 0.4)",
              transition: "border-color 150ms",
              "&:hover": { borderBottomColor: "rgb(var(--accent))" },
            },
            "h1, h2, h3, h4": {
              fontFamily: "var(--font-display)",
              scrollMarginTop: "6.5rem",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            },
            h2: { marginTop: "2.25em", marginBottom: "0.75em" },
            h3: { marginTop: "1.75em", marginBottom: "0.5em" },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            code: {
              fontWeight: "500",
              fontSize: "0.875em",
              backgroundColor: "var(--accent-soft)",
              padding: "0.15em 0.4em",
              borderRadius: "0.35rem",
            },
            pre: {
              margin: "0",
              padding: "1rem 1.25rem",
              borderRadius: "0",
              fontSize: "0.875rem",
              lineHeight: "1.65",
              backgroundColor: "transparent",
            },
            "pre code": { backgroundColor: "transparent", padding: "0", fontSize: "inherit", fontWeight: "400" },
            table: { fontSize: "0.925em" },
            "thead th": { fontWeight: "600", color: "rgb(var(--text))" },
            img: { borderRadius: "1rem", border: "1px solid rgb(var(--line) / 0.1)" },
            blockquote: { fontStyle: "normal", color: "rgb(var(--muted))" },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
