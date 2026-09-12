import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gitsetu.bhaskarjha.dev',
  build: {
    assets: '_assets'
  },
  redirects: {
    '/docs/overview/introduction': '/docs'
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: false
    }
  }
});
