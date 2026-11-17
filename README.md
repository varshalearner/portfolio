# Varsha Sharma — SDET Portfolio: Build Spec

> **For the AI model reading this:** You are a senior frontend developer and designer. Build this entire portfolio website from this README alone. Follow every section in order. Use the copy in `content.ts` (Section 6) exactly — do not invent, round, or change any number, company, award, date or project. Placeholders in `[SQUARE BRACKETS]` must stay as visible placeholders so the owner can fill them in.
>
> **Deliver:** the full project, file by file, with complete code (no "..." or "rest of code here"), then the commands to run it locally and deploy it to Vercel.

---

## 1. Goal

A one-page portfolio for an **SDET / QA Automation Engineer** (not a web developer). In 10 seconds a recruiter must learn:

1. **Who:** SDET / QA Automation Engineer, ~1.5 years at FICO
2. **What:** API, performance and resiliency test automation for cloud microservices
3. **Proof:** 3,000-test regression 5h → 3h, ~190-test suite built from scratch, 6 Spot Awards
4. **Action:** Download Resume / LinkedIn / Email — one click each

Tone: confident, specific, numbers over adjectives. Never use "passionate", "innovative", "dynamic", "crafting solutions".

---

## 2. Tech stack

| Item | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Animation | Framer Motion — subtle fade-up only |
| Icons | lucide-react (+ simple-icons or inline SVG for GitHub/LinkedIn) |
| Theme | next-themes (dark default, light toggle) |
| Fonts | `next/font`: Inter (headings + body), JetBrains Mono (code/tags/metrics) |
| Blog content | MDX files in the repo, via `next-mdx-remote` + `gray-matter` |
| Code highlighting | `rehype-pretty-code` (shiki), theme-aware |
| Blog extras | `reading-time`, `@tailwindcss/typography` for post styling |
| Deploy | Vercel |

No other UI libraries. No carousel libraries. No CMS or database: a blog post is just a `.mdx` file the owner adds and pushes.

---

## 3. Project structure

```
portfolio/
├── app/
│   ├── layout.tsx          # fonts, ThemeProvider, metadata, Navbar, Footer
│   ├── page.tsx            # renders all sections in order
│   ├── globals.css         # Tailwind + CSS variables for both themes
│   ├── opengraph-image.tsx # generated 1200x630 OG image
│   ├── blog/
│   │   ├── page.tsx        # /blog — list of all posts + tag filter
│   │   └── [slug]/
│   │       ├── page.tsx    # /blog/<slug> — one post (static, generateStaticParams)
│   │       └── opengraph-image.tsx  # per-post OG image with the post title
│   ├── rss.xml/route.ts    # RSS feed of all posts
│   └── sitemap.ts          # home + /blog + every post
├── components/
│   ├── Navbar.tsx
│   ├── ThemeToggle.tsx
│   ├── Section.tsx         # wrapper: id, heading, subheading, fade-up
│   ├── Hero.tsx
│   ├── TerminalLine.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Impact.tsx          # case-study cards
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── LatestPosts.tsx     # home-page "Latest Writing" (3 newest posts)
│   ├── PostCard.tsx
│   ├── MDXComponents.tsx   # styled h2/h3, code blocks, callouts, images
│   ├── Contact.tsx
│   └── Footer.tsx
├── content/
│   └── blog/
│       └── hello-world.mdx # sample post (Section 6b) — owner adds more files here
├── lib/
│   └── posts.ts            # read, parse, sort, filter MDX posts
├── data/
│   └── content.ts          # ALL site text (Section 6) — components read only from here
├── public/
│   ├── resume.pdf          # owner adds this file
│   ├── profile.jpg         # owner adds this file
│   └── favicon.svg         # "VS" monogram in accent green
├── tailwind.config.ts
├── package.json
└── README.md
```

Rule: **no hard-coded copy inside components.** Every string comes from `data/content.ts`, so the owner edits one file.

---

## 4. Design system

### Colors (define as CSS variables, map in Tailwind)

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | `#0B1120` | `#F8FAFC` |
| `--card` | `#111A2E` | `#FFFFFF` |
| `--border` | `#1E293B` | `#E2E8F0` |
| `--text` | `#E2E8F0` | `#0F172A` |
| `--muted` | `#94A3B8` | `#64748B` |
| `--accent` | `#22C55E` | `#16A34A` |
| `--accent-soft` | `rgba(34,197,94,0.12)` | `rgba(22,163,74,0.10)` |

Accent green = "test passed" signal. Use it **only** for buttons, links, key metrics, and the terminal prompt. Must pass WCAG AA contrast in both themes.

### Typography

| Use | Font | Size |
|---|---|---|
| Hero name (H1) | Inter 800 | 48–64px desktop, 36–40px mobile |
| Section heading (H2) | Inter 700 | 32–36px |
| Card title (H3) | Inter 600 | 18–20px |
| Body | Inter 400 | 16–18px, line-height 1.6 |
| Tags, metrics, terminal | JetBrains Mono | 13–15px |

### Layout and components

- Container: max-width 1100px, centered, padding 24px mobile / 32px desktop
- Section spacing: 96px desktop, 64px mobile; alternate sections get a very subtle background tint
- Cards: `rounded-xl`, 1px `--border`, `--card` background, hover = lift 2px + border turns accent at 40% opacity
- Tags/chips: mono font, small, `--accent-soft` background, accent text
- Buttons: primary = accent bg + dark text; secondary = outline; both 44px min height
- Grid: 2 columns desktop (Impact cards, Projects cards), 1 column below 768px

