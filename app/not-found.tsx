import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Backdrop } from "@/components/ui/Backdrop";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <Backdrop />
      <div
        aria-hidden="true"
        className="grid-bg absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_20%,transparent_100%)]"
      />
      <div className="max-w-md text-center">
        <p className="font-mono text-sm text-accent-ink">$ curl -I /this-page</p>
        <h1 className="mt-4 text-8xl font-extrabold tracking-[-0.05em] md:text-9xl">
          <span className="text-gradient">404</span>
        </h1>
        <p className="mt-4 text-xl font-semibold">Page not found</p>
        <p className="mt-2 text-muted">That page doesn&apos;t exist. Even the negative tests agree.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary h-12 px-6">
            <ArrowLeft size={17} aria-hidden="true" /> Back home
          </Link>
          <Link href="/blog" className="btn-secondary h-12 px-6">
            <BookOpen size={17} aria-hidden="true" /> Read the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
