// The five playbooks. One source for the web editions, the print pages and the PDFs.
// Every number names its source; the source list at the back of each playbook links to it.
import type { GlyphName } from '../components/Glyph.astro';
import { S, CHANGELOG, type Src } from './geo';
import { RATER8, STEPS, INPUTS } from './clinics';
import { CASES } from './cases';
import { fmtDate } from './site';

const X = {
  rater8: RATER8,
  aioTriggers: { label: 'Ahrefs: What triggers AI Overviews? 146 million results pages (Nov 2025)', url: 'https://ahrefs.com/blog/ai-overview-triggers/' },
  brightlocal: { label: 'BrightLocal: Local Consumer Review Survey 2026, 1,002 US consumers (Feb 2026)', url: 'https://www.brightlocal.com/research/local-consumer-review-survey/' },
  ofcom: { label: 'Ofcom: Adults’ Media Use and Attitudes Report (Apr 2026)', url: 'https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/adults/adults-media-use-and-attitudes-2026/adults-media-use-and-attitudes-2026-report.pdf' },
  sistrix: { label: 'SISTRIX: AI citation drift, 82,619 prompts over 17 weeks (May 2026)', url: 'https://www.sistrix.com/blog/ai-citation-drift-how-stable-are-sources-in-ai-search-results/' },
  semrushReddit: { label: 'Semrush: The most-cited domains in AI, 230,000+ prompts (Nov 2025)', url: 'https://www.semrush.com/blog/most-cited-domains-ai/' },
  semrushValue: { label: 'MarTech: The average LLM visitor is worth 4.4x an organic search visitor, Semrush research (Jun 2025)', url: 'https://martech.org/average-llm-visitor-worth-4-4x-organic-search-visitors/' },
} satisfies Record<string, Src>;
// Our own audit has no public page on this site, so it is listed as a source without a link.
const AUDIT: Src = { label: 'SolvX.AI: AI Answer Audit, 202 sources cited by Microsoft Copilot (Sep 2026, our own data)', url: '' };