### Motion

- Sections and cards fade up 16px, 250ms, once, when they enter the viewport
- Terminal line types itself once on load (~1.2s total), then stays static
- Respect `prefers-reduced-motion`: disable all motion
- **Forbidden:** parallax, particles, looping typewriters, auto-sliding carousels, skill progress bars

---

## 5. Sections and behavior

Order on the page (navbar links scroll to each `id`):

| # | id | Component | Layout notes |
|---|---|---|---|
| 1 | `home` | Hero | Full viewport height minus navbar; left-aligned text; terminal card below tagline |
| 2 | `about` | About | Text left (2/3), round photo + quick-fact cards right (1/3) |
| 3 | `experience` | Experience | Vertical timeline, newest first, accent dot per role |
| 4 | `impact` | Impact | 2×2 grid of case-study cards: Problem / Approach / Result + tags; Result line in accent |
| 5 | `skills` | Skills | One row per group: group label (muted) + chips; "Currently learning" row in muted style |
| 6 | `projects` | Projects | QA projects grid (only items with `live: true`), then smaller "Earlier Projects" row of 3 compact cards |
| 7 | `writing` | LatestPosts | 3 newest posts as cards + "View all posts →" link to `/blog`; hide the whole section if there are 0 non-draft posts |
| 8 | `contact` | Contact | Centered: heading, line, 3 icon links, Download Resume button |

**Navbar:** "Varsha Sharma" (left) · About · Experience · Impact · Skills · Projects · Blog (goes to `/blog`) · Contact · **Resume** button (accent) · theme toggle. On `/blog` pages, section links point to `/#about`, `/#experience` etc. so they work from any page. Sticky, blurred translucent background after scroll, hamburger menu below 768px, active link highlighted on scroll.

**Hero status chip:** small pill with a pulsing green dot (static if reduced motion).

### Blog pages

**`/blog` (list page)**
- Heading "Blog", subheading from `content.ts`
- Row of tag chips at the top ("All" + every tag used); clicking filters the list (use `?tag=` query param so filtered views are shareable)
- Posts newest first; each `PostCard` shows: title, date (e.g. 16 Nov 2026), reading time, description, tags
- Single-column list, max width 760px

**`/blog/[slug]` (post page)**
- Back link "← All posts"
- Title (H1), date · reading time, tags
- Optional cover image if `cover` is set in frontmatter
- Body styled with `prose` / `dark:prose-invert`, max width 720px, accent-colored links
- Code blocks: syntax highlighting, language label, and a copy button
- Auto table of contents on the right (desktop only) from `##` and `###` headings, with anchor links
- Footer of post: "Previous / Next post" links + a short author box (photo, one line from `content.ts`, LinkedIn button)
- Only the navbar and footer from the main site; no other sections

**Post rules (`lib/posts.ts`)**
- Read every `.mdx` in `content/blog/`; slug = file name
- Skip posts with `draft: true` in production (show them in `npm run dev`)
- Sort by `date` descending; compute reading time
- Invalid or missing frontmatter → fail the build with a clear error naming the file

**Links:** all external links open in a new tab with `rel="noopener noreferrer"`. If a project has no URL, render no button — never a dead link.

---

## 6. Content — `data/content.ts`

Create this file **exactly** (types may be added):

