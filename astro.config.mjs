import { defineConfig } from 'astro/config';
import remarkGithubAlerts from './src/utils/remark-github-alerts.mjs';

export default defineConfig({
  site: 'https://gitsetu.bhaskarjha.dev',
  build: {
    assets: '_assets'
  },
  redirects: {
    '/docs/overview/introduction': '/docs',
    '/docs/core-engines/credential-broker': '/docs/core-engines/https-credentials'
  },
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
    shikiConfig: {
      theme: 'github-dark',
      wrap: false
    }
  }
});
