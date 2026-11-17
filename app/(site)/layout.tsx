import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Backdrop } from "@/components/ui/Backdrop";
import { hasResume } from "@/lib/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const resumeAvailable = hasResume();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-white dark:focus:text-[#040616]"
      >
        Skip to content
      </a>
      <Backdrop />
      <Navbar resumeAvailable={resumeAvailable} />
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <Footer />
    </>
  );
}