```ts
export const site = {
  name: "Varsha Sharma",
  title: "SDET · QA Automation Engineer",
  url: "https://varshalearner.vercel.app",
  email: "varshalearner@gmail.com",
  linkedin: "https://linkedin.com/in/varshalearner",
  github: "https://github.com/varshalearner",
  resume: "/resume.pdf",
};

export const nav = ["About", "Experience", "Impact", "Skills", "Projects", "Blog", "Contact"];

export const hero = {
  label: "SDET · QA Automation Engineer",
  name: "Varsha Sharma",
  tagline:
    "I build API, performance and resiliency test automation for cloud microservices.",
  terminal: {
    command: "$ pytest tests/ -n auto",
    output: "3000 passed in 3h (was 5h)",
  },
  status: "Open to SDET roles · Immediate joiner · NCR / Remote",
  buttons: [
    { label: "View My Work", href: "#impact", variant: "secondary" },
    { label: "Download Resume", href: "/resume.pdf", variant: "primary" },
  ],
};

export const about = {
  heading: "About Me",
  paragraphs: [
    "I'm an SDET with about 1.5 years of experience at FICO, testing enterprise SaaS microservices running on Kubernetes. I specialise in API automation, performance and resiliency testing, and identity/security testing.",
    "I like making testing faster and smarter. I built a complete test suite from scratch, cut a 3,000-test regression suite from 5 hours to 3, and built an AI-powered regression analyzer that our dev team later adopted. That work earned me 6 Spot Awards in about a year.",
    "I'm looking for SDET roles where I can own quality and reliability for a product.",
  ],
  photo: "/profile.jpg",
  facts: [
    { label: "Experience", value: "~1.5 years at FICO" },
    { label: "Spot Awards", value: "6" },
    { label: "Releases supported", value: "4 releases + 2 hotfixes" },
    { label: "Location", value: "NCR / Remote, India" },
    { label: "Education", value: "[DEGREE, COLLEGE, YEAR]" },
  ],
};

export const experience = [
  {
    role: "Software Quality Assurance Associate Engineer",
    company: "FICO",
    location: "Bengaluru",
    period: "Jul 2025 – Oct 2026",
    points: [
      "Built the DMP Metering test suite from scratch: ~190 tests across 5 microservices covering functional, performance, 72-hour longevity and resiliency testing (pytest, k6, Chaos Mesh).",
      "Cut the DMP Core regression suite (~3,000 tests) from 5 hours to 3 using shared resources and parallel execution; reduced test cleanup from ~12 minutes to ~30 seconds.",
      "Wrote ~200 negative and security tests for authentication flows: OIDC, SAML, JWT and mTLS.",
      "Built an AI-powered regression analyzer that finds likely failure causes from Jenkins, Kubernetes logs and code, and auto-creates Jira defects with logs; later adopted and deployed by the dev team.",
      "Supported 4 releases and 2 hotfixes; received 6 Spot Awards.",
    ],
  },
  {
    role: "Software Quality Assurance Intern",
    company: "FICO",
    location: "Bengaluru",
    period: "Jan 2025 – Jun 2025",
    points: [
      "Created a Jenkins job to run DMP Core smoke tests.",
      "Documented test cases in qTest so new team members could understand the suite.",
    ],
  },
];

export const impact = {
  heading: "Impact at FICO",
  subheading:
    "Selected work. Code is proprietary, so each card shows the problem, approach and result.",
  cards: [
    {
      title: "Regression suite: 5h → 3h",
      problem:
        "A ~3,000-test regression suite took 5 hours, slowing every release validation.",
      approach:
        "Optimized one test class by hand, wrote rules from it, then built a Claude command to apply them across the suite. Added shared resources, parallel runs, and parallel cleanup in dependency order.",
      result:
        "Runtime 5h → 3h, cleanup ~12 min → ~30 sec. The command was used by all 8 people on the team.",
      tags: ["Rest Assured", "Java", "Parallel execution", "Claude"],
    },
    {
      title: "Test suite built from scratch",
      problem: "The new Metering platform (5 microservices) had no automated tests.",
      approach:
        "Designed the framework and wrote functional, performance (1-hour), longevity (72-hour) and chaos tests, plus a 20-test smoke suite for every merge.",
      result: "~190 tests; smoke suite runs in ~5 minutes in CI.",
      tags: ["pytest", "k6", "Chaos Mesh", "Kubernetes", "Athena"],
    },
    {
      title: "AI regression analyzer",
      problem:
        "Debugging regression failures across logs, repos and Jenkins took hours.",
      approach:
        "Python clients for Jenkins, Kubernetes logs, code repos and Jira; Claude finds the likely cause using mapping files that reduce wrong answers; results show on an HTML dashboard.",
      result:
        "Auto-created Jira defects with logs attached. Shared with the IAM and Core QA teams, then deployed by the dev team.",
      tags: ["Python", "Claude API", "Jira API", "Jenkins", "Kubernetes"],
    },
    {
      title: "Chaos testing found a real reliability bug",
      problem: "Unknown how services behave when pods fail.",
      approach: "Ran Chaos Mesh pod-kill experiments independently.",
      result:
        "Found that pods lacked graceful shutdown, so in-flight API calls failed. Developers added graceful shutdown.",
      tags: ["Chaos Mesh", "Kubernetes", "Resiliency"],
    },
  ],
};

export const skills = {
  heading: "Skills",
  groups: [
    { name: "Languages", items: ["Python", "Java", "SQL"] },
    { name: "API Testing", items: ["pytest", "Rest Assured", "Postman"] },
    { name: "Performance & Reliability", items: ["k6", "JMeter", "Chaos Mesh"] },
    { name: "Security & Identity", items: ["OIDC", "SAML", "JWT", "mTLS"] },
    { name: "CI/CD & DevOps", items: ["Jenkins", "GitHub Actions", "Docker", "Kubernetes", "Git"] },
    { name: "Tools", items: ["Jira", "qTest", "Bitbucket"] },
    { name: "AI in Testing", items: ["Claude API", "Claude Code", "AI-assisted test optimization"] },
  ],
  learning: { name: "Currently learning", items: ["Playwright", "Selenium", "AWS"] },
};

export const projects = {
  heading: "Projects",
  subheading: "Public QA projects you can run yourself.",
  // Set live: true and add repo URL only after the repo is public on GitHub.
  qa: [
    {
      title: "API Automation Framework",
      description:
        "pytest framework for a booking API with [NUMBER] positive, negative and auth tests, JSON schema checks and HTML reports, running on every push via GitHub Actions.",
      tags: ["Python", "pytest", "requests", "GitHub Actions"],
      repo: "[REPO URL]",
      live: false,
    },
    {
      title: "Performance Test Suite",
      description:
        "k6 load, stress and soak scenarios with pass/fail thresholds on latency and error rate, with results summarised in the README.",
      tags: ["k6", "Performance", "GitHub Actions"],
      repo: "[REPO URL]",
      live: false,
    },
    {
      title: "UI Automation Suite",
      description:
        "Playwright tests for an e-commerce demo using Page Object Model, running in parallel in CI.",
      tags: ["Playwright", "POM", "GitHub Actions"],
      repo: "[REPO URL]",
      live: false,
    },
  ],
  earlierHeading: "Earlier Projects",
  earlier: [
    {
      title: "SightCall",
      description: "Real-time video calling app with WebRTC and Socket.IO.",
      tags: ["MERN", "WebRTC", "Socket.IO"],
      repo: "[REPO URL]",
      demo: "[DEMO URL]",
    },
    {
      title: "Lung Cancer Analysis",
      description: "ML-based risk prediction with a Node.js backend API.",
      tags: ["MERN", "Python", "ML"],
      repo: "[REPO URL]",
      demo: "[DEMO URL]",
    },
    {
      title: "Online Food Ordering",
      description: "MERN app with an admin panel and recommendations.",
      tags: ["MERN", "Tailwind CSS"],
      repo: "[REPO URL]",
      demo: "[DEMO URL]",
    },
  ],
};

export const blog = {
  heading: "Blog",
  subheading: "Notes on API testing, performance, reliability and using AI in QA.",
  homeHeading: "Latest Writing",
  viewAll: "View all posts →",
  authorLine:
    "Varsha Sharma is an SDET working on API, performance and resiliency test automation.",
};

export const contact = {
  heading: "Let's Talk",
  line: "I'm open to SDET and QA automation roles in NCR or remote. The fastest way to reach me is email.",
};

export const footer = {
  text: "© 2026 Varsha Sharma · Built with Next.js",
  source: "[GITHUB SOURCE URL]",
};
```

