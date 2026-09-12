import type { APIRoute } from 'astro';

const SITE = 'https://gitsetu.bhaskarjha.dev';

export const GET: APIRoute = async () => {
  const markdownFiles = import.meta.glob('/src/pages/docs/**/*.md', { eager: true });
  
  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
    {
      loc: `${SITE}/`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      loc: `${SITE}/docs`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.9',
    },
  ];

  for (const path in markdownFiles) {
    const slug = path.replace('/src/pages/', '').replace('.md', '');
    if (slug === 'docs/overview/introduction' || slug === 'docs/index') continue;
    
    urls.push({
      loc: `${SITE}/${slug}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
