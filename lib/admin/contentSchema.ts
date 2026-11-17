/**
 * Schema that drives the "Site content" editor in the admin panel and validates
 * `data/content.json` before it is saved. Keep it in sync with `data/content.ts`.
 */

export type FieldSchema =
  | { kind: "string"; label: string; help?: string; placeholder?: string; mono?: boolean; optional?: boolean }
  | { kind: "text"; label: string; help?: string; rows?: number; optional?: boolean }
  | { kind: "boolean"; label: string; help?: string }
  | { kind: "select"; label: string; options: string[]; help?: string }
  | { kind: "stringList"; label: string; help?: string }
  | { kind: "object"; label: string; help?: string; fields: Record<string, FieldSchema> }
  | { kind: "list"; label: string; help?: string; item: FieldSchema; itemTitle?: string; addLabel?: string };

export interface ContentSection {
  key: string;
  label: string;
  description: string;
  schema: FieldSchema;
}

const str = (label: string, help?: string, extra: Partial<Extract<FieldSchema, { kind: "string" }>> = {}): FieldSchema => ({
  kind: "string",
  label,
  help,
  ...extra,
});
const text = (label: string, help?: string, rows = 3): FieldSchema => ({ kind: "text", label, help, rows });
const tags = (label: string, help?: string): FieldSchema => ({ kind: "stringList", label, help });

export const contentSections: ContentSection[] = [
  {
    key: "site",
    label: "Site & links",
    description: "Your name, public URL, email and social links. Used in the navbar, contact section, footer and SEO tags.",
    schema: {
      kind: "object",
      label: "Site",
      fields: {
        name: str("Name"),
        title: str("Title", "Short role line used in metadata and the OG image."),
        url: str("Site URL", "Public URL without a trailing slash.", { mono: true }),
        email: str("Email"),
        linkedin: str("LinkedIn URL", undefined, { mono: true }),
        github: str("GitHub URL", undefined, { mono: true }),
        resume: str("Resume path", "Path inside /public. Upload the PDF to public/resume.pdf in the repo.", { mono: true }),
      },
    },
  },
  {
    key: "nav",
    label: "Navigation",
    description: "Navbar labels. Each one must match a section: About, Experience, Impact, Skills, Projects, Blog, Contact.",
    schema: tags("Navbar links"),
  },
  {
    key: "hero",
    label: "Hero",
    description: "The first screen a recruiter sees.",
    schema: {
      kind: "object",
      label: "Hero",
      fields: {
        label: str("Label above the name"),
        name: str("Name (H1)"),
        tagline: text("Tagline", "One sentence. Numbers over adjectives.", 2),
        terminal: {
          kind: "object",
          label: "Terminal card",
          fields: {
            command: str("Command", "Start with “$ ” to show a prompt.", { mono: true }),
            output: str("Output line", undefined, { mono: true }),
          },
        },
        status: str("Status chip", "Shown next to the pulsing green dot."),
        stats: {
          kind: "list",
          label: "Stats strip",
          help: "Big numbers under the hero. Four works best. Values like ~190 count up on scroll; 5h → 3h shows as written.",
          itemTitle: "value",
          addLabel: "Add stat",
          item: {
            kind: "object",
            label: "Stat",
            fields: { value: str("Value", "e.g. ~190, 6, or 5h → 3h"), label: str("Label") },
          },
        },
        buttons: {
          kind: "list",
          label: "Buttons",
          itemTitle: "label",
          addLabel: "Add button",
          item: {
            kind: "object",
            label: "Button",
            fields: {
              label: str("Label"),
              href: str("Link", "Use #section for same-page links, or /resume.pdf.", { mono: true }),
              variant: { kind: "select", label: "Style", options: ["primary", "secondary"] },
            },
          },
        },
      },
    },
  },
  {
    key: "about",
    label: "About",
    description: "Bio paragraphs, photo and the quick-fact cards.",
    schema: {
      kind: "object",
      label: "About",
      fields: {
        heading: str("Heading"),
        paragraphs: { kind: "list", label: "Paragraphs", addLabel: "Add paragraph", item: text("Paragraph", undefined, 4) },
        photo: str("Photo path", "Image inside /public, e.g. /profile.png.", { mono: true }),
        facts: {
          kind: "list",
          label: "Quick facts",
          itemTitle: "label",
          addLabel: "Add fact",
          item: { kind: "object", label: "Fact", fields: { label: str("Label"), value: str("Value") } },
        },
      },
    },
  },
  {
    key: "experience",
    label: "Experience",
    description: "Timeline entries, newest first.",
    schema: {
      kind: "list",
      label: "Roles",
      itemTitle: "role",
      addLabel: "Add role",
      item: {
        kind: "object",
        label: "Role",
        fields: {
          role: str("Role"),
          company: str("Company"),
          location: str("Location"),
          period: str("Period", "e.g. Jul 2025 – Oct 2026"),
          points: { kind: "list", label: "Bullet points", addLabel: "Add point", item: text("Point", undefined, 2) },
        },
      },
    },
  },
  {
    key: "impact",
    label: "Impact",
    description: "Case-study cards: problem, approach, result.",
    schema: {
      kind: "object",
      label: "Impact",
      fields: {
        heading: str("Heading"),
        subheading: text("Subheading", undefined, 2),
        cards: {
          kind: "list",
          label: "Cards",
          itemTitle: "title",
          addLabel: "Add card",
          item: {
            kind: "object",
            label: "Card",
            fields: {
              title: str("Title"),
              problem: text("Problem", undefined, 2),
              approach: text("Approach", undefined, 3),
              result: text("Result", "Shown in the green result box. Put the numbers here.", 2),
              tags: tags("Tags"),
            },
          },
        },
      },
    },
  },
  {
    key: "skills",
    label: "Skills",
    description: "Skill groups and the “currently learning” row.",
    schema: {
      kind: "object",
      label: "Skills",
      fields: {
        heading: str("Heading"),
        groups: {
          kind: "list",
          label: "Groups",
          itemTitle: "name",
          addLabel: "Add group",
          item: { kind: "object", label: "Group", fields: { name: str("Group name"), items: tags("Skills") } },
        },
        learning: { kind: "object", label: "Currently learning", fields: { name: str("Label"), items: tags("Items") } },
      },
    },
  },
  {
    key: "projects",
    label: "Projects",
    description: "QA projects show only when “Live” is on and the repo URL is filled in. Placeholders in [BRACKETS] render no link.",
    schema: {
      kind: "object",
      label: "Projects",
      fields: {
        heading: str("Heading"),
        subheading: str("Subheading (when QA projects are live)"),
        comingSoon: str("Subheading (when no QA project is live yet)"),
        qa: {
          kind: "list",
          label: "QA projects",
          itemTitle: "title",
          addLabel: "Add QA project",
          item: {
            kind: "object",
            label: "Project",
            fields: {
              title: str("Title"),
              description: text("Description", undefined, 3),
              tags: tags("Tags"),
              repo: str("Repository URL", undefined, { mono: true }),
              live: { kind: "boolean", label: "Live", help: "Turn on once the repo is public." },
            },
          },
        },
        earlierHeading: str("Earlier projects heading"),
        earlier: {
          kind: "list",
          label: "Earlier projects",
          itemTitle: "title",
          addLabel: "Add earlier project",
          item: {
            kind: "object",
            label: "Project",
            fields: {
              title: str("Title"),
              description: text("Description", undefined, 2),
              tags: tags("Tags"),
              repo: str("Repository URL", "Leave as [REPO URL] to hide the button.", { mono: true }),
              demo: str("Demo URL", "Leave as [DEMO URL] to hide the button.", { mono: true }),
              image: str("Screenshot (optional)", "Image inside /public, e.g. /projects/my-app.png. Leave empty for a generated preview.", {
                mono: true,
                optional: true,
              }),
            },
          },
        },
      },
    },
  },
  {
    key: "blog",
    label: "Blog",
    description: "Headings for the blog pages and the author box under each post.",
    schema: {
      kind: "object",
      label: "Blog",
      fields: {
        heading: str("Blog page heading"),
        subheading: text("Blog subheading", undefined, 2),
        homeHeading: str("Home section heading"),
        viewAll: str("“View all” link text"),
        authorLine: text("Author line", "Shown under every post.", 2),
      },
    },
  },
  {
    key: "contact",
    label: "Contact",
    description: "The closing call to action.",
    schema: {
      kind: "object",
      label: "Contact",
      fields: { heading: str("Heading"), line: text("Line", undefined, 2) },
    },
  },
  {
    key: "footer",
    label: "Footer",
    description: "Footer text and the optional link to this site's source code.",
    schema: {
      kind: "object",
      label: "Footer",
      fields: {
        text: str("Footer text"),
        source: str("Source code URL", "Leave as [GITHUB SOURCE URL] to hide the link.", { mono: true }),
      },
    },
  },
];

