// GEO agency positioning: the three pillars, the full stack, how we compare, the engines
// we cover and the 2026 changelog. Every claim either links to a public source or is a
// commitment of ours, labelled as such. Landscape counts are computed from our review.
import landscape from './audit/landscape.json';

export type Src = { label: string; url: string };

export const S = {
  openai900: { label: 'TechCrunch: ChatGPT reaches 900M weekly active users (Feb 2026)', url: 'https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users/' },
  alphabetQ2: { label: 'Google: Alphabet Q2 2026 earnings, Sundar Pichai remarks (Jul 2026)', url: 'https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/' },
  g2: { label: 'G2: Half of B2B software buyers now start research with AI chatbots (2026)', url: 'https://www.prnewswire.com/news-releases/new-g2-research-half-of-b2b-software-buyers-now-start-their-research-with-ai-chatbots-302742807.html' },
  clarity: { label: 'Microsoft Clarity: AI traffic converts at 3x the rate of other channels (Nov 2025)', url: 'https://clarity.microsoft.com/blog/ai-traffic-converts-at-3x-the-rate-of-other-channels-study/' },
  ahrefsConv: { label: 'Ahrefs: 0.5% of visitors drove 12.1% of signups from AI search (Jun 2025)', url: 'https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/' },
  sparktoro: { label: 'Search Engine Journal: AI recommendations change with nearly every query, SparkToro research (Jan 2026)', url: 'https://www.searchenginejournal.com/ai-recommendations-change-with-nearly-every-query-sparktoro/566242/' },
  ahrefsFresh: { label: 'Ahrefs: AI assistants prefer to cite fresher content, 17M citations (Jul 2025)', url: 'https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/' },
  ahrefsBrands: { label: 'Ahrefs: Top brand visibility factors in ChatGPT, AI Mode and AI Overviews (Dec 2025)', url: 'https://ahrefs.com/blog/ai-brand-visibility-correlations/' },
  ahrefsLists: { label: 'Ahrefs: Do self-promotional “best” lists boost ChatGPT visibility? (Dec 2025)', url: 'https://ahrefs.com/blog/best-lists-research/' },
  geoPaper: { label: 'Aggarwal et al.: GEO, Generative Engine Optimization (KDD 2024)', url: 'https://arxiv.org/abs/2311.09735' },
  googleGuide: { label: 'Google Search Central: Optimizing for generative AI features (Jul 2026)', url: 'https://developers.google.com/search/docs/fundamentals/ai-optimization-guide' },
  scControl: { label: 'Google Search Console Help: Search generative AI control (Aug 2026)', url: 'https://support.google.com/webmasters/answer/16908024' },
  bingAI: { label: 'Bing Webmaster Blog: Introducing AI Performance (Feb 2026)', url: 'https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/' },
  msGuide: { label: 'Microsoft Advertising: Optimizing content for inclusion in AI search answers (Oct 2025)', url: 'https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers' },
  cloudflare: { label: 'Cloudflare changelog: New options to manage AI traffic (Jul 2026)', url: 'https://developers.cloudflare.com/changelog/post/2026-07-01-ai-traffic-options/' },
  webmcp: { label: 'Chrome for Developers: WebMCP (May 2026)', url: 'https://developer.chrome.com/docs/ai/webmcp/' },
  ucp: { label: 'Google for Developers: Universal Commerce Protocol (UCP)', url: 'https://developers.google.com/merchant/ucp/' },
  acp: { label: 'OpenAI: Buy it in ChatGPT, Instant Checkout and the Agentic Commerce Protocol (Sep 2025)', url: 'https://openai.com/index/buy-it-in-chatgpt/' },
  acpDiscovery: { label: 'OpenAI: Powering product discovery in ChatGPT (Mar 2026)', url: 'https://openai.com/index/powering-product-discovery-in-chatgpt/' },
  openaiBots: { label: 'OpenAI: Overview of OpenAI crawlers', url: 'https://developers.openai.com/api/docs/bots' },
  audit: { label: 'SolvX.AI: AI Answer Audit, September 2026', url: '/playbooks/aeo-playbook/' },
  landscape: { label: 'SolvX.AI: GEO Agency Landscape, September 2026', url: '/playbooks/' },
} satisfies Record<string, Src>;

