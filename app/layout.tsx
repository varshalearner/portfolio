import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { site } from "@/data/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Varsha Sharma — SDET | API & Performance Test Automation",
    template: "%s — Varsha Sharma",
  },
  description:
    "SDET with 1.5 years at FICO. API automation, performance and resiliency testing for cloud microservices. Open to SDET roles in NCR and remote.",
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: "Varsha Sharma — SDET | API & Performance Test Automation",
    description:
      "SDET with 1.5 years at FICO. API automation, performance and resiliency testing for cloud microservices. Open to SDET roles in NCR and remote.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Varsha Sharma — SDET | API & Performance Test Automation",
    description:
      "SDET with 1.5 years at FICO. API automation, performance and resiliency testing for cloud microservices.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  alternates: {
    canonical: site.url,
    types: { "application/rss+xml": `${site.url}/rss.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#040616" },
    { media: "(prefers-color-scheme: light)", color: "#F8F9FD" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
