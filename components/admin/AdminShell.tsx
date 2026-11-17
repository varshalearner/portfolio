"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, Menu, PenLine, Settings, X } from "lucide-react";
import type { StorageInfo } from "@/lib/admin/storage";
import { logoutAction } from "@/lib/admin/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/Logo";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts/new", label: "New post", icon: PenLine, exact: true },
  { href: "/admin/content", label: "Site content", icon: Settings, exact: false },
];

export function AdminShell({ storage, children }: { storage: StorageInfo; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
              active ? "bg-accent-soft text-accent-ink" : "text-muted hover:bg-card hover:text-text",
            )}
          >
            <Icon size={17} /> {label}
          </Link>
        );
      })}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] font-medium text-muted hover:bg-card hover:text-text"
      >
        <ExternalLink size={17} /> View site
      </a>
    </nav>
  );

  const fileTarget =
    storage.mode === "github" ? (
      <>
        GitHub · <span className="font-mono text-accent-ink">{storage.repo}</span>
      </>
    ) : storage.writable ? (
      "Local files (dev)"
    ) : (
      <span className="text-amber-500">Read-only · not configured</span>
    );

  const storageBadge = (
    <div className="space-y-2 rounded-lg border border-border bg-card px-3 py-2.5 text-[12px] leading-relaxed">
      <div>
        <p className="font-mono uppercase tracking-wide text-muted">Posts saved to</p>
        <p className="mt-0.5 font-medium">
          {storage.posts === "supabase" ? <span className="text-success">Supabase</span> : fileTarget}
        </p>
      </div>
      <div>
        <p className="font-mono uppercase tracking-wide text-muted">Site content saved to</p>
        <p className="mt-0.5 font-medium">{fileTarget}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border p-4 md:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-1">
          <LogoMark size="md" />
          <span className="text-[15px] font-bold">Admin</span>
        </Link>
        {nav}
        <div className="mt-auto space-y-3 pt-6">
          {storageBadge}
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <form action={logoutAction}>
              <button type="submit" className="btn-ghost !min-h-10 text-[14px]">
                <LogOut size={16} /> Log out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur md:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark size="sm" />
            <span className="text-[15px] font-bold">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="admin-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>
        <div id="admin-mobile-nav" hidden={!open} className="border-b border-border bg-bg p-4 md:hidden">
          {nav}
          <div className="mt-4 space-y-3">
            {storageBadge}
            <form action={logoutAction}>
              <button type="submit" className="btn-ghost !min-h-10 text-[14px]">
                <LogOut size={16} /> Log out
              </button>
            </form>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
