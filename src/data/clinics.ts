// Clinics: the practices we target, the numbers behind the shift, and the delivery system.
// The four inputs and five steps are the same ones in the SolvX AI Visibility Playbook.
import type { GlyphName } from '../components/Glyph.astro';
import type { Src } from './geo';

export const RATER8: Src = { label: 'rater8: 2026 Patient Choice Report, 992 US adults (Apr 2026)', url: 'https://rater8.com/2026-patient-choice-report/' };

export const CLINIC_STATS = [
  { value: '47%', label: 'of patients have used AI to research a provider. Nine months earlier it was 31%.', source: 'rater8, 2026', url: RATER8.url },
  { value: '36%', label: 'say an AI tool influenced which provider they chose, ahead of Google search (34%).', source: 'rater8, 2026', url: RATER8.url },
  { value: '3–4', label: 'names in an AI answer. Not ten links. A practice is in the answer or it is not.' },
];

export const CLINIC_TYPES: { name: string; ask: string; glyph: GlyphName }[] = [
  { name: 'Med spas and aesthetics', ask: '“Best med spa near me”', glyph: 'signal' },
  { name: 'Plastic and cosmetic surgery', ask: '“Best facelift surgeon in my city”', glyph: 'scan' },
  { name: 'Cosmetic and implant dentistry', ask: '“Best dentist for implants”', glyph: 'target' },
  { name: 'Dermatology', ask: '“Best dermatologist for Mohs surgery”', glyph: 'radar' },
  { name: 'Fertility', ask: '“Best IVF clinic near me”', glyph: 'graph' },
  { name: 'LASIK and eye surgery', ask: '“Best LASIK surgeon in my city”', glyph: 'gauge' },
];

// An AI answer is built from four kinds of pages. A practice's own site is one of them.
export const INPUTS = [
  { name: 'Your own pages', eg: 'Procedure, city and provider pages', icon: 'file-text' },
  { name: 'Lists and directories', eg: 'RealSelf, Zocdoc, Healthgrades, Vitals, local “best of” lists', icon: 'list-checks' },
  { name: 'Patient reviews', eg: 'Google, RealSelf, Healthgrades', icon: 'star' },
  { name: 'Press and mentions', eg: 'Local news, society pages, publications', icon: 'newspaper' },
];

export const STEPS = [
  { num: '01', name: 'Baseline', what: 'The questions your patients ask, each run 10 times in ChatGPT, Google AI Mode and Perplexity. Who is named, how often, and which pages were read.' },
  { num: '02', name: 'Answer pages', what: 'One page per procedure per city, built on your real numbers and your own clinicians.' },
  { num: '03', name: 'Get listed', what: 'The directories and “best of” lists the AI reads for those questions, with complete, matching profiles for every provider and clinic.' },
  { num: '04', name: 'Get talked about', what: 'Local press, society pages and reviews that name the procedure and the city, so other sites say what your site says.' },
  { num: '05', name: 'Measure', what: 'The same questions rerun every month. You see mention rate, sources, AI-referred visits and booked consultations.' },
];

export const TERMS = 'Nothing upfront. You pay when it works.';
