export const GET = async () => {
  try {
    // Use Vite's import.meta.glob to read all markdown files at build-time.
    const allDocs = import.meta.glob('./docs/**/*.md', { eager: true });
    // Use '?raw' to get the raw uncompiled markdown text since rawContent() was removed in Astro 5+
    const rawDocs = import.meta.glob('./docs/**/*.md', { query: '?raw', import: 'default', eager: true });
    
    const results = Object.keys(allDocs).map((path) => {
      const doc = allDocs[path] as any;
      const rawContent = (rawDocs[path] as string) || '';
      
      const normPath = path.replace(/\\/g, '/');

      // Convert relative file path to an absolute URL path.
      // e.g. './docs/getting-started/quickstart.md' -> '/docs/getting-started/quickstart'
      let url = normPath.replace('./docs/', '/docs/').replace('.md', '');
      if (url === '/docs/index') url = '/docs';

      const relPath = normPath.replace('./docs/', '').replace('.md', '');
      const slug = relPath === 'index' ? 'index' : relPath;
      
      // Enhanced markdown and HTML stripping for clean search index payload
      const cleanContent = rawContent
        .replace(/---[\s\S]*?---/, '') // Strip frontmatter
        .replace(/<[^>]*>?/gm, '')     // Strip HTML tags
        .replace(/!\[.*?\]\(.*?\)/g, '') // Strip images
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract text from links
        .replace(/[#*`_~=|>]/g, '')    // Strip basic markdown syntax
        .replace(/\s+/g, ' ')          // Collapse whitespace
        .trim();

      const category = doc.frontmatter?.category || (slug.includes('/') ? slug.split('/')[0] : 'overview');
      const description = (doc.frontmatter?.description || cleanContent.slice(0, 160)).trim();

      return {
        id: slug,
        title: doc.frontmatter?.title || url,
        category: category,
        slug: slug,
        url: url,
        description: description,
        content: cleanContent
      };
    });

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache strongly as the index won't change between builds
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
