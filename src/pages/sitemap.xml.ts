import type { APIRoute } from 'astro';
import { DOCS_MANIFEST, GITSETU_SITE } from '../data/docs.mjs';

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().split('T')[0];

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
    {
      loc: `${GITSETU_SITE}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0'
    }
  ];

  for (const doc of DOCS_MANIFEST) {
    urls.push({
      loc: `${GITSETU_SITE}${doc.href}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: doc.href === '/docs' ? '0.9' : '0.8'
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
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
