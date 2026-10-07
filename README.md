# SolvX.AI mini site

A small version of the SolvX.AI site aimed at clinics. Four destinations: Home, Case Studies, Playbooks, Contact Us. Static Astro site, same design system and motion as the main site.

## Run it
```bash
npm run preview
```
Serves the built site at http://localhost:5263. For live editing use `npm run dev` (port 5262).

## Build it
```bash
npm run build:all
```
Builds the site, prints the five playbook PDFs, builds again so the PDFs are included, then runs the page lint. Needs Python with `playwright` and `pypdf` for the PDF step.

## What is on the site
| Page | Path | Content lives in |
|---|---|---|
| Home | `/` | `src/pages/index.astro`; the clinics section reads `src/data/clinics.ts` |
| Case studies | `/case-studies/` and one page each | `src/data/cases.ts` |
| Playbooks | `/playbooks/` and one page each, plus PDFs | `src/data/playbooks.ts` |
| Blog | `/blog/` (not in the top navigation) | Markdown files in `src/pages/blog/` |
| Contact Us | goes straight to `cal.com/solvx-ai/15min` | `SITE.meetUrl` in `src/data/site.ts` |

## Rules this site keeps
- **The case studies are other firms' work.** Each one names who did the work and links to where the result was published. The hub and every case page say so. Do not remove that wording unless a case is replaced by SolvX's own client work.
- **Every number names its source.** Add a new number only with its source.
- **No pricing.** Every call to action goes to the booking link.
- The Regency playbook itself is not published here. It was written for one prospect; its method (the four inputs, the five steps, the terms line) is used on the home page and in the clinic playbook.

## Change things
- **Add a case study:** add an entry to `CASES` in `src/data/cases.ts`. The hub, the page, the footer and the clinic playbook pick it up.
- **Add a playbook:** add an entry to `PLAYBOOKS` in `src/data/playbooks.ts`, then run `npm run build:all` to print its PDF.
- **Add a blog post:** add a Markdown file to `src/pages/blog/` with the same frontmatter as the others.
- **Navigation:** `src/components/Nav.astro`. **Footer:** `src/components/Footer.astro`.
- **Domain:** set `SITE_URL` when building, e.g. `SITE_URL=https://example.com npm run build`.

## Checks
```bash
npm run lint:geo
```
```bash
npm run check:links
```
The link check reports `martech.org` and `rater8.com` as 403: both block scripts and open normally in a browser.
