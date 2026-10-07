// GEO lint: checks every built page in dist/ for the things AI engines and search
// engines need. Run after `astro build`:  node scripts/geo_lint.mjs
// Errors fail the process; warnings are printed for review.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const errors = [];
const warns = [];
const err = (p, m) => errors.push(`${p}: ${m}`);
const warn = (p, m) => warns.push(`${p}: ${m}`);

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const exists = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (!clean || clean === '/') return existsSync(join(DIST, 'index.html'));
  const p = join(DIST, ...clean.split('/').filter(Boolean));
  return existsSync(p) && statSync(p).isFile() ? true : existsSync(join(p, 'index.html'));
};
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", '#x27': "'" };
const decode = (s) => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => ENT[e.toLowerCase()] ?? (e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ' '));
const text = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const sitemapXml = files.filter((f) => /sitemap-\d+\.xml$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('');
const sitemapUrls = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));

let pages = 0, words = 0, jsonldNodes = 0;
for (const file of htmlFiles) {
  const rel = '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  if (/http-equiv="refresh"/i.test(html)) continue; // redirect stubs
  const noindex = /<meta name="robots" content="noindex/i.test(html);
  if (noindex) {
    if (sitemapUrls.has(rel)) err(rel, 'noindex page is listed in the sitemap');
    continue;
  }
  pages++;
  const body = text(html.replace(/<header class="nav"[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, ' '));
  const wc = body.split(' ').length; words += wc;

  // Title, description, canonical
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  if (!title) err(rel, 'missing <title>');
  else if (title.length > 72) warn(rel, `title is ${title.length} chars (long titles get truncated): ${title}`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (!desc) err(rel, 'missing meta description');
  else if (desc.length < 60 || desc.length > 300) warn(rel, `meta description is ${desc.length} chars`);
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canon) err(rel, 'missing canonical');
  else if (new URL(canon).pathname !== rel && rel !== '/404.html' && !rel.endsWith('.html')) err(rel, `canonical points elsewhere: ${canon}`);
  if (rel !== '/404.html' && !sitemapUrls.has(rel)) warn(rel, 'indexable page missing from sitemap');

  // Headings
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) err(rel, `expected exactly one <h1>, found ${h1s}`);

  // Hidden answers (Bing: AI may not render content in tabs/accordions)
  if (/<details[\s>]/.test(html)) warn(rel, 'uses <details>; answers inside may be skipped by AI parsers');

  // Structured data
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocks.length) err(rel, 'no JSON-LD');
  let types = [];
  for (const b of blocks) {
    try {
      const j = JSON.parse(b);
      const nodes = j['@graph'] ?? (Array.isArray(j) ? j : [j]);
      jsonldNodes += nodes.length;
      types.push(...nodes.flatMap((n) => [].concat(n['@type'])));
      for (const n of nodes) if (n['@type'] === 'FAQPage') {
        for (const q of n.mainEntity ?? []) if (!body.includes(decode(q.name).replace(/\s+/g, ' ').slice(0, 40))) err(rel, `FAQ question not visible on page: ${q.name}`);
      }
    } catch (e) { err(rel, `invalid JSON-LD: ${e.message}`); }
  }
  if (!types.includes('Organization')) err(rel, 'Organization node missing from JSON-LD');

  // Content pages need a visible date and an Article with dateModified
  const isContent = /^\/(answers|compare|field-notes|research|playbooks)\/[^/]+\/$/.test(rel) && !/\/(answers|compare|field-notes|research|playbooks)\/$/.test(rel);
  if (isContent) {
    if (!/<time datetime="\d{4}-\d{2}-\d{2}"/.test(html)) err(rel, 'content page without a visible <time> date');
    if (!/"dateModified":"\d{4}/.test(html)) err(rel, 'content page without dateModified in JSON-LD');
  }
  // Answer and compare pages: the short answer must exist and be quotable
  if (/^\/(answers|compare)\/[^/]+\/$/.test(rel)) {
    const short = html.match(/<p class="short-a[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1];
    if (!short) err(rel, 'missing short answer');
    else { const n = text(short).split(' ').length; if (n < 25 || n > 110) warn(rel, `short answer is ${n} words (aim for 40–90)`); }
    if (!/Sources<\/h2>/.test(html)) err(rel, 'answer page without a Sources section');
  }

  // Internal links and images
  for (const m of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|javascript:)/.test(href)) continue;
    if (!exists(href)) err(rel, `broken internal link: ${href}`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) err(rel, 'image without alt text');

  // Punctuation Microsoft flags as hard to parse, in visible text
  const dashes = (body.match(/—/g) ?? []).length;
  if (dashes / Math.max(wc, 1) > 0.01) warn(rel, `${dashes} em dashes in ${wc} words (Microsoft suggests using them sparingly)`);
}

// Site-level files
for (const f of ['robots.txt', 'sitemap-index.xml', '_redirects', '_headers']) {
  if (!existsSync(join(DIST, f))) err('/' + f, 'missing');
}
const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
for (const bot of ['OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot', 'Bingbot', 'Googlebot']) {
  const block = robots.match(new RegExp(`User-agent: ${bot}\\n([\\s\\S]*?)\\n\\n`))?.[1] ?? '';
  if (/Disallow: \/\s*$/m.test(block)) err('/robots.txt', `${bot} is blocked from the whole site`);
}
if (!/^Sitemap: https?:\/\//m.test(robots)) err('/robots.txt', 'no absolute Sitemap line');

console.log(`GEO lint: ${pages} indexable pages, ~${Math.round(words / 1000)}k words, ${jsonldNodes} JSON-LD nodes, ${sitemapUrls.size} sitemap URLs`);
if (warns.length) { console.log(`\n${warns.length} warning(s):`); warns.forEach((w) => console.log('  ! ' + w)); }
if (errors.length) { console.log(`\n${errors.length} error(s):`); errors.forEach((e) => console.log('  x ' + e)); process.exit(1); }
console.log('\nNo errors.');
