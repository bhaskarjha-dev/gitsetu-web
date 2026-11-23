import { DOCS_MANIFEST, getCategoryLabel } from '../data/docs.mjs';

const manifestBySlug = new Map(DOCS_MANIFEST.map((doc) => [doc.slug, doc]));

export const GET = async () => {
  try {
    const allDocs = import.meta.glob('./docs/**/*.md', { eager: true });
    const rawDocs = import.meta.glob('./docs/**/*.md', { query: '?raw', import: 'default', eager: true });

    const results = Object.keys(allDocs)
      .sort()
      .map((filePath) => {
        const doc = allDocs[filePath] as any;
        const rawContent = (rawDocs[filePath] as string) || '';
        const normPath = filePath.replace(/\\/g, '/');

        let url = normPath.replace('./docs/', '/docs/').replace('.md', '');
        if (url === '/docs/index') url = '/docs';

        const relPath = normPath.replace('./docs/', '').replace('.md', '');
        const slug = relPath === 'index' ? 'index' : relPath;
        const meta = manifestBySlug.get(slug);

        const cleanContent = rawContent
          .replace(/^---[\s\S]*?---/, '')
          .replace(/<[^>]*>?/gm, '')
          .replace(/!\[.*?\]\(.*?\)/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/gi, '')
          .replace(/[#*`_~=|>]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        const categoryId = doc.frontmatter?.category || meta?.category || (slug.includes('/') ? slug.split('/')[0] : 'overview');
        const category = getCategoryLabel(categoryId);
        const description = (doc.frontmatter?.description || meta?.description || cleanContent.slice(0, 160)).trim();
        const semanticKeywords = meta?.keywords || '';
        const enrichedContent = semanticKeywords
          ? `${cleanContent} [Keywords: ${semanticKeywords}]`
          : cleanContent;

        return {
          id: slug,
          title: doc.frontmatter?.title || meta?.title || url,
          category,
          slug,
          url,
          description,
          content: enrichedContent
        };
      });

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
