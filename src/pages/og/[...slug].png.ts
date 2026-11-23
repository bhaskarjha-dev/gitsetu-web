import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { GITSETU_VERSION, getCategoryLabel } from '../../data/docs.mjs';

const pages = import.meta.glob('/src/pages/docs/**/*.md', { eager: true });

let cachedFontsPromise: Promise<{ bold: ArrayBuffer; regular: ArrayBuffer }> | null = null;
let cachedLogoDataUri: string | null = null;

function loadLogoDataUri(): string {
  if (!cachedLogoDataUri) {
    const logoPath = path.resolve(process.cwd(), 'public/logo.png');
    const base64 = fs.readFileSync(logoPath).toString('base64');
    cachedLogoDataUri = `data:image/png;base64,${base64}`;
  }
  return cachedLogoDataUri;
}

async function fetchOrFallback(url: string, fallbacks: string[]): Promise<ArrayBuffer> {
  try {
    const res = await fetch(url);
    if (res.ok) {
      return await res.arrayBuffer();
    }
  } catch {
    // Fallback to local system font if offline
  }
  for (const candidate of fallbacks) {
    if (fs.existsSync(candidate)) {
      const buf = fs.readFileSync(candidate);
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
  }
  throw new Error(`Could not load font (${url}) or local fallback for OG image generation.`);
}

function loadFonts(): Promise<{ bold: ArrayBuffer; regular: ArrayBuffer }> {
  if (!cachedFontsPromise) {
    cachedFontsPromise = (async () => {
      const [bold, regular] = await Promise.all([
        fetchOrFallback(
          'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff',
          [
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
            '/usr/share/fonts/truetype/adwaita/AdwaitaSans-Regular.ttf'
          ]
        ),
        fetchOrFallback(
          'https://og-playground.vercel.app/inter-latin-ext-400-normal.woff',
          [
            '/usr/share/fonts/truetype/adwaita/AdwaitaSans-Regular.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
          ]
        )
      ]);
      return { bold, regular };
    })();
  }
  return cachedFontsPromise;
}

export async function getStaticPaths() {
  return Object.keys(pages).map((filePath) => {
    const rawSlug = filePath.replace('/src/pages/', '').replace('.md', '');
    // Map docs/index -> docs so /og/docs.png matches DocsLayout's canonical /docs URL
    const slug = rawSlug === 'docs/index' ? 'docs' : rawSlug;
    return {
      params: { slug },
      props: { page: pages[filePath], routePath: `/${slug}` }
    };
  });
}

export const GET = async ({ props }: { props: { page: any; routePath: string } }) => {
  const { page, routePath } = props;
  const fm = (page as any).frontmatter || {};
  const title = String(fm.title || 'GitSetu Documentation');
  const description = String(
    fm.description || 'Bash 3.2 Git multi-identity orchestration engine.'
  );
  const category = getCategoryLabel(fm.category || 'overview');

  const { bold, regular } = await loadFonts();
  const logoUri = loadLogoDataUri();

  // Adaptive headline size prevents multi-line wrapping from crowding the footer
  const titleFontSize = title.length > 28 ? '48px' : title.length > 20 ? '54px' : '62px';

  const markup = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#030508',
        backgroundImage:
          'radial-gradient(circle at 86% 18%, rgba(0, 196, 204, 0.2) 0%, rgba(14, 165, 233, 0.07) 34%, transparent 62%)',
        color: '#ffffff',
        padding: '48px',
        fontFamily: 'Inter'
      },
      children: {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            border: '1px solid rgba(0, 196, 204, 0.28)',
            borderRadius: '26px',
            padding: '48px 54px',
            backgroundColor: 'rgba(10, 13, 19, 0.94)'
          },
          children: [
            // Top bar: Brand + Version + Category Pill
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%'
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', alignItems: 'center' },
                      children: [
                        {
                          type: 'img',
                          props: {
                            src: logoUri,
                            width: 40,
                            height: 40,
                            style: { borderRadius: '9px', marginRight: '14px' }
                          }
                        },
                        {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '30px',
                              fontWeight: 700,
                              letterSpacing: '-0.02em',
                              color: '#ffffff'
                            },
                            children: 'GitSetu Docs'
                          }
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              marginLeft: '16px',
                              padding: '5px 13px',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(0, 196, 204, 0.14)',
                              border: '1px solid rgba(0, 196, 204, 0.45)',
                              color: '#00e5ff',
                              fontSize: '18px',
                              fontWeight: 700
                            },
                            children: `v${GITSETU_VERSION}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        padding: '7px 16px',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        color: '#cbd5e1',
                        fontSize: '18px',
                        fontWeight: 700
                      },
                      children: category
                    }
                  }
                ]
              }
            },

            // Middle: Title + Clean Regular-Weight Description (flex-managed, never overlaps footer)
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  marginTop: '12px',
                  marginBottom: '12px'
                },
                children: [
                  {
                    type: 'h1',
                    props: {
                      style: {
                        fontSize: titleFontSize,
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1.12,
                        letterSpacing: '-0.03em',
                        color: '#ffffff',
                        display: 'flex'
                      },
                      children: title
                    }
                  },
                  {
                    type: 'p',
                    props: {
                      style: {
                        fontSize: '25px',
                        fontWeight: 400,
                        color: '#cbd5e1',
                        margin: 0,
                        lineHeight: 1.45,
                        display: 'flex',
                        maxWidth: '960px'
                      },
                      children: description
                    }
                  }
                ]
              }
            },

            // Bottom Footer: Domain + Route Path
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', alignItems: 'center' },
                      children: [
                        {
                          type: 'span',
                          props: {
                            style: {
                              display: 'flex',
                              width: '13px',
                              height: '13px',
                              borderRadius: '999px',
                              backgroundColor: '#00e5ff',
                              marginRight: '12px'
                            }
                          }
                        },
                        {
                          type: 'span',
                          props: {
                            style: {
                              display: 'flex',
                              fontSize: '22px',
                              fontWeight: 700,
                              color: '#00e5ff'
                            },
                            children: 'gitsetu.bhaskarjha.dev'
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: 'span',
                    props: {
                      style: {
                        display: 'flex',
                        fontSize: '18px',
                        fontWeight: 400,
                        color: '#94a3b8'
                      },
                      children: routePath
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  };

  const svg = await satori(markup as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: bold, weight: 700, style: 'normal' },
      { name: 'Inter', data: regular, weight: 400, style: 'normal' }
    ]
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200
    }
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
    }
  });
};