export type Block =
  | { type: 'stats'; items: { value: string; label: string; src?: Src }[] }
  | { type: 'points'; items: string[] }
  | { type: 'steps'; items: { n: string; name: string; what: string }[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'checklist'; items: string[] }
  | { type: 'note'; text: string };
export interface Section { h: string; lead?: string; blocks: Block[] }
export interface Playbook {
  slug: string; code: string; topic: string; glyph: GlyphName;
  title: string; subtitle: string; intro: string; audience: string;
  sections: Section[]; sources: Src[]; updated: string;
}

const caseRows = CASES.map((c) => [c.practice, c.place, `${c.headline.value} ${c.headline.label.replace(/\.$/, '')}`, c.by.name]);

export const PLAYBOOKS: Playbook[] = [
  {
    slug: 'geo-for-clinics', code: '01', topic: 'GEO', glyph: 'orbit',
    title: 'The GEO Playbook for Clinics',
    subtitle: 'How a practice gets named by ChatGPT and Google.',
    intro: 'Patients now ask an AI who to see. This is how that answer gets built, and the five steps that put a practice in it.',
    audience: 'Owners, COOs and marketing leads at med spas, plastic surgery, dental, dermatology, fertility and eye surgery practices.',
    updated: '2026-10-07',
    sections: [
      { h: 'Patients now ask an AI who to see', blocks: [
        { type: 'stats', items: [
          { value: '47%', label: 'of patients have used AI to research a provider. Nine months earlier it was 31%.', src: X.rater8 },
          { value: '36%', label: 'say AI influenced which provider they chose, ahead of Google search at 34%.', src: X.rater8 },
          { value: '43%', label: 'of health searches on Google now show an AI answer, about double the average.', src: X.aioTriggers },
        ] },
        { type: 'note', text: 'An AI answer names three or four practices. Not ten links. A practice is in the answer or it is not.' },
      ] },
      { h: 'An AI answer is built from four kinds of pages', lead: 'Your own site is one of the four. Most of the gap is on the other three.', blocks: [
        { type: 'table', head: ['Input', 'Where it lives'], rows: INPUTS.map((i) => [i.name, i.eg]) },
        { type: 'stats', items: [
          { value: '43.8%', label: 'of the pages ChatGPT cites are “best of” lists.', src: S.ahrefsLists },
          { value: '0.664', label: 'how closely mentions on other sites track with ChatGPT visibility. The number of pages on your own site: 0.194.', src: S.ahrefsBrands },
        ] },
        { type: 'note', text: 'Nobody can pay to be placed in an AI answer. The work is making your practice the one those pages point to.' },
      ] },
      { h: 'Five steps, measured every month', blocks: [
        { type: 'steps', items: STEPS.map((s) => ({ n: s.num, name: s.name, what: s.what })) },
      ] },
      { h: 'Three gaps to check first', blocks: [
        { type: 'points', items: [
          'City mismatch. Procedure pages titled for the metro, while the clinics sit in the suburbs patients name when they ask.',
          'Location pages that answer no patient questions: an address, a map and nothing an AI could quote.',
          'Proof that lives only on your own site. Awards, publications and case counts that no directory, list or news page repeats.',
        ] },
      ] },
      { h: 'What this kind of work has produced', lead: 'Public results, published by the firms that did the work. None are SolvX clients.', blocks: [
        { type: 'table', head: ['Practice', 'Where', 'Published result', 'Work by'], rows: caseRows },
      ] },
      { h: 'Your first 30 days', blocks: [
        { type: 'checklist', items: [
          'Write down the ten questions patients ask before they book.',
          'Ask each one ten times in ChatGPT, Google AI Mode and Perplexity. Note every practice named.',
          'List the pages each answer cites. That list is your work plan.',
          'Check that robots.txt and your CDN let AI crawlers in.',
          'Give every procedure a page per location, with the patient questions answered on it.',
          'Claim and complete every directory profile. Same name, address and phone everywhere.',
          'Ask for reviews that name the procedure and the city.',
          'Run the same questions again next month.',
        ] },
      ] },
    ],
    sources: [X.rater8, X.aioTriggers, S.ahrefsLists, S.ahrefsBrands, ...CASES.map((c) => c.source)],
  },
  {
    slug: 'aeo-playbook', code: '02', topic: 'AEO', glyph: 'doc',
    title: 'The AEO Playbook',
    subtitle: 'How to write the page an AI quotes.',
    intro: 'Answer engine optimisation is the on-page half of the job: one question, one page, the answer first.',
    audience: 'Whoever writes or signs off the pages on your site.',
    updated: '2026-10-07',
    sections: [
      { h: 'AEO in one line', blocks: [
        { type: 'points', items: [
          'AEO makes a page the easiest source for an answer engine to quote.',
          'GEO is wider. It also covers what other sites say about you.',
          'SEO still gets the page crawled and indexed in the first place.',
        ] },
      ] },
      { h: 'Anatomy of an answer page', blocks: [
        { type: 'steps', items: [
          { n: '01', name: 'The question is the title', what: 'Use the words the patient or buyer uses. In our audit, 55% of the URLs Microsoft Copilot cited contained at least half of the words in the question.' },
          { n: '02', name: 'The answer comes first', what: 'Two sentences that answer the question, before anything else on the page.' },
          { n: '03', name: 'Numbers, with sources', what: 'Adding statistics, quotations and citations lifted visibility by up to 40% in the original GEO study.' },
          { n: '04', name: 'Real questions, visibly answered', what: 'The follow-up questions people ask, answered on the page in plain text, not hidden in a tab.' },
          { n: '05', name: 'A date and a named expert', what: 'Pages AI assistants cite are 25.7% fresher than pages in classic results. Say who wrote or reviewed it and when.' },
          { n: '06', name: 'One page per question', what: 'No mass-produced variants. Google counts pages spun out for every query variation as scaled content abuse.' },
        ] },
      ] },
      { h: 'Questions worth a page', lead: 'For a clinic, six kinds of question carry most of the bookings.', blocks: [
        { type: 'table', head: ['Kind', 'Example'], rows: [
          ['Best for', 'Best facelift surgeon in Scottsdale'],
          ['Cost', 'How much do dental implants cost in Boca Raton?'],
          ['Candidacy', 'Am I a candidate for LASIK?'],
          ['Recovery', 'How long is recovery after Mohs surgery?'],
          ['Comparison', 'Veneers or bonding: which lasts longer?'],
          ['Risk', 'Is IVF safe after 40?'],
        ] },
      ] },
      { h: 'What the engines themselves say', blocks: [
        { type: 'points', items: [
          'Google: content that is not a commodity matters most. llms.txt, content chunking and special schema are not needed for its AI features.',
          'Google: one setting in Search Console now includes or excludes a site from AI Overviews and AI Mode. The default is include.',
          'Microsoft has published its own guidance on structuring content for inclusion in AI answers.',
        ] },
        { type: 'note', text: 'If a tactic is not in an engine’s own documentation and no study has measured it, we do not sell it.' },
      ] },
      { h: 'Before you publish', blocks: [
        { type: 'checklist', items: [
          'The title is the question, in the asker’s words.',
          'The first two sentences answer it.',
          'Every number links to where it came from.',
          'Follow-up questions are answered in visible text.',
          'There is a date and a named clinician or author.',
          'The page reads fully with JavaScript switched off.',
          'No other page on the site answers the same question.',
        ] },
      ] },
    ],
    sources: [S.geoPaper, S.ahrefsFresh, S.googleGuide, S.scControl, S.msGuide, AUDIT],
  },
  {
    slug: 'seo-playbook', code: '03', topic: 'SEO', glyph: 'access',
    title: 'The SEO Playbook for the AI Era',
    subtitle: 'What still matters when a machine writes the answer.',
    intro: 'AI answers are built from pages a crawler could read. SEO is the entry ticket. This is the part of it that still earns its keep.',
    audience: 'Whoever looks after your website and your Google profiles.',
    updated: '2026-10-07',
    sections: [
      { h: 'SEO is the entry ticket', blocks: [
        { type: 'stats', items: [
          { value: '1B+', label: 'people use Google’s AI Mode every month. It is now merged with AI Overviews.', src: S.alphabetQ2 },
          { value: '20.5%', label: 'of Google searches show an AI Overview. For health searches it is 43%.', src: X.aioTriggers },
        ] },
        { type: 'note', text: 'A page that is not crawled and indexed cannot be quoted. Everything else in this playbook follows from that.' },
      ] },
      { h: 'Let the crawlers in', lead: 'Sites drop out of AI answers without anyone deciding they should.', blocks: [
        { type: 'checklist', items: [
          'robots.txt allows the AI search crawlers: OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Googlebot and Bingbot.',
          'Your CDN is not blocking them. Cloudflare now sorts AI bots into Search, Agent and Training, and new domains block Agent and Training bots by default on pages that show ads.',
          'Pages read fully without JavaScript.',
          'The generative AI control in Google Search Console is set to include.',
          'Bing Webmaster Tools is set up. Its AI Performance report shows your citations in Copilot.',
        ] },
      ] },
      { h: 'Local SEO for a clinic', blocks: [
        { type: 'stats', items: [
          { value: '45%', label: 'of US consumers now use AI tools for local business recommendations. A year earlier it was 6%.', src: X.brightlocal },
        ] },
        { type: 'points', items: [
          'A complete Google Business Profile for every location, with services and categories filled in.',
          'A page per location that answers patient questions, not only an address and a map.',
          'The same name, address and phone on every profile, to the letter.',
          'A steady flow of reviews, and a reply to each one.',
        ] },
      ] },
      { h: 'What to stop paying for', blocks: [
        { type: 'points', items: [
          'llms.txt sold as a lever. Google says it neither helps nor harms.',
          '“AI schema” packages. Google says no special schema is needed for its AI features.',
          'A page for every city and every phrasing. Google treats those as scaled content abuse.',
          'Rank tracking for AI “positions”. The same question returns the same list of brands less than 1% of the time.',
        ] },
      ] },
      { h: 'Quarterly check', blocks: [
        { type: 'checklist', items: [
          'Fetch your own pages as an AI crawler would. Confirm you get the full text.',
          'Open Search Console and Bing Webmaster Tools. Read the AI reports.',
          'Search each location by name. Fix any profile that disagrees with your site.',
          'Update the date and the numbers on your ten most-visited pages.',
        ] },
      ] },
    ],
    sources: [S.alphabetQ2, X.aioTriggers, S.cloudflare, S.scControl, S.bingAI, X.brightlocal, S.googleGuide, S.sparktoro, S.openaiBots],
  },
  {
    slug: 'ai-search-trends-2026', code: '04', topic: 'Trends', glyph: 'bars',
    title: 'AI Search Trends 2026',
    subtitle: 'The numbers and rule changes that matter, dated and sourced.',
    intro: 'Who is asking AI, what a visit from it is worth, how fast the answers change, and every rule change of 2026 in one table.',
    audience: 'Anyone deciding how much attention AI search deserves this year.',
    updated: '2026-10-07',
    sections: [
      { h: 'Who is asking', blocks: [
        { type: 'stats', items: [
          { value: '900M', label: 'people use ChatGPT every week.', src: S.openai900 },
          { value: '1B+', label: 'use Google’s AI Mode every month.', src: S.alphabetQ2 },
          { value: '47%', label: 'of US patients have used AI to research a provider.', src: X.rater8 },
          { value: '45%', label: 'of US consumers use AI tools for local business recommendations, up from 6% in a year.', src: X.brightlocal },
          { value: '51%', label: 'of B2B software buyers start research in an AI chatbot more often than Google.', src: S.g2 },
          { value: '54%', label: 'of UK adults use AI tools such as ChatGPT, up from 31% a year earlier.', src: X.ofcom },
        ] },
      ] },
      { h: 'What a visit is worth', blocks: [
        { type: 'stats', items: [
          { value: '1.66%', label: 'sign-up rate from AI referrals, against 0.15% from search, across 1,277 sites.', src: S.clarity },
          { value: '4.4×', label: 'the value of an AI search visitor against an organic search visitor.', src: X.semrushValue },
          { value: '12.1%', label: 'of Ahrefs’ sign-ups came from the 0.5% of visitors sent by AI search.', src: S.ahrefsConv },
        ] },
      ] },
      { h: 'How fast the answers change', blocks: [
        { type: 'stats', items: [
          { value: '<1%', label: 'chance the same question returns the same list of brands twice.', src: S.sparktoro },
          { value: '74%', label: 'of the domains ChatGPT cites change from one week to the next. For Google AI Mode it is 56%.', src: X.sistrix },
          { value: '60% → 10%', label: 'Reddit’s share of ChatGPT responses, before and after mid-September 2025.', src: X.semrushReddit },
        ] },
        { type: 'note', text: 'One screenshot is not a measurement. Ask the question many times and count.' },
      ] },
      { h: 'What gets cited', blocks: [
        { type: 'stats', items: [
          { value: '43.8%', label: 'of the pages ChatGPT cites are “best of” lists.', src: S.ahrefsLists },
          { value: '0.664', label: 'correlation between mentions on other sites and ChatGPT visibility. Pages on your own site: 0.194.', src: S.ahrefsBrands },
          { value: '25.7%', label: 'fresher: pages AI assistants cite, against pages in classic results.', src: S.ahrefsFresh },
        ] },
      ] },
      { h: 'Every rule change of 2026', blocks: [
        { type: 'table', head: ['Date', 'Who', 'What changed'], rows: CHANGELOG.map((c) => [fmtDate(c.date), c.who, c.what]) },
      ] },
      { h: 'What to do about it', blocks: [
        { type: 'points', items: [
          'Measure your odds of being named, every month, across more than one engine.',
          'Put as much work into the lists, directories and reviews as into your own pages.',
          'Keep pages dated and current. Engines favour what was updated recently.',
        ] },
      ] },
    ],
    sources: [S.openai900, S.alphabetQ2, X.rater8, X.brightlocal, S.g2, X.ofcom, S.clarity, X.semrushValue, S.ahrefsConv, S.sparktoro, X.sistrix, X.semrushReddit, S.ahrefsLists, S.ahrefsBrands, S.ahrefsFresh, ...CHANGELOG.map((c) => c.src)],
  },
  {
    slug: 'listings-and-reviews', code: '05', topic: 'Listings', glyph: 'signal',
    title: 'The Listings and Reviews Playbook',
    subtitle: 'The half of AI visibility that is not on your website.',
    intro: 'An AI decides who to name mostly from what other sites say. This is how a clinic gets listed, reviewed and talked about.',
    audience: 'Practice managers and whoever owns your profiles and reviews.',
    updated: '2026-10-07',
    sections: [
      { h: 'Why off-site wins', blocks: [
        { type: 'stats', items: [
          { value: '0.664', label: 'correlation between mentions on other sites and ChatGPT visibility. Pages on your own site: 0.194.', src: S.ahrefsBrands },
          { value: '43.8%', label: 'of the pages ChatGPT cites are “best of” lists.', src: S.ahrefsLists },
          { value: '52%', label: 'of the sources Microsoft Copilot cited for “which provider” questions were lists and directories. Our own audit.' },
        ] },
      ] },
      { h: 'Where a clinic needs to be', blocks: [
        { type: 'table', head: ['Kind', 'Examples', 'What to complete'], rows: [
          ['Health directories', 'Healthgrades, Zocdoc, Vitals, RateMDs', 'Every provider: name, speciality, location, booking link.'],
          ['Aesthetic directories', 'RealSelf', 'Procedures offered, before-and-after photos, answers to patient questions.'],
          ['Maps', 'Google Business Profile, Apple Maps, Bing Places', 'Categories, services and hours for each location.'],
          ['“Best of” lists', 'City magazines, local guides', 'Find the lists the AI cites for your questions. Ask to be considered.'],
          ['Societies', 'Board and society member pages', 'A profile for each clinician, linked to their page on your site.'],
        ] },
      ] },
      { h: 'Reviews an AI can use', blocks: [
        { type: 'points', items: [
          'Ask every patient, at the same point in every visit.',
          'A review that names the procedure and the city says what your site says, in a patient’s words.',
          'Reply to every review, good or bad.',
          'Never buy reviews or screen who gets asked. It breaks the platforms’ rules and US consumer law.',
        ] },
      ] },
      { h: 'Getting talked about', blocks: [
        { type: 'points', items: [
          'Local news and community pages that name the procedure and the city.',
          'Hospital, society and university pages that list your clinicians.',
          'Publications and talks, each linked from the clinician’s page.',
        ] },
        { type: 'note', text: 'The aim is simple: other sites say what your site says.' },
      ] },
      { h: 'Your first 30 days', blocks: [
        { type: 'checklist', items: [
          'List every directory and list that the AI cites for your ten patient questions.',
          'Claim each profile. Make the name, address and phone identical on all of them.',
          'Fill every field: services, procedures, photos, booking link.',
          'Set up one review request that goes to every patient.',
          'Pick two local lists or publications to approach this quarter.',
        ] },
      ] },
    ],
    sources: [S.ahrefsBrands, S.ahrefsLists, AUDIT],
  },
];

export const playbookBySlug = Object.fromEntries(PLAYBOOKS.map((p) => [p.slug, p]));
export const pdfPath = (slug: string) => `/playbooks/solvx-${slug}.pdf`;
