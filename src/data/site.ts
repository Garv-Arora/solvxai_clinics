// Single source for site-wide constants and the SolvX.AI entity facts.
// Everything here feeds the visible "at a glance" blocks AND the Organization JSON-LD,
// so the two can never disagree (Google: structured data must match visible text).

export const SITE = {
  name: 'SolvX.AI',
  // Other spellings people and engines use. Listed so engines join them to one entity.
  alternateNames: ['SolvX AI', 'SolvXAI', 'Solvx AI'],
  // Booking link taken from the GitHub site (Garv-Arora/solvx_ai_v2). Every CTA points here.
  meetUrl: 'https://cal.com/solvx-ai/15min',
  tagline: 'The only GEO agency you need.',

  // The one-sentence entity definition. Repeat it verbatim wherever the brand is introduced
  // (home, about, footer, llms.txt, profiles) so every engine learns the same fact.
  entity:
    'SolvX.AI is a generative engine optimisation (GEO) agency that gets brands named, cited and chosen in AI answers across ChatGPT, Google AI Mode, Copilot, Perplexity, Gemini and Claude, and turns that visibility into pipeline.',
  description:
    'SolvX.AI is the only GEO agency you need: Answer Share measurement with confidence intervals, entity engineering, agent-ready access, answer pages, original research and citation engineering, plus the conversion layer that turns AI visibility into pipeline. Baseline in 72 hours, changes shipped weekly.',

  // Several unrelated companies use near-identical names. AI engines confuse them
  // (seen in ChatGPT, Copilot and Perplexity on 29 Sep 2026). Say so plainly.
  disambiguation:
    'SolvX.AI is an independent GEO agency. It is not affiliated with SOLV(X) (solvx.com), Solvx by PLABS.id (solvx.ai), SolvX (solvx.nl), Solvox AI (solvox.ai) or other similarly named companies.',
  lookalikes: [
    { name: 'SOLV(X)', domain: 'solvx.com', what: 'technology and automation consultancy' },
    { name: 'Solvx by PLABS.id', domain: 'solvx.ai', what: 'AI customer-experience platform, Indonesia' },
    { name: 'SolvX', domain: 'solvx.nl', what: 'data and analytics consultancy, Netherlands' },
    { name: 'Solvox AI', domain: 'solvox.ai', what: 'AI voice-agent platform, India' },
  ],

  // Profiles that are the same entity. CONFIRM before deploy: Perplexity links
  // linkedin.com/company/solvxai to this brand; nothing else has been verified.
  sameAs: ['https://www.linkedin.com/company/solvxai'] as string[],

  // Fill these in: named founders are the strongest trust signal a young agency has.
  // Each entry renders on /about/ and as a Person in the Organization JSON-LD.
  founders: [] as { name: string; role: string; url?: string; bio?: string }[],
  foundingYear: '' as string,
  location: '' as string, // e.g. 'Bengaluru, India' — leave blank until confirmed
  email: '' as string,    // e.g. hello@<domain> — leave blank until confirmed

  areaServed: ['United States', 'United Kingdom', 'Australia', 'United Arab Emirates'],
  languages: ['English'],
  knowsAbout: [
    'Generative engine optimization (GEO)', 'Answer engine optimization (AEO)', 'Search engine optimization (SEO)', 'AI search visibility',
    'Google AI Mode', 'AI Overviews', 'ChatGPT search', 'Local search for clinics', 'Healthcare practice marketing', 'AI citation analysis',
  ],
  // Date the site content was last reviewed end to end. Pages can override with their own.
  updated: '2026-10-07',
  year: new Date().getFullYear(),
};

export const fmtDate = (iso: string) =>
  new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : '')).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