/** A sensible empty value for a schema node (used when adding list items). */
export function emptyValue(schema: FieldSchema): unknown {
  switch (schema.kind) {
    case "string":
    case "text":
      return "";
    case "boolean":
      return false;
    case "select":
      return schema.options[0] ?? "";
    case "stringList":
    case "list":
      return [];
    case "object": {
      const out: Record<string, unknown> = {};
      for (const [key, field] of Object.entries(schema.fields)) out[key] = emptyValue(field);
      return out;
    }
  }
}

function validateNode(schema: FieldSchema, value: unknown, path: string, errors: string[]): void {
  switch (schema.kind) {
    case "string":
    case "text":
      if (typeof value !== "string") errors.push(`${path}: must be text`);
      else if (!schema.optional && value.trim() === "") errors.push(`${path}: cannot be empty`);
      return;
    case "boolean":
      if (typeof value !== "boolean") errors.push(`${path}: must be true or false`);
      return;
    case "select":
      if (typeof value !== "string" || !schema.options.includes(value))
        errors.push(`${path}: must be one of ${schema.options.join(", ")}`);
      return;
    case "stringList":
      if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) errors.push(`${path}: must be a list of text values`);
      else if (value.some((v) => v.trim() === "")) errors.push(`${path}: contains an empty item`);
      return;
    case "list":
      if (!Array.isArray(value)) {
        errors.push(`${path}: must be a list`);
        return;
      }
      value.forEach((item, i) => validateNode(schema.item, item, `${path}[${i + 1}]`, errors));
      return;
    case "object":
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        errors.push(`${path}: must be an object`);
        return;
      }
      for (const [key, field] of Object.entries(schema.fields)) {
        validateNode(field, (value as Record<string, unknown>)[key], path ? `${path}.${key}` : key, errors);
      }
      return;
  }
}

/** Returns a list of human-readable problems; empty means the content is valid. */
export function validateContent(value: unknown): string[] {
  const errors: string[] = [];
  if (typeof value !== "object" || value === null || Array.isArray(value)) return ["Content must be a JSON object"];
  const obj = value as Record<string, unknown>;
  for (const section of contentSections) {
    validateNode(section.schema, obj[section.key], section.key, errors);
  }
  return errors;
}