// ---------------------------------------------------------------- landscape counts
type A = (typeof landscape.agencies)[number];
const count = (k: keyof A) => landscape.agencies.filter((a) => a[k] === true).length;
export const LANDSCAPE = {
  total: landscape.agencies.length,
  checked: landscape.checked,
  repeatedRuns: count('repeatedRuns'),
  acknowledgesVariance: count('acknowledgesVariance'),
  publishedPricing: count('publishedPricing'),
  statedTimeline: count('statedTimeline'),
  agentic: count('agentic'),
  webmcpOrUcp: count('webmcpOrUcp'),
  offsite: count('offsite'),
  entity: count('entity'),
  revenueLanguage: count('revenueLanguage'),
  fasterThanMonthly: count('fasterThanMonthly'),
  guarantee: count('guarantee'),
  names: landscape.agencies.map((a) => a.name),
  agencies: landscape.agencies,
  method: landscape.method,
  signals: landscape.signals as Record<string, string>,
};

// ---------------------------------------------------------------- the three pillars
export interface Pillar {
  id: string; n: string; title: string; kicker: string; short: string; line: string; claim: string;
  evidence: { value: string; label: string; src: Src }[];
  how: string[];
  deliver: string[];
}

export const PILLARS: Pillar[] = [
  {
    id: 'business', n: '01', kicker: 'More visibility, more business',
    title: 'Visibility that turns into pipeline',
    short: 'More visibility. More business.',
    line: 'AI answers are the new shortlist. We put you on it, then turn the visits into pipeline.',
    claim: 'AI answers are the new shortlist, and the buyers they send arrive ready. We get you onto the shortlist, then make sure every AI-referred visit becomes a conversation you can count.',
    evidence: [
      { value: '900M', label: 'people use ChatGPT every week.', src: S.openai900 },
      { value: '1B+', label: 'monthly users of Google’s AI Mode, now merged with AI Overviews.', src: S.alphabetQ2 },
      { value: '11×', label: 'higher sign-up rate from AI referrals than from search (1.66% vs 0.15%) across 1,277 sites.', src: S.clarity },
    ],
    how: [
      'Win the prompts that carry buying intent, not vanity questions.',
      'Instrument AI referrals as their own channel in your analytics and CRM.',
      'Fix capture: answer every AI-referred inquiry in minutes, qualify it, route it.',
      'Report pipeline and revenue from AI, not just mentions.',
    ],
    deliver: ['AI-referred pipeline report', 'AI channel in analytics and CRM', 'Speed-to-lead and qualification where it leaks', 'Conversion pages built for pre-sold buyers'],
  },
  {
    id: 'targeted', n: '02', kicker: 'More targeted, less variance and scatter',
    title: 'Precision instead of spray-and-pray',
    short: 'More targeted. Less scatter.',
    line: 'Answers change every run. We measure the odds, then aim at the sources engines cite.',
    claim: 'AI answers change almost every time they are asked, so a screenshot proves nothing. We measure your probability of being named across repeated runs, then aim every action at the exact sources each engine grounds on for your buyers’ prompts.',
    evidence: [
      { value: '<1%', label: 'chance ChatGPT or Google’s AI returns the same brand list twice for the same prompt.', src: S.sparktoro },
      { value: '55–77%', label: 'how often top brands still appeared across varied prompts: the consideration set is stable even when lists are not.', src: S.sparktoro },
      { value: `${LANDSCAPE.repeatedRuns} of ${LANDSCAPE.total}`, label: 'GEO agencies we reviewed describe measuring with repeated runs or confidence intervals.', src: S.landscape },
    ],
    how: [
      'Answer Share: every prompt sampled repeatedly per engine, reported as a probability with a confidence interval.',
      'Prompt sets built from your sales calls, lost deals and reviews, weighted by buying intent.',
      'Source maps: which pages each engine cites for each prompt, so effort goes where answers come from.',
      'Entity engineering so engines stop answering about the wrong company.',
    ],
    deliver: ['Answer Share baseline with confidence intervals', 'Weighted buyer prompt set', 'Source map per engine and prompt', 'Entity fix: one definition, everywhere'],
  },
  {
    id: 'speed', n: '03', kicker: 'High speed, always evolving',
    title: 'Shipped weekly, rebuilt when engines change',
    short: 'High speed. Always evolving.',
    line: 'Baseline in 72 hours. First fixes in 14 days. Releases every week.',
    claim: 'Engines changed their rules at least eight times in 2026 alone. We run GEO like a software team: a baseline in days, changes shipped every week, engines notified the moment a page changes, and our playbook updated whenever the ground moves.',
    evidence: [
      { value: '25.7%', label: 'fresher: the average age gap between pages AI assistants cite and pages in classic results.', src: S.ahrefsFresh },
      { value: '8+', label: 'material changes to AI search rules and tools in 2026, logged in our public changelog.', src: { label: 'SolvX.AI: AI search changelog', url: '/playbooks/ai-search-trends-2026/' } },
      { value: `${LANDSCAPE.agentic} of ${LANDSCAPE.total}`, label: 'GEO agencies we reviewed mention agent readiness at all; none name WebMCP or UCP.', src: S.landscape },
    ],
    how: [
      'Baseline in 72 hours from access; first fixes live within 14 days.',
      'Weekly release notes: what shipped, what moved, what is next.',
      'IndexNow and sitemap pings on every change so engines see it fast.',
      'Agent-ready from day one: WebMCP tools, and commerce protocols where they fit.',
    ],
    deliver: ['72-hour baseline', 'Weekly releases and notes', 'Instant change notification (IndexNow)', 'Agent-readiness build (WebMCP, UCP/ACP where relevant)'],
  },
];