**Placeholder rendering rule:** if a URL value starts with `[`, render no link/button for it. If a text value contains `[`, render it as-is (owner will replace it).

**Projects rule:** when every `qa` item has `live: false`, hide the QA grid and show only the subheading "QA projects coming soon on GitHub." followed by the Earlier Projects row.

---

## 6b. Blog post format — `content/blog/hello-world.mdx`

Create this sample post exactly. It doubles as the owner's template for new posts.

````mdx
---
title: "How I Write a New Blog Post"
description: "A short template post: copy this file, rename it, and start writing."
date: "2026-11-16"
tags: ["meta"]
draft: true
cover: ""
---

## Copy this file to start a new post

1. Duplicate this file in `content/blog/` and rename it, e.g. `api-negative-testing.mdx`. The file name becomes the URL: `/blog/api-negative-testing`.
2. Change the frontmatter at the top: `title`, `description`, `date` (YYYY-MM-DD) and `tags`.
3. Set `draft: false` when the post is ready to go live.
4. Write in Markdown below the frontmatter, then commit and push. Vercel publishes it automatically.

## Code blocks work like this

```python
def test_get_booking_returns_200(api_client):
    response = api_client.get("/booking/1")
    assert response.status_code == 200
```
````

**Frontmatter fields:**

| Field | Required | Example |
|---|---|---|
| `title` | yes | `"5 Negative Tests Every API Needs"` |
| `description` | yes | one sentence, used on cards and in Google |
| `date` | yes | `"2026-11-20"` |
| `tags` | yes | `["api-testing", "pytest"]` |
| `draft` | no (default `false`) | `true` hides it in production |
| `cover` | no | `/blog/my-post-cover.png` (file goes in `public/blog/`) |

---

## 6c. Blog posts — create these files exactly

Create each post below as its own file in `content/blog/`, using the file name given. Copy the content **exactly**: do not rewrite, shorten, or add facts. Posts 1–3 are live at launch; posts 4–8 are `draft: true` and the owner publishes one per week by setting `draft: false`.

| # | File | Status |
|---|---|---|
| 1 | `regression-suite-5h-to-3h.mdx` | live |
| 2 | `negative-api-testing-pytest.mdx` | live |
| 3 | `chaos-testing-graceful-shutdown.mdx` | live |
| 4 | `one-k6-script-load-and-longevity.mdx` | draft |
| 5 | `testing-login-flows-oidc-saml-jwt-mtls.mdx` | draft |
| 6 | `test-suite-from-scratch-microservices.mdx` | draft |
| 7 | `ai-regression-failure-triage.mdx` | draft |
| 8 | `smoke-vs-regression-ci-cd.mdx` | draft |

### Post 1 — `content/blog/regression-suite-5h-to-3h.mdx`

````mdx
---
title: "How I Cut a 3,000-Test Regression Suite from 5 Hours to 3"
description: "Shared setup, parallel runs, and a cleanup step that went from 12 minutes to 30 seconds."
date: "2026-11-18"
tags: ["test-optimization", "rest-assured", "parallel-testing", "ai-in-qa"]
draft: false
---

## The problem

Our API regression suite had about 3,000 tests and took around 5 hours to run. Regression was triggered whenever a developer needed a new build validated, so 5 hours meant a developer waited most of a working day for an answer.

When a suite is that slow, people start skipping it. That is when bugs slip into releases.

## Where the time was going

Two things stood out:

- **Repeated setup.** Many tests created the same expensive test data again and again, even when they only read it.
- **Slow cleanup.** Deleting everything the tests created took about 12 minutes, because resources were deleted one by one.

Neither was a single big bug. It was hundreds of small inefficiencies spread across the suite.

## Step 1: Fix one test class by hand

I didn't try to fix 3,000 tests at once. I picked one test class and optimized it manually until it was fast and still reliable. That gave me a working example and, more importantly, a list of what I had actually changed.

## Step 2: Turn the fixes into rules

From that one class I wrote down a set of rules, for example:

- Create shared, read-only setup data once per class, not once per test.
- Keep tests independent so they can safely run in parallel.
- Give every created resource a unique name so parallel tests never collide.
- Never let a test depend on the order in which other tests run.

## Step 3: Apply the rules with AI

