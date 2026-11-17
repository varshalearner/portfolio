import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { adminEnabled, isAuthenticated } from "@/lib/admin/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  if (isAuthenticated()) redirect("/admin");
  const enabled = adminEnabled();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-text">
          <ArrowLeft size={15} /> Back to site
        </Link>
        <div className="card p-7">
          <div className="flex items-center gap-3">
            <LogoMark size="xl" />
            <div>
              <h1 className="text-[18px] font-bold leading-tight">Admin panel</h1>
              <p className="text-[13px] text-muted">Posts and site content</p>
            </div>
          </div>

          {enabled ? (
            <LoginForm />
          ) : (
            <div className="mt-6 space-y-3 text-[14px] leading-relaxed text-muted">
              <p className="font-medium text-text">The admin panel is not set up yet.</p>
              <p>
                Add an <code className="rounded bg-accent-soft px-1 font-mono text-accent-ink">ADMIN_PASSWORD</code>{" "}
                environment variable and restart the server. Locally, copy <code className="font-mono">.env.example</code> to{" "}
                <code className="font-mono">.env.local</code>. On Vercel, add it under Settings → Environment Variables.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