// ---------------------------------------------------------------- the GEO stack
export const STACK = [
  { n: '01', tag: 'Answer Share', short: 'Your odds of being named, engine by engine.', icon: 'gauge', name: 'Answer Share measurement', text: 'Repeated-run sampling across ChatGPT, Google AI Mode and AI Overviews, Copilot, Perplexity, Gemini and Claude. Probabilities with confidence intervals, not screenshots. Official reports from Google and Bing on top.' },
  { n: '02', tag: 'Entity', short: 'One definition of you, everywhere engines look.', icon: 'user-round-check', name: 'Entity engineering', text: 'One definition of who you are, repeated everywhere: site, schema, LinkedIn, directories, founders’ profiles. Explicit disambiguation from look-alike names.' },
  { n: '03', tag: 'Access', short: 'Every AI crawler and agent let in on purpose.', icon: 'scan-search', name: 'Crawl, render and agent access', text: 'Every AI crawler allowed on purpose, CDN rules checked, content readable without JavaScript, IndexNow on every change, WebMCP tools for browser agents.' },
  { n: '04', tag: 'Answer pages', short: 'One deep page per real buyer question.', icon: 'file-text', name: 'Answer pages', text: 'One deep page per real buyer question: short answer first, sourced numbers, tables, visible FAQs, dates. No mass-produced variants.' },
  { n: '05', tag: 'Research', short: 'Original data that engines and journalists quote.', icon: 'chart-column', name: 'Original research', text: 'A data asset every quarter, with method and raw data. Engines quote specific, checkable numbers; so do journalists.' },
  { n: '06', tag: 'Citations', short: 'Placed on the sources engines already cite.', icon: 'radio-tower', name: 'Citation engineering', text: 'Placements on the lists, directories, reviews, videos, LinkedIn articles and communities each engine already cites for your prompts. Disclosed, never faked.' },
  { n: '07', tag: 'Conversion', short: 'AI-referred visits turned into meetings.', icon: 'route', name: 'Conversion layer', text: 'AI-referred visitors arrive pre-sold. Speed-to-lead, qualification and CRM routing turn them into meetings, with pipeline attributed back to AI.' },
];

// ---------------------------------------------------------------- engines we cover
export const ENGINES = ['ChatGPT', 'Google AI Mode', 'Google AI Overviews', 'Microsoft Copilot', 'Perplexity', 'Gemini', 'Claude'];

// ---------------------------------------------------------------- how we compare
export const BETTER = [
  { area: 'Measurement', typical: `Single-run checks or a tool score. ${LANDSCAPE.repeatedRuns} of ${LANDSCAPE.total} agencies we reviewed describe repeated-run measurement.`, ours: 'Answer Share: repeated runs per prompt and engine, probabilities with confidence intervals, plus Google’s and Bing’s own AI reports.' },
  { area: 'Targeting', typical: 'Generic content calendars and keyword lists.', ours: 'Prompt sets from your buyers’ own words, weighted by intent, and a source map of what each engine cites for each prompt.' },
  { area: 'Speed', typical: `Monthly cycles. ${LANDSCAPE.statedTimeline} of ${LANDSCAPE.total} state a timeline at all.`, ours: 'Baseline in 72 hours, first fixes live within 14 days, weekly releases, IndexNow on every change.' },
  { area: 'Keeping up', typical: 'A playbook written once.', ours: 'A public AI search changelog and a playbook updated whenever Google, OpenAI, Microsoft or Cloudflare change the rules.' },
  { area: 'Agent readiness', typical: `${LANDSCAPE.agentic} of ${LANDSCAPE.total} mention it; none name WebMCP or UCP.`, ours: 'WebMCP tools, agent-readable data and commerce-protocol readiness (UCP, ACP) where it fits your business.' },
  { area: 'Business outcome', typical: 'Visibility reports, sometimes with pipeline language.', ours: 'We also run the conversion layer: speed-to-lead, qualification and routing, with AI-referred pipeline in the report.' },
  { area: 'Proof of method', typical: 'Case-study logos.', ours: 'Our own research with raw data, and our own site built to the standard we sell: lint-checked, sourced, dated.' },
  { area: 'Honesty', typical: 'Checklists (llms.txt, “chunking”) sold as levers.', ours: 'Only levers the engines document or studies measure. Google says llms.txt neither helps nor harms, so we never sell it as one.' },
];