Applying these rules by hand across thousands of tests would have taken weeks. So I turned the rules into a Claude command that reviewed a test class and applied the same changes. Every change was still reviewed before merging.

The whole QA team of 8 used the command, and we applied it across most of the suite.

## Fixing the cleanup: 12 minutes to 30 seconds

Cleanup was slow because it deleted resources one at a time. The new approach:

1. Use an admin account to fetch everything the test run created.
2. Delete resources as the user who created them, so permission checks still pass.
3. Delete in dependency order: children before parents.
4. Run deletes in parallel, in small batches of 4, so we don't overload the service.

Here's the batching idea in Java:

```java
ExecutorService pool = Executors.newFixedThreadPool(4);
for (List<Resource> level : resourcesByDependencyLevel) { // children first
    List<Future<?>> futures = new ArrayList<>();
    for (Resource r : level) {
        futures.add(pool.submit(() -> deleteAsOwner(r)));
    }
    for (Future<?> f : futures) {
        f.get(); // finish this level before deleting the parents
    }
}
pool.shutdown();
```

## The result

- Full regression: **5 hours → 3 hours**
- Cleanup: **~12 minutes → ~30 seconds**
- The rules and the command were adopted by the whole team

## What I learned

- **Measure before you optimize.** Most of the time was in setup and cleanup, not in the tests themselves.
- **Do it once by hand first.** A manual fix gives you rules you understand and can defend.
- **AI is great at applying rules you already trust.** It is risky when you ask it to invent the rules.
````

### Post 2 — `content/blog/negative-api-testing-pytest.mdx`

````mdx
---
title: "Negative API Testing: The Tests Most Suites Miss"
description: "A practical checklist of negative tests for REST APIs, with pytest examples you can run today."
date: "2026-11-19"
tags: ["api-testing", "pytest", "negative-testing", "python"]
draft: false
---

## Why negative tests matter

Most API suites check that the right request returns the right answer. Real users, broken clients and attackers send the wrong requests. Negative tests check that the API fails safely and clearly.

I've written around 200 negative and security tests for authentication APIs, and these are the categories I always cover.

## The checklist

| Category | What to send | What you expect |
|---|---|---|
| Authentication | No token, expired token, tampered token | 401 |
| Authorization | Valid token without permission | 403 |
| Missing resource | ID that doesn't exist or was deleted | 404 |
| Input validation | Missing fields, wrong types, empty strings, very long strings | 400 or 422 |
| Wrong method | `DELETE` on a read-only endpoint | 405 |
| Wrong content type | Form data where JSON is expected | 415 or 400 |
| Boundaries | 0, -1, max int, dates in the past | A clear 4xx, never a 500 |

**Golden rule:** bad input should never return a 500. A 500 means the server crashed instead of rejecting the request, and that is a bug.

## Examples with pytest

