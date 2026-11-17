/**
 * All site copy lives in `data/content.json`.
 *
 * This file is the typed access point components import from. The JSON file
 * is the single source of truth so the admin panel (/admin/content) can edit
 * it without touching code. Edit either the JSON directly or use the admin.
 */
import content from "./content.json";

export type ButtonVariant = "primary" | "secondary";

export interface HeroButton {
  label: string;
  href: string;
  variant: ButtonVariant;
}

export interface Site {
  name: string;
  title: string;
  url: string;
  email: string;
  linkedin: string;
  github: string;
  resume: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface Hero {
  label: string;
  name: string;
  tagline: string;
  terminal: { command: string; output: string };
  status: string;
  /** Numbers strip under the hero. Values like "~190" count up; "5h → 3h" shows as-is. */
  stats: HeroStat[];
  buttons: HeroButton[];
}

export interface Fact {
  label: string;
  value: string;
}

export interface About {
  heading: string;
  paragraphs: string[];
  photo: string;
  facts: Fact[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

export interface ImpactCard {
  title: string;
  problem: string;
  approach: string;
  result: string;
  tags: string[];
}

export interface Impact {
  heading: string;
  subheading: string;
  cards: ImpactCard[];
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface Skills {
  heading: string;
  groups: SkillGroup[];
  learning: SkillGroup;
}

export interface QaProject {
  title: string;
  description: string;
  tags: string[];
  repo: string;
  live: boolean;
}

export interface EarlierProject {
  title: string;
  description: string;
  tags: string[];
  repo: string;
  demo: string;
  /** Screenshot inside /public (e.g. /projects/app.png). Empty = generated preview. */
  image: string;
}

export interface Projects {
  heading: string;
  subheading: string;
  comingSoon: string;
  qa: QaProject[];
  earlierHeading: string;
  earlier: EarlierProject[];
}

export interface Blog {
  heading: string;
  subheading: string;
  homeHeading: string;
  viewAll: string;
  authorLine: string;
}

export interface Contact {
  heading: string;
  line: string;
}

export interface Footer {
  text: string;
  source: string;
}

export interface SiteContent {
  site: Site;
  nav: string[];
  hero: Hero;
  about: About;
  experience: ExperienceItem[];
  impact: Impact;
  skills: Skills;
  projects: Projects;
  blog: Blog;
  contact: Contact;
  footer: Footer;
}

const typed = content as SiteContent;

export const site = typed.site;
export const nav = typed.nav;
export const hero = typed.hero;
export const about = typed.about;
export const experience = typed.experience;
export const impact = typed.impact;
export const skills = typed.skills;
export const projects = typed.projects;
export const blog = typed.blog;
export const contact = typed.contact;
export const footer = typed.footer;

export default typed;
