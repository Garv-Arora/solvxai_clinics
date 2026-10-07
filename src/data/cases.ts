// Public case studies. Every one of these was done and published by the firm named in `by`,
// not by SolvX.AI. Each figure was read on the source page on the date in `read`.
// Nothing here is a SolvX result, and no page may present it as one.
import type { GlyphName } from '../components/Glyph.astro';

export interface CaseStudy {
  slug: string;
  practice: string;
  specialty: string;
  place: string;          // city, state
  region: string;         // part of the US
  lead?: string;          // clinician named on the source page
  by: { name: string; url: string };
  source: { label: string; url: string };
  read: string;           // ISO date the source was read
  period: string;
  headline: { value: string; label: string };
  metrics: { value: string; label: string }[];
  summary: string;
  did: string[];
  takeaways: string[];    // ours: what the case shows
  quote?: { text: string; who: string };
  also?: { title: string; text: string };
  aiAngle: string;        // the AI-search part of the result, in a line
  glyph: GlyphName;
}

export const CASES: CaseStudy[] = [
  {
    slug: 'wall-street-dermatology-new-york',
    practice: 'Wall Street Dermatology',
    specialty: 'Dermatology',
    place: 'New York, NY',
    region: 'Northeast',
    lead: 'Dr. Julia Tzu, MD, FAAD',
    by: { name: 'Halcy', url: 'https://halcy.ai/' },
    source: { label: 'Halcy: case studies', url: 'https://halcy.ai/case-studies' },
    read: '2026-10-07',
    period: '2 months',
    headline: { value: '28% → 40%', label: 'ChatGPT mention rate: the share of test prompts that named the practice.' },
    metrics: [
      { value: '+20%', label: 'appointments, from scheduling data.' },
      { value: '+85%', label: 'visits from Google search.' },
      { value: '+40%', label: 'booking conversion.' },
    ],
    summary: 'A Manhattan dermatology practice went from being named in 28% of test prompts in ChatGPT to 40% in two months, with appointments up 20%.',
    did: [
      'Treatment pages rebuilt with patient questions, structured data and evidence.',
      '20 new pages for specific skin conditions.',
      'High-intent service pages rebuilt to convert.',
      'Dedicated pages for nearby areas: Jersey City and Brooklyn.',
      'Ongoing tuning for both search and AI assistants.',
    ],
    takeaways: [
      'Measured as a mention rate over many prompts, not one screenshot.',
      'One page per condition and per nearby area did the work.',
      'The AI gain came with a booking gain, in the same two months.',
    ],
    quote: { text: 'My appointment volume has increased since working with Halcy.', who: 'Dr. Julia Tzu, MD, FAAD, Wall Street Dermatology' },
    also: {
      title: 'Same source, plastic surgery',
      text: 'A plastic surgery practice in the Midwest (name withheld by the practice): ChatGPT mention rate 14% to 29%, Google AI Overview mentions 16% to 24%, appointments +39%, in 3 months, after a full site rebuild from 17 pages to more than 40.',
    },
    aiAngle: 'Named in 40% of ChatGPT test prompts, up from 28%.',
    glyph: 'radar',
  },
  {
    slug: 'west-michigan-plastic-surgery-kalamazoo',
    practice: 'West Michigan Plastic Surgery',
    specialty: 'Plastic surgery',
    place: 'Kalamazoo, MI',
    region: 'Midwest',
    lead: 'Dr. Scott Holley',
    by: { name: 'Medical Advertising Agency', url: 'https://medicaladvertising.agency/' },
    source: { label: 'Medical Advertising Agency: West Michigan Plastic Surgery', url: 'https://medicaladvertising.agency/work/holley/' },
    read: '2026-10-07',
    period: 'Ongoing engagement',
    headline: { value: 'Named first', label: 'by Google’s AI for “kalamazoo facelift”.' },
    metrics: [
      { value: '#1', label: 'in the map pack and organic results for “kalamazoo facelift” and “kalamazoo plastic surgery”.' },
      { value: '65', label: 'in-depth procedure videos, plus 120+ short vertical videos.' },
      { value: '2', label: 'procedure micro-sites: one for facelift, one for rhinoplasty.' },
    ],
    summary: 'A West Michigan plastic surgeon became the first name Google’s AI gives for a facelift in his city, on the back of a deep library of procedure video and two single-procedure sites.',
    did: [
      '65 in-depth video productions and more than 120 short vertical videos.',
      'Two micro-sites, each about one procedure.',
      'A redesign of the main practice site.',
      'A photography library of portraits and stills.',
    ],
    takeaways: [
      'Depth on one procedure in one city beats a thin page on every procedure.',
      'Video counts: YouTube mentions track with AI visibility more closely than any other factor Ahrefs measured.',
      'The agency reports facelift demand grew enough for the surgeon to shift his practice toward face surgery.',
    ],
    aiAngle: 'First practice named by Google’s AI for a facelift in Kalamazoo.',
    glyph: 'scan',
  },
  {
    slug: 'richmond-surgical-arts-virginia',
    practice: 'Richmond Surgical Arts',
    specialty: 'Plastic surgery and med spa',
    place: 'Richmond, VA',
    region: 'Mid-Atlantic',
    lead: 'Dr. Gregory T. Lynam',
    by: { name: 'Medical Advertising Agency', url: 'https://medicaladvertising.agency/' },
    source: { label: 'Medical Advertising Agency: Richmond Surgical Arts', url: 'https://medicaladvertising.agency/work/richmond-surgical-arts/' },
    read: '2026-10-07',
    period: '16 months',
    headline: { value: '1.17M', label: 'Google search impressions in 16 months.' },
    metrics: [
      { value: '14.4K', label: 'clicks from Google to the practice’s sites.' },
      { value: '30', label: 'videos: case studies, education and testimonials.' },
      { value: '3', label: 'places it shows up: AI Overview citations, organic results and the local 3-pack.' },
    ],
    summary: 'A Richmond plastic surgery and med spa practice built presence in three places at once: Google’s AI Overviews, the organic results and the local map pack.',
    did: [
      'Video production, SEO, web design and social media.',
      'A network of four sites: the flagship practice site and three focused on single services.',
      '30 videos across patient cases, education and testimonials.',
    ],
    takeaways: [
      'AI Overviews, organic results and the map pack are won by the same body of work.',
      'Single-service sites give the AI a clear page to cite for a single question.',
      'The source reports the work carried on through a change of ownership.',
    ],
    aiAngle: 'Cited in Google’s AI Overviews, alongside organic and map-pack placement.',
    glyph: 'orbit',
  },
  {
    slug: 'innovative-dental-aesthetics-boca-raton',
    practice: 'Innovative Dental Aesthetics',
    specialty: 'Cosmetic dentistry',
    place: 'Boca Raton, FL',
    region: 'Southeast',
    lead: 'Dr. Derek Gatta',
    by: { name: 'Namami Inc', url: 'https://www.namamiinc.com/' },
    source: { label: 'CaseStudies.com: Innovative Dental Aesthetics and Namami', url: 'https://www.casestudies.com/company/namami-inc/case-study/innovative-dental-aesthetics-boosts-patient-appointments-27-with-namami' },
    read: '2026-10-07',
    period: 'Not stated',
    headline: { value: '+27%', label: 'patient appointments.' },
    metrics: [
      { value: '170+', label: 'top-10 Google rankings.' },
      { value: '9,000+', label: 'new users reached.' },
    ],
    summary: 'A Boca Raton cosmetic dentistry practice raised patient appointments by 27% with a search programme that covered both Google rankings and AI search visibility.',
    did: [
      'SEO together with an AI search visibility strategy.',
      'Content-led social media growth.',
      'Targeted patient engagement.',
    ],
    takeaways: [
      'The published measure is appointments, not traffic.',
      'Classic search and AI search were run as one programme, not two.',
      'The source gives no timeframe and no AI mention rate, so treat it as the least detailed of the four.',
    ],
    aiAngle: 'SEO and AI search visibility run as one programme.',
    glyph: 'target',
  },
];

export const caseBySlug = Object.fromEntries(CASES.map((c) => [c.slug, c]));
export const CASE_NOTE = 'Public case study. The work was done and the results published by the firm named here, not by SolvX.AI. Figures are as published and were not independently audited.';
