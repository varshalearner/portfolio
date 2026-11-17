import Link from "next/link";
import { ArrowUp, Mail, Rss } from "lucide-react";
import { footer, hero, nav, site } from "@/data/content";
import { Logo } from "@/components/Logo";
import { GitHubIcon, LinkedInIcon } from "@/components/Icons";
import { isUsableUrl } from "@/lib/utils";

export function Footer() {
  const sections = nav.map((label) => {
    const id = label.toLowerCase();
    return { label, href: id === "blog" ? "/blog" : `/#${id}` };
  });

  return (
    <footer className="relative mt-8 overflow-hidden border-t border-line/10">
      <div className="container-site relative pb-10 pt-14">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">{hero.tagline}</p>
            <div className="mt-6 flex gap-2">
              <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon-btn">
                <GitHubIcon size={16} />
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-btn">
                <LinkedInIcon size={15} />
              </a>
              <a href={`mailto:${site.email}`} aria-label="Email" className="icon-btn">
                <Mail size={16} />
              </a>
              <a href="/rss.xml" aria-label="RSS feed" className="icon-btn">
                <Rss size={15} />
              </a>
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted/80">Sections</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[15px]">
              {sections.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-muted transition-colors hover:text-text">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted/80">Elsewhere</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-text">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-text">
                  GitHub
                </a>
              </li>
              <li>
                <a href="/rss.xml" className="text-muted transition-colors hover:text-text">
                  RSS feed
                </a>
              </li>
              {isUsableUrl(footer.source) && (
                <li>
                  <a href={footer.source} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-text">
                    Site source
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-line/10 pt-6 text-[14px] text-muted sm:flex-row sm:items-center">
          <p>{footer.text}</p>
          <a href="#main" className="group inline-flex items-center gap-1.5 transition-colors hover:text-text">
            Back to top
            <ArrowUp size={14} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[2.5vw] select-none whitespace-nowrap bg-gradient-to-b from-line/[0.1] to-transparent bg-clip-text text-center font-display text-[12.5vw] font-extrabold leading-[0.85] tracking-[-0.05em] text-transparent"
      >
        {site.name}
      </p>
    </footer>
  );
}
