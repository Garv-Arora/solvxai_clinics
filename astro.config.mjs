import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';

// Brand domain is still undecided — set SITE_URL at build time once it is.
const site = process.env.SITE_URL || 'https://solvx-ai.pages.dev';
const SITE_UPDATED = '2026-10-07';

// Real last-modified dates for the sitemap, read from the blog posts' frontmatter.
// Everything else uses the site review date.
const lastmod = {};
for (const f of readdirSync(new URL('./src/pages/blog/', import.meta.url)).filter((x) => x.endsWith('.md'))) {
  const fm = readFileSync(new URL(`./src/pages/blog/${f}`, import.meta.url), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const d = fm.match(/^updated:\s*"?([\d-]+)"?/m)?.[1] ?? fm.match(/^date:\s*"?([\d-]+)"?/m)?.[1];
  if (d) lastmod[`/blog/${f.replace(/\.md$/, '')}/`] = d;
}

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/playbooks/print/') && !page.endsWith('/404/'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        item.lastmod = new Date(`${lastmod[path] ?? SITE_UPDATED}T00:00:00Z`).toISOString();
        return item;
      },
    }),
  ],
  build: { format: 'directory' },
});
