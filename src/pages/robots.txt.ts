import type { APIRoute } from 'astro';

// Generated so the Sitemap line always matches SITE_URL. Every search engine and AI crawler
// is allowed on purpose: this site exists to be read and cited. Print-only pages are excluded.
export const GET: APIRoute = ({ site }) => {
  const lines = [
    '# robots.txt for SolvX.AI',
    'User-agent: *',
    'Allow: /',
    'Disallow: /playbooks/print/',
    '',
    `Sitemap: ${new URL('/sitemap-index.xml', site).toString()}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