These use the public practice API [Restful Booker](https://restful-booker.herokuapp.com).

```python
import pytest
import requests

BASE = "https://restful-booker.herokuapp.com"


def test_get_missing_booking_returns_404():
    response = requests.get(f"{BASE}/booking/999999999", timeout=10)
    assert response.status_code == 404


def test_update_without_token_is_rejected():
    response = requests.put(f"{BASE}/booking/1", json={"firstname": "Test"}, timeout=10)
    assert response.status_code in (401, 403)


@pytest.mark.parametrize("payload", [
    {},                                   # empty body
    {"firstname": "A"},                   # missing required fields
    {"firstname": 123, "lastname": None}, # wrong types
])
def test_create_booking_with_bad_payload_is_rejected(payload):
    response = requests.post(f"{BASE}/booking", json=payload, timeout=10)
    assert 400 <= response.status_code < 500, (
        f"Expected a 4xx, got {response.status_code}"
    )
```

Run the last test and you may see it fail with a 500. That isn't a broken test: it's exactly the kind of bug negative tests exist to catch.

## Tips

- **Use `parametrize`.** One test function can cover dozens of bad inputs.
- **Assert the error body too.** A good API tells the client what was wrong without leaking stack traces or internal details.
- **Name tests by behavior,** like `test_update_without_token_is_rejected`. When it fails, the name tells you what broke.
````

### Post 3 — `content/blog/chaos-testing-graceful-shutdown.mdx`

````mdx
---
title: "What a Pod-Kill Chaos Test Taught Me About Graceful Shutdown"
description: "Killing a Kubernetes pod during load exposed failed in-flight requests, and the fix was graceful shutdown."
date: "2026-11-20"
tags: ["chaos-engineering", "kubernetes", "chaos-mesh", "resiliency"]
draft: false
---

## The question

In Kubernetes, pods get killed all the time: deployments, scaling, node issues. A service is supposed to handle that without users noticing. I wanted to check whether ours really did.

## The experiment

I used [Chaos Mesh](https://chaos-mesh.org) to kill one pod of a service while a steady load test was running against it.

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-kill-demo
  namespace: chaos-testing
spec:
  action: pod-kill
  mode: one
  selector:
    namespaces:
      - demo-app
    labelSelectors:
      app: orders-api
```

The setup:

1. Start a steady load test (I used k6).
2. Apply the pod-kill experiment.
3. Watch the error rate and the logs while Kubernetes replaces the pod.

## What happened

Kubernetes started a new pod as expected. But at the moment the old pod was killed, **the API calls it was handling failed**. Clients got errors for requests that were already in progress.

The cause: the service didn't shut down gracefully. When it received the stop signal, it exited immediately instead of finishing the work it had already accepted.

## The fix

I raised the defect with the logs and the error-rate data, and the developers added graceful shutdown. On the application side, that means: when the stop signal (SIGTERM) arrives, stop accepting new requests, finish the in-flight ones, then exit.

Kubernetes settings help too:

```yaml
spec:
  terminationGracePeriodSeconds: 30
  containers:
    - name: orders-api
      lifecycle:
        preStop:
          exec:
            command: ["sh", "-c", "sleep 5"]
```

The short `preStop` sleep gives the load balancer time to stop sending new traffic before the app begins shutting down.

## What I learned

- **"Kubernetes will restart it" is not resiliency.** Restarting the pod doesn't save the requests that were in flight.
- **Always run chaos under load.** With no traffic, this pod kill would have looked perfectly safe.
- **Testers find and prove; developers fix.** My job was to reproduce the failure clearly and hand over evidence that made the fix obvious.
````

### Post 4 — `content/blog/one-k6-script-load-and-longevity.mdx`

````mdx
---
title: "One k6 Script for Load and 72-Hour Longevity Tests"
description: "How to reuse a single k6 script for smoke, 1-hour load and 72-hour longevity runs with environment profiles."
date: "2026-11-27"
tags: ["performance-testing", "k6", "longevity-testing"]
draft: true
---

## Why one script

I ran two kinds of performance tests on a microservice platform: a 1-hour performance test and a 72-hour longevity test. Keeping two copies of the same script means fixing every change twice. So I used one k6 script and switched the load profile with an environment variable.

## Load vs longevity: what each one finds

| Test | Duration | What it finds |
|---|---|---|
| Smoke | 1 minute | The script and environment work at all |
| Load / performance | ~1 hour | Response times and error rate at expected traffic |
| Longevity | 72 hours | Problems that only build up over time: memory growth, slow latency creep, connection or resource leaks |

A service can pass a 1-hour test perfectly and still fall over on day 3. That's why longevity tests exist.

## The script

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const profiles = {
  smoke: { vus: 2, duration: '1m' },
  load: {
    stages: [
      { duration: '5m', target: 50 },
      { duration: '50m', target: 50 },
      { duration: '5m', target: 0 },
    ],
  },
  longevity: {
    stages: [
      { duration: '10m', target: 20 },
      { duration: '72h', target: 20 },
      { duration: '10m', target: 0 },
    ],
  },
};

export const options = {
  ...profiles[__ENV.PROFILE || 'smoke'],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // under 1% errors
    http_req_duration: ['p(95)<500'], // 95% of requests under 500 ms
  },
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

Run it with:

```bash
k6 run -e PROFILE=smoke script.js
k6 run -e PROFILE=load script.js
k6 run -e PROFILE=longevity script.js
```

## Tips

- **Always run smoke first.** Don't find out about a typo 20 hours into a 72-hour run.
- **Thresholds make results pass or fail.** Without them, a performance test is just a graph someone has to interpret.
- **For longevity, watch trends, not averages.** A p95 that slowly climbs from 200 ms to 450 ms over 3 days is a warning, even though it never crosses the threshold.
- **Watch the servers too.** Pair k6 results with pod memory and CPU graphs; leaks show up there first.
````

### Post 5 — `content/blog/testing-login-flows-oidc-saml-jwt-mtls.mdx`

````mdx
---
title: "Testing Login Flows: What to Check in OIDC, SAML, JWT and mTLS"
description: "A tester's checklist of negative and security tests for the most common authentication flows."
date: "2026-12-04"
tags: ["security-testing", "authentication", "jwt", "oidc", "mtls"]
draft: true
---

## Why login flows need extra attention

If login breaks, nobody can use the product. If login is weak, the wrong people can. I spent a large part of my work writing negative and security tests for authentication, around 200 of them, and these are the checks I come back to.

## JWT: the token itself

| Test | Expected |
|---|---|
| Expired token (`exp` in the past) | 401 |
| Signature tampered or signed with the wrong key | 401 |
| Wrong `aud` (token meant for another API) | 401 |
| Wrong `iss` (token from another issuer) | 401 |
| Required claim missing | 401 |
| `alg` set to `none` | 401 |

You can generate these bad tokens yourself with PyJWT:

```python
import time
import jwt  # pip install pyjwt

SECRET = "test-secret"


def make_token(secret=SECRET, **overrides):
    payload = {
        "sub": "user-1",
        "aud": "my-api",
        "iss": "https://auth.example.com",
        "exp": int(time.time()) + 300,
    }
    payload.update(overrides)
    return jwt.encode(payload, secret, algorithm="HS256")


expired = make_token(exp=int(time.time()) - 60)
wrong_audience = make_token(aud="other-api")
wrong_key = make_token(secret="not-the-real-secret")
```

Send each one to a protected endpoint and assert a 401.

## OIDC: the login redirect flow

- `redirect_uri` not registered for the client → rejected
- `state` value changed between request and callback → rejected
- Authorization code used twice → second use rejected
- Wrong client secret when exchanging the code → rejected

## SAML: the assertion

- Unsigned or wrongly signed assertion → rejected
- Expired assertion → rejected
- Assertion meant for a different service (wrong audience) → rejected
- Same assertion replayed → rejected

## mTLS: the client certificate

- No client certificate → connection refused
- Expired certificate → refused
- Certificate signed by an untrusted CA → refused

```python
import pytest
import requests

URL = "https://api.example.com/health"


def test_mtls_with_valid_cert():
    r = requests.get(URL, cert=("client.crt", "client.key"), verify="ca.crt", timeout=10)
    assert r.status_code == 200


def test_mtls_without_cert_is_refused():
    with pytest.raises(requests.exceptions.SSLError):
        requests.get(URL, verify="ca.crt", timeout=10)
```

## What I learned

- **Test the "no" paths more than the "yes" path.** The happy path gets tested by every user; the rejection paths only get tested by you.
- **Check the error response too.** It should say "unauthorized" without revealing why in detail, such as which claim failed.
````

### Post 6 — `content/blog/test-suite-from-scratch-microservices.mdx`

````mdx
---
title: "Building a Test Suite from Scratch for a New Microservice Platform"
description: "How I planned and built ~190 tests across 5 services: smoke, functional, performance, longevity and chaos."
date: "2026-12-11"
tags: ["test-strategy", "pytest", "microservices", "framework-design"]
draft: true
---

## Starting from zero

I was given a new platform of 5 microservices with no automated tests. Before writing a single test, I planned the layers, because the order you build things in decides how quickly the suite becomes useful.

## The layers

| Layer | When it runs | Purpose |
|---|---|---|
| Smoke (20 tests, ~5 min) | Every merge | Is the build basically working? |
| Functional | On demand, before release | Does each service do what it should, including negative cases? |
| Data validation | With functional | Did the data actually land correctly in the data store? |
| Performance (1 hour) | Before release | Is it fast enough at expected load? |
| Longevity (72 hours) | Before major releases | Does it stay healthy over days? |
| Resiliency (chaos) | Before major releases | Does it survive pod failures? |

In total, the suite grew to around 190 tests across the 5 services, using pytest, k6 and Chaos Mesh.

## Build smoke first

Smoke tests give value on day one: every merge gets a 5-minute health check. Everything else can come later.

## A simple framework structure

```text
tests/
├── conftest.py          # shared fixtures: clients, auth, test data, cleanup
├── smoke/
├── functional/
│   ├── service_a/
│   └── service_b/
├── data_validation/
├── performance/         # k6 scripts
└── resiliency/          # Chaos Mesh experiments
utils/
├── api_client.py        # one client per service, with retries and logging
└── data_store.py        # helpers to query and verify stored records
```

Markers let one suite serve many purposes:

```python
import pytest


@pytest.mark.smoke
def test_service_health(api_client):
    assert api_client.get("/health").status_code == 200
```

```bash
pytest -m smoke     # every merge
pytest              # full functional run
```

## Don't stop at the API response

For data pipelines, a 200 response only means the request was accepted. I added tests that queried the data store afterwards to confirm the right records actually arrived. Several real issues only showed up at that step.

## What I learned

- **Plan layers before tests.** It's much easier than reorganizing 100 tests later.
- **Smoke first, chaos last.** Earn trust with fast, stable tests before adding long-running ones.
- **Shared fixtures save the most time.** Clients, auth and cleanup belong in one place.
````

### Post 7 — `content/blog/ai-regression-failure-triage.mdx`

````mdx
---
title: "Using AI to Triage Regression Failures"
description: "How I built a local tool that collects logs, finds the likely cause of a failed test with Claude, and raises a Jira bug."
date: "2026-12-18"
tags: ["ai-in-qa", "python", "jira", "test-automation"]
draft: true
---

## The problem

When a regression run fails, the slow part isn't seeing the red test. It's figuring out why: opening Jenkins, finding the right service logs in Kubernetes, checking recent code changes, and then writing a bug report. For a handful of failures, that can take hours.

## What I built

A Python tool that runs locally and does the first round of investigation automatically:

1. **Collect:** fetch failed tests from Jenkins, the matching Kubernetes logs, and the relevant code from locally cloned repos.
2. **Map:** use mapping files that link each test class to the services and repositories it touches.
3. **Analyze:** send that focused context to Claude to suggest the likely cause.
4. **Report:** show results on an HTML dashboard and create a Jira bug with the logs attached.

## Reducing wrong answers

The biggest risk with AI is a confident wrong answer. What helped most was **giving it less, but more relevant, context**. The mapping files meant the model only saw the logs and code connected to that specific test, instead of guessing across everything.

## Creating the Jira bug

I wrote the Jira client myself. Creating an issue through Jira's REST API looks like this:

```python
import requests


def create_bug(base_url, auth, project_key, summary, description):
    payload = {
        "fields": {
            "project": {"key": project_key},
            "summary": summary,
            "description": description,
            "issuetype": {"name": "Bug"},
        }
    }
    response = requests.post(
        f"{base_url}/rest/api/2/issue", json=payload, auth=auth, timeout=30
    )
    response.raise_for_status()
    return response.json()["key"]
```

## How it spread

I showed two other QA teams how to run it locally. They found it useful, and later the development team took it over and deployed it with their own improvements.

## What I learned

- **AI is a fast first investigator, not the final judge.** A person still confirms the cause before acting on it.
- **Context beats clever prompts.** The right logs and the right code mattered more than prompt wording.
- **Check your company's rules first.** Logs can contain sensitive data; make sure sending them to an AI API is allowed, and strip secrets before you do.
````

### Post 8 — `content/blog/smoke-vs-regression-ci-cd.mdx`

````mdx
---
title: "Smoke vs Regression: Running Tests in a CI/CD Pipeline"
description: "Which tests run on every merge, which run on demand, and how testing fits into a release."
date: "2026-12-25"
tags: ["ci-cd", "github-actions", "jenkins", "test-strategy"]
draft: true
---

## Two suites, two jobs

Running every test on every merge sounds safe, but it makes feedback so slow that people stop waiting for it. So we split tests by purpose:

| | Smoke | Regression |
|---|---|---|
| Size | Small (e.g. 20 tests) | Large (thousands of tests) |
| Time | Minutes | Hours |
| Runs | Automatically on every merge | On demand, to validate a build before it moves forward |
| Question it answers | "Is this build broken?" | "Did anything we already had stop working?" |

## How it fit into a release

1. Smoke runs on every merge.
2. Regression is triggered when a build needs validating.
3. Testing happens on a lower environment first, then a higher one.
4. SRE runs their own checks.
5. Release.

When a test failed, QA raised the defect and debugged it with logs, and developers made the code fix. I supported 4 releases and 2 hotfixes this way.

## Example: smoke on every push (GitHub Actions)

```yaml
name: smoke
on: [push]

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest -m smoke -n auto
```

`-n auto` comes from `pytest-xdist` and runs tests in parallel across CPU cores.

## Example: regression on demand

```yaml
name: regression
on:
  workflow_dispatch:
    inputs:
      image_tag:
        description: "Build to validate"
        required: true

jobs:
  regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest -n auto
        env:
          IMAGE_TAG: ${{ inputs.image_tag }}
```

## What I learned

- **Smoke must stay fast.** If it creeps past 10 minutes, move tests out of it.
- **A flaky test is worse than no test.** People learn to ignore red builds, and then they ignore real failures too.
- **Make regression easy to trigger.** One button and one input make it far more likely to actually be run.
````

## 7. SEO and metadata

In `app/layout.tsx`:

- `title`: `Varsha Sharma — SDET | API & Performance Test Automation`
- `description`: `SDET with 1.5 years at FICO. API automation, performance and resiliency testing for cloud microservices. Open to SDET roles in NCR and remote.`
- Open Graph + Twitter card using the generated `opengraph-image.tsx` (1200×630, dark background, name, title, and the terminal line in mono font)
- `favicon.svg`: "VS" monogram, accent green on dark
- `lang="en"`, semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), one `h1` per page

For blog posts (`generateMetadata` in `app/blog/[slug]/page.tsx`):

- `title`: `<post title> — Varsha Sharma`
- `description`: the post's `description`
- Per-post OG image showing the post title, date and "Varsha Sharma · SDET"
- `article` JSON-LD with headline, datePublished, author
- Canonical URL `https://varshalearner.vercel.app/blog/<slug>`
- `sitemap.ts` lists every published post; `/rss.xml` serves an RSS feed linked from the `<head>`

---

## 8. Accessibility and quality

- WCAG AA contrast in both themes; visible focus rings (accent outline)
- All images have meaningful `alt`; icon-only links have `aria-label`
- Keyboard: navbar, hamburger, theme toggle and all links fully usable with Tab/Enter/Escape
- Responsive from 360px to 1440px with no horizontal scroll
- `next/image` for the photo; no layout shift
- Lighthouse target: 95+ on Performance, Accessibility, Best Practices, SEO

---

## 9. Acceptance checklist (verify before finishing)

- [ ] Every string on the page comes from `data/content.ts`
- [ ] No "MERN Web Developer", "passionate" or "innovative" text anywhere
- [ ] Each project appears exactly once; no carousel
- [ ] No link points to a placeholder or a dead URL
- [ ] Resume button downloads `/resume.pdf`
- [ ] Dark and light themes both look correct; theme choice persists
- [ ] Reduced-motion users see no animation
- [ ] Mobile navbar opens/closes and closes on link click
- [ ] `/blog` lists posts newest first; tag filter works and is shareable via URL
- [ ] All 8 posts from Section 6c exist with exact content; posts 1–3 visible, 4–8 hidden as drafts
- [ ] Draft posts are hidden in production and visible in dev
- [ ] Post pages show reading time, table of contents (desktop), copy button on code blocks, prev/next links
- [ ] Adding a new `.mdx` file and pushing is all it takes to publish a post
- [ ] `/rss.xml` and `/sitemap.xml` include every published post
- [ ] `npm run build` passes with zero TypeScript or lint errors

---

## 10. Owner's to-do (not for the AI)

1. Add `public/resume.pdf` (latest SDET resume) and `public/profile.jpg`.
2. Replace `[DEGREE, COLLEGE, YEAR]`, `[GITHUB SOURCE URL]` and earlier-project URLs in `content.ts` (copy the GitHub repo links for SightCall, Lung Cancer Analysis and Online Food Ordering from the old site; most have no live demo, so leave `demo` as a placeholder and no button will show).
3. Build the 3 QA projects; for each, set `repo`, update the description numbers to match, and set `live: true`.
4. Read all 8 blog posts (Section 6c) before going live, and edit anything that doesn't match how you'd explain it in an interview. Change each post's `date` to the day you actually publish it. Posts 1–3 go live at launch; after that, publish one draft per week by setting `draft: false`, and share each one on LinkedIn. Never add FICO code, internal service names or data.
5. Update GitHub bio to "SDET · API, performance & resiliency testing" and pin the QA repos.
6. Deploy to the **same Vercel project** (or point the new project to the `varshalearner.vercel.app` domain) so the existing URL keeps working, then add the site link to your resume, LinkedIn Featured section and GitHub bio.
