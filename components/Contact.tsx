import { Download, Mail } from "lucide-react";
import { contact, site } from "@/data/content";
import { FadeUp } from "@/components/FadeUp";
import { CopyEmail } from "@/components/CopyEmail";
import { GitHubIcon, LinkedInIcon } from "@/components/Icons";

export function Contact({ resumeAvailable }: { resumeAvailable: boolean }) {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative py-20 md:py-28">
      <div className="container-site">
        <FadeUp className="beam-border shadow-[0_0_120px_-40px_rgb(var(--accent)/0.55)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-bg px-6 py-16 text-center sm:px-10 md:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_65%_75%_at_50%_100%,#000_20%,transparent_100%)]" />
              <div className="absolute bottom-[-14rem] left-1/2 h-[26rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.4),rgb(var(--accent-3)/0.15)_55%,transparent)]" />
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-2)/0.18),transparent)]" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <span className="eyebrow">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-accent-2" />
                Get in touch
              </span>
              <h2
                id="contact-heading"
                className="mt-6 pb-1 text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-6xl md:text-7xl"
              >
                <span className="text-gradient-muted">{contact.heading}</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted md:text-lg">{contact.line}</p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={`mailto:${site.email}`} className="btn-primary h-12 px-7 text-[15px]">
                  <Mail size={18} aria-hidden="true" /> Email me
                </a>
                <CopyEmail email={site.email} />
              </div>

              <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[15px] font-medium">
                <li>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-text"
                  >
                    <LinkedInIcon size={17} /> LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={site.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-text"
                  >
                    <GitHubIcon size={17} /> GitHub
                  </a>
                </li>
                {resumeAvailable && (
                  <li>
                    <a href={site.resume} download className="inline-flex items-center gap-2 text-muted transition-colors hover:text-text">
                      <Download size={17} aria-hidden="true" /> Resume
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
