import { Hero } from "@/components/Hero";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Impact } from "@/components/Impact";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { LatestPosts } from "@/components/LatestPosts";
import { Contact } from "@/components/Contact";
import { hasResume, hasFile } from "@/lib/site";
import { about, site } from "@/data/content";

export default function HomePage() {
  const resumeAvailable = hasResume();
  const photoAvailable = hasFile(about.photo);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "SDET · QA Automation Engineer",
    url: site.url,
    email: `mailto:${site.email}`,
    sameAs: [site.linkedin, site.github],
    worksFor: { "@type": "Organization", name: "FICO" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero resumeAvailable={resumeAvailable} />
      <ToolsMarquee />
      <About photoAvailable={photoAvailable} />
      <Experience />
      <Impact />
      <Skills />
      <Projects />
      <LatestPosts />
      <Contact resumeAvailable={resumeAvailable} />
    </>
  );
}
