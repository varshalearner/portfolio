import Image from "next/image";
import { ArrowUpRight, Construction, FlaskConical } from "lucide-react";
import { projects, site } from "@/data/content";
import { Section } from "@/components/Section";
import { FadeUp } from "@/components/FadeUp";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { ProjectArt } from "@/components/ProjectArt";
import { GitHubIcon } from "@/components/Icons";
import { hasFile } from "@/lib/site";
import { isUsableUrl } from "@/lib/utils";

/** Each card's preview sits on its own brand-colored wash. */
const WASHES = [
  "radial-gradient(120% 90% at 50% 0%, rgb(var(--accent) / 0.38), transparent 62%), radial-gradient(80% 70% at 100% 100%, rgb(var(--accent-2) / 0.22), transparent 60%)",
  "radial-gradient(120% 90% at 50% 0%, rgb(var(--accent-2) / 0.32), transparent 62%), radial-gradient(80% 70% at 0% 100%, rgb(var(--accent) / 0.25), transparent 60%)",
  "radial-gradient(120% 90% at 50% 0%, rgb(var(--accent-3) / 0.34), transparent 62%), radial-gradient(80% 70% at 100% 100%, rgb(var(--accent) / 0.22), transparent 60%)",
];

export function Projects() {
  const liveQa = projects.qa.filter((p) => p.live && isUsableUrl(p.repo));
  const hasLive = liveQa.length > 0;

  return (
    <Section
      id="projects"
      eyebrow="Portfolio"
      heading={projects.heading}
      subheading={hasLive ? projects.subheading : undefined}
    >
      {hasLive ? (
        <SpotlightGroup className="grid gap-5 md:grid-cols-2">
          {liveQa.map((project, i) => (
            <FadeUp as="article" key={project.title} delay={(i % 2) * 0.08} className="card card-hover spotlight flex flex-col p-6 md:p-8">
              <span className="icon-box">
                <FlaskConical size={20} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-tight">{project.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{project.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <span className="chip">{tag}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn-secondary !min-h-10 text-[14px]">
                  <GitHubIcon size={16} /> View code <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </FadeUp>
          ))}
        </SpotlightGroup>
      ) : (
        <ComingSoon />
      )}

      <div className="mt-20">
        <FadeUp>
          <h3 className="flex items-center gap-4 font-mono text-[12.5px] font-medium uppercase tracking-[0.2em] text-muted">
            {projects.earlierHeading}
            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-line/15 to-transparent" />
          </h3>
        </FadeUp>
        <SpotlightGroup className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.earlier.map((project, i) => {
            const repo = isUsableUrl(project.repo) ? project.repo : null;
            const demo = isUsableUrl(project.demo) ? project.demo : null;
            const image = project.image && hasFile(project.image) ? project.image : null;
            return (
              <FadeUp
                as="article"
                key={project.title}
                delay={(i % 3) * 0.08}
                className="card card-hover spotlight group flex flex-col overflow-hidden"
              >
                <div
                  className="relative aspect-[16/10] overflow-hidden border-b border-line/10"
                  style={{ backgroundImage: WASHES[i % WASHES.length] }}
                >
                  <div
                    aria-hidden="true"
                    className="grid-bg absolute inset-0 [background-size:32px_32px] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]"
                  />
                  {image ? (
                    <Image
                      src={image}
                      alt={`Screenshot of ${project.title}`}
                      fill
                      sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 380px"
                      className="object-contain px-4 pt-6 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <ProjectArt title={project.title} tags={project.tags} />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h4 className="font-display text-lg font-bold tracking-tight">{project.title}</h4>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{project.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                    {project.tags.map((tag) => (
                      <li key={tag}>
                        <span className="chip-muted">{tag}</span>
                      </li>
                    ))}
                  </ul>
                  {(repo || demo) && (
                    <div className="mt-5 flex items-center gap-5 border-t border-line/10 pt-4 text-[14px] font-medium">
                      {repo && (
                        <a
                          href={repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-1.5 text-text/80 transition-colors hover:text-accent-ink"
                        >
                          <GitHubIcon size={16} /> Source code
                          <ArrowUpRight
                            size={14}
                            aria-hidden="true"
                            className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                          />
                        </a>
                      )}
                      {demo && (
                        <a
                          href={demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-1.5 text-text/80 transition-colors hover:text-accent-ink"
                        >
                          Live demo
                          <ArrowUpRight
                            size={14}
                            aria-hidden="true"
                            className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                          />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </FadeUp>
            );
          })}
        </SpotlightGroup>
      </div>
    </Section>
  );
}

function ComingSoon() {
  return (
    <FadeUp className="card relative overflow-hidden p-7 md:p-10">
      <div
        aria-hidden="true"
        className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_60%_90%_at_100%_0%,#000,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.3),transparent)]"
      />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <span className="chip">
            <Construction size={12} aria-hidden="true" /> In progress
          </span>
          <p className="mt-4 font-display text-2xl font-bold tracking-tight md:text-[1.75rem]">{projects.comingSoon}</p>
          {projects.qa.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Upcoming projects">
              {projects.qa.map((project) => (
                <li key={project.title}>
                  <span className="chip-muted">
                    <FlaskConical size={12} aria-hidden="true" /> {project.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn-secondary shrink-0 self-start md:self-center">
          <GitHubIcon size={17} /> Follow on GitHub <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </FadeUp>
  );
}