// ---------------------------------------------------------------- typical vs SolvX, in a few words
// The short form of BETTER, for pages that should scan in seconds. The full table lives on /why-solvx/.
export const VERSUS = [
  { area: 'Measurement', icon: 'gauge', typical: 'One screenshot', ours: 'Repeated runs with a confidence interval' },
  { area: 'Targeting', icon: 'target', typical: 'Keyword lists', ours: 'A source map for every buyer prompt' },
  { area: 'Speed', icon: 'zap', typical: 'Monthly cycles', ours: '72-hour baseline, weekly releases' },
  { area: 'Keeping up', icon: 'refresh-cw', typical: 'A playbook written once', ours: 'Rebuilt whenever engines change' },
  { area: 'Agents', icon: 'bot', typical: 'Not on the page', ours: 'WebMCP tools, live today' },
  { area: 'Outcome', icon: 'trending-up', typical: 'Visibility reports', ours: 'Pipeline from AI, in the report' },
];

// ---------------------------------------------------------------- 2026 changelog (newest first)
export interface Change { date: string; who: string; what: string; why: string; src: Src }
export const CHANGELOG: Change[] = [
  { date: '2026-09-15', who: 'Cloudflare', what: 'New domains block AI bots classified as Training or Agent on pages that show ads, by default. Search crawlers stay allowed.', why: 'Sites can drop out of agent and training access without anyone deciding to. Check AI Crawl Control.', src: S.cloudflare },
  { date: '2026-08-31', who: 'Google', what: 'Search generative AI control rolled out to every Search Console property: include or exclude a site from AI Overviews, AI Mode and generative Discover.', why: 'A single setting now decides eligibility for Google’s AI features. The default is include.', src: S.scControl },
  { date: '2026-08-26', who: 'Chrome', what: 'Guidance published on building WebMCP tools; the API is in origin trial from Chrome 149.', why: 'Websites can hand browser agents typed tools instead of making them click. Early movers get reliable agent actions.', src: { label: 'Chrome for Developers: Build WebMCP tools (Aug 2026)', url: 'https://developer.chrome.com/docs/ai/webmcp/build-tools' } },
  { date: '2026-07-22', who: 'Google', what: 'AI Mode passes 1 billion monthly users; AI Overviews and AI Mode merged into one Search experience; Google says AI features send billions of clicks a week.', why: 'The AI answer is now the default Google experience, not an experiment.', src: S.alphabetQ2 },
  { date: '2026-07-10', who: 'Google', what: 'Guide to optimising for generative AI features updated: non-commodity content matters most; llms.txt, chunking and special schema are not needed; fan-out pages count as scaled content abuse.', why: 'Clear line between real levers and GEO theatre.', src: S.googleGuide },
  { date: '2026-07-01', who: 'Cloudflare', what: 'All plans can manage AI traffic by behaviour: Search, Agent and Training, each allowed or blocked separately.', why: 'Blocking “AI bots” wholesale is no longer the only option, or the right one.', src: S.cloudflare },
  { date: '2026-05-18', who: 'Chrome', what: 'WebMCP announced: a proposed standard for websites to expose tools to AI agents.', why: 'The agentic web gets a native interface.', src: S.webmcp },
  { date: '2026-03-24', who: 'OpenAI', what: 'Richer product discovery and shopping in ChatGPT, powered by the Agentic Commerce Protocol.', why: 'For commerce brands, ChatGPT becomes a storefront, not just a referrer.', src: S.acpDiscovery },
  { date: '2026-02-27', who: 'OpenAI', what: 'ChatGPT reaches 900 million weekly active users.', why: 'The single largest answer engine keeps growing.', src: S.openai900 },
  { date: '2026-02-10', who: 'Microsoft', what: 'AI Performance report in Bing Webmaster Tools: citations in Copilot and Bing AI answers, cited pages and grounding queries.', why: 'First official citation data from a major engine.', src: S.bingAI },
  { date: '2026-01-30', who: 'SparkToro', what: 'Research: AI tools return the same brand list less than 1% of the time for the same prompt.', why: 'Ranking positions in AI are meaningless; probability of mention is what to measure.', src: S.sparktoro },
  { date: '2026-01-11', who: 'Google', what: 'Universal Commerce Protocol (UCP) detailed: an open standard for agentic buying in AI Mode and Gemini.', why: 'Commerce brands need feeds and checkout that agents can act on.', src: { label: 'Google Developers Blog: Under the hood, Universal Commerce Protocol (Jan 2026)', url: 'https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/' } },
];
