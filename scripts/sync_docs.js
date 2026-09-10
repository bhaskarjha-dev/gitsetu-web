import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_REPO_DIR = path.resolve(__dirname, '../..');
const DOCS_DIR = path.resolve(__dirname, '../src/pages/docs');

console.log('Syncing documentation (cross-platform Node.js engine)...');

// Clear existing docs
if (fs.existsSync(DOCS_DIR)) {
  fs.rmSync(DOCS_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DOCS_DIR, { recursive: true });

const docsMapping = [
  // 1. Platform Overview
  { src: 'docs/overview/introduction.md', dest: 'index.md', title: 'Introduction' },
  { src: 'docs/overview/architecture.md', dest: 'overview/architecture.md', title: 'Architecture' },
  { src: 'docs/overview/comparisons.md', dest: 'overview/comparisons.md', title: 'Ecosystem Comparisons' },
  { src: 'docs/overview/manifesto.md', dest: 'overview/manifesto.md', title: 'Design Manifesto' },

  // 2. Getting Started
  { src: 'docs/getting-started/introduction.md', dest: 'getting-started/introduction.md', title: 'Getting Started' },
  { src: 'docs/getting-started/installation.md', dest: 'getting-started/installation.md', title: 'Installation' },
  { src: 'docs/getting-started/quickstart.md', dest: 'getting-started/quickstart.md', title: 'Quickstart' },

  // 3. Core Engines
  { src: 'docs/core-engines/identity-routing.md', dest: 'core-engines/identity-routing.md', title: 'Identity Routing' },
  { src: 'docs/core-engines/ssh-orchestrator.md', dest: 'core-engines/ssh-orchestrator.md', title: 'SSH Orchestrator' },
  { src: 'docs/core-engines/credential-broker.md', dest: 'core-engines/credential-broker.md', title: 'Credential Broker' },
  { src: 'docs/core-engines/precommit-guard.md', dest: 'core-engines/precommit-guard.md', title: 'Pre-Commit Guard' },

  // 4. Guides
  { src: 'docs/guides/shell-prompt.md', dest: 'guides/shell-prompt.md', title: 'Shell Prompt Integration' },
  { src: 'docs/guides/hardware-keys.md', dest: 'guides/hardware-keys.md', title: 'Hardware Keys (FIDO2)' },
  { src: 'docs/guides/wsl-integration.md', dest: 'guides/wsl-integration.md', title: 'WSL Integration' },
  { src: 'docs/guides/vault-backups.md', dest: 'guides/vault-backups.md', title: 'Vault Backups' },

  // 5. Enterprise & Vision
  { src: 'docs/enterprise/security-privacy.md', dest: 'enterprise/security-privacy.md', title: 'Security & Privacy' },
  { src: 'docs/enterprise/product-roadmap.md', dest: 'enterprise/product-roadmap.md', title: 'Product Roadmap' },

  // 6. Architecture Decisions (ADR)
  { src: 'docs/adr/0001-dual-ssh-routing-strategy.md', dest: 'adr/0001-dual-ssh-routing-strategy.md', title: 'ADR 0001: Dual SSH Routing' },
  { src: 'docs/adr/0002-ssh-config-include-directive.md', dest: 'adr/0002-ssh-config-include-directive.md', title: 'ADR 0002: OpenSSH Include Pivot' },

  // 7. Reference & Support
  { src: 'docs/reference/cli-commands.md', dest: 'reference/cli-commands.md', title: 'CLI Commands' },
  { src: 'docs/reference/troubleshooting.md', dest: 'reference/troubleshooting.md', title: 'Troubleshooting' },
  { src: 'docs/reference/faq.md', dest: 'reference/faq.md', title: 'FAQ' },
  { src: 'docs/MANUAL_QA.md', dest: 'reference/manual-qa.md', title: 'Manual QA Playbook' },
  { src: 'CONTRIBUTING.md', dest: 'reference/contributing.md', title: 'Contributing Guide' }
];

for (const { src, dest, title } of docsMapping) {
  const srcPath = path.join(LOCAL_REPO_DIR, src);
  const destPath = path.join(DOCS_DIR, dest);

  if (!fs.existsSync(srcPath)) {
    console.warn(`Warning: Missing source file ${srcPath}`);
    continue;
  }

  let content = fs.readFileSync(srcPath, 'utf-8');
  content = content.replace(/\r\n/g, '\n');

  // Calculate relative depth for DocsLayout.astro
  const depth = (dest.match(/\//g) || []).length;
  let layoutPath = '../../layouts/DocsLayout.astro';
  for (let i = 0; i < depth; i++) {
    layoutPath = `../${layoutPath}`;
  }

  // Prepend Astro frontmatter
  const frontmatter = `---\nlayout: ${layoutPath}\ntitle: "${title}"\n---\n`;

  // Transform markdown links: strip .md extensions and convert ../ to /docs/
  const transformed = content
    .replace(/\]\(([^)]+)\.md(#.*?)?\)/g, '](\$1\$2)')
    .replace(/\]\(\.\.\//g, '](/docs/');

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, frontmatter + transformed, 'utf-8');
  console.log(`Synced ${dest}`);
}

console.log('Documentation sync complete! 25 documentation pages successfully processed.');
