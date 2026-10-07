// The blog: Markdown files in src/pages/blog/.
export interface Post { slug: string; url: string; title: string; description: string; date: string; updated: string; kicker: string; minutes: number }

export async function getPosts(): Promise<Post[]> {
  const mods = import.meta.glob('../pages/blog/*.md', { eager: true }) as Record<string, any>;
  const raws = import.meta.glob('../pages/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
  return Object.entries(mods)
    .map(([file, m]) => {
      const slug = file.split('/').pop()!.replace(/\.md$/, '');
      const body = (raws[file] ?? '').replace(/^---[\s\S]*?---/, '');
      const words = body.split(/\s+/).filter(Boolean).length;
      return {
        slug, url: `/blog/${slug}/`, title: m.frontmatter.title, description: m.frontmatter.description,
        date: m.frontmatter.date, updated: m.frontmatter.updated ?? m.frontmatter.date,
        kicker: m.frontmatter.kicker ?? 'Blog', minutes: Math.max(2, Math.round(words / 230)),
      } as Post;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}
