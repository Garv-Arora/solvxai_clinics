// JSON-LD builders. Every page emits one @graph: Organization + WebSite + WebPage
// (+ BreadcrumbList) plus whatever the page adds (Service, Article, FAQPage, Dataset...).
// Nodes reference each other by @id so engines resolve one entity, not many copies.
import { SITE } from './site';

export type Crumb = { name: string; url: string };
type Node = Record<string, unknown>;

export const ids = (site: URL | string) => {
  const base = new URL('/', site).toString();
  return { org: `${base}#organization`, website: `${base}#website`, logo: `${base}#logo` };
};

export function organization(site: URL | string): Node {
  const { org, website, logo } = ids(site);
  const node: Node = {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': org,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    url: new URL('/', site).toString(),
    logo: { '@type': 'ImageObject', '@id': logo, url: new URL('/brand/monogram-copper.png', site).toString(), caption: SITE.name },
    image: { '@id': logo },
    description: SITE.entity,
    disambiguatingDescription: SITE.disambiguation,
    slogan: SITE.tagline,
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'Place', name })),
    knowsAbout: SITE.knowsAbout,
    knowsLanguage: SITE.languages,
    subjectOf: { '@id': website },
    potentialAction: { '@type': 'ScheduleAction', name: 'Book a 15-minute call', target: SITE.meetUrl },
    contactPoint: {
      '@type': 'ContactPoint', contactType: 'sales', url: SITE.meetUrl, availableLanguage: SITE.languages,
      ...(SITE.email ? { email: SITE.email } : {}),
    },
  };
  if (SITE.sameAs.length) node.sameAs = SITE.sameAs;
  if (SITE.foundingYear) node.foundingDate = SITE.foundingYear;
  if (SITE.location) node.address = { '@type': 'PostalAddress', addressLocality: SITE.location };
  if (SITE.email) node.email = SITE.email;
  if (SITE.founders.length) node.founder = SITE.founders.map((f) => ({ '@type': 'Person', name: f.name, jobTitle: f.role, ...(f.url ? { sameAs: [f.url] } : {}) }));
  return node;
}

export function website(site: URL | string): Node {
  const { org, website } = ids(site);
  return {
    '@type': 'WebSite', '@id': website, url: new URL('/', site).toString(), name: SITE.name,
    alternateName: SITE.alternateNames, description: SITE.description, publisher: { '@id': org }, inLanguage: 'en',
  };
}

export function breadcrumbs(site: URL | string, crumbs: Crumb[], pageUrl: string): Node {
  return {
    '@type': 'BreadcrumbList', '@id': `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: new URL(c.url, site).toString() })),
  };
}

export function webPage(site: URL | string, o: {
  url: string; title: string; description: string; type?: string; updated?: string; published?: string; hasCrumbs: boolean; about?: string;
}): Node {
  const { org, website } = ids(site);
  return {
    '@type': o.type ?? 'WebPage', '@id': `${o.url}#webpage`, url: o.url, name: o.title, description: o.description,
    isPartOf: { '@id': website }, publisher: { '@id': org }, inLanguage: 'en',
    about: o.about ? { '@id': o.about } : { '@id': org },
    ...(o.published ? { datePublished: o.published } : {}),
    ...(o.updated ? { dateModified: o.updated } : {}),
    ...(o.hasCrumbs ? { breadcrumb: { '@id': `${o.url}#breadcrumb` } } : {}),
  };
}

export function faqPage(pageUrl: string, faq: { q: string; a: string }[]): Node {
  return {
    '@type': 'FAQPage', '@id': `${pageUrl}#faq`,
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function article(site: URL | string, o: {
  url: string; headline: string; description: string; published: string; updated?: string; section?: string; about?: string; citations?: { label: string; url: string }[];
}): Node {
  const { org } = ids(site);
  return {
    '@type': 'Article', '@id': `${o.url}#article`, headline: o.headline, description: o.description,
    mainEntityOfPage: { '@id': `${o.url}#webpage` }, datePublished: o.published, dateModified: o.updated ?? o.published,
    author: { '@id': org }, publisher: { '@id': org }, inLanguage: 'en',
    ...(o.section ? { articleSection: o.section } : {}),
    ...(o.about ? { about: { '@id': o.about } } : {}),
    ...(o.citations?.length ? { citation: o.citations.map((c) => ({ '@type': 'CreativeWork', name: c.label, url: c.url })) } : {}),
  };
}

export const serviceId = (site: URL | string, slug: string) => new URL(`/${slug}/`, site).toString() + '#service';
