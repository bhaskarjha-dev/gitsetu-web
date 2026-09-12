import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_REPO_DIR = path.resolve(__dirname, '../..');
const DOCS_DIR = path.resolve(__dirname, '../src/pages/docs');
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/bhaskarjha-dev/gitsetu/main';

console.log('Syncing documentation (cross-platform Node.js engine)...');

// Ensure docs directory exists
fs.mkdirSync(DOCS_DIR, { recursive: true });

const docsMapping = [
  // 1. Platform Overview
  {
    src: 'docs/overview/introduction.md',
    dest: 'index.md',
    title: 'Introduction',
    category: 'overview',
    slug: 'index',
    description: 'Zero-dependency Git multi-identity orchestration and automated SSH profile switching for modern developer workflows.'
  },
  {
    src: 'docs/overview/architecture.md',
    dest: 'overview/architecture.md',
    title: 'Architecture',
    category: 'overview',
    slug: 'overview/architecture',
    description: 'Internal mechanics, modular compilation patterns, and zero-trust execution flows of GitSetu.'
  },
  {
    src: 'docs/overview/comparisons.md',
    dest: 'overview/comparisons.md',
    title: 'Ecosystem Comparisons',
    category: 'overview',
    slug: 'overview/comparisons',
    description: 'Comparative evaluation of GitSetu versus manual SSH configs, direnv, and alternative Git identity managers.'
  },
  {
    src: 'docs/overview/manifesto.md',
    dest: 'overview/manifesto.md',
    title: 'Design Manifesto',
    category: 'overview',
    slug: 'overview/manifesto',
    description: 'Core engineering principles prioritizing zero dependencies, POSIX compliance, and atomic safety.'
  },

  // 2. Getting Started
  {
    src: 'docs/getting-started/introduction.md',
    dest: 'getting-started/introduction.md',
    title: 'Getting Started',
    category: 'getting-started',
    slug: 'getting-started/introduction',
    description: 'Onboarding guide covering prerequisites, system requirements, and foundational GitSetu setup.'
  },
  {
    src: 'docs/getting-started/installation.md',
    dest: 'getting-started/installation.md',
    title: 'Installation',
    category: 'getting-started',
    slug: 'getting-started/installation',
    description: 'Installation guides across 9 distribution channels including Homebrew, WinGet, Scoop, AUR, Nix, and native scripts.'
  },
  {
    src: 'docs/getting-started/quickstart.md',
    dest: 'getting-started/quickstart.md',
    title: 'Quickstart',
    category: 'getting-started',
    slug: 'getting-started/quickstart',
    description: 'Fast-track tutorial to configure your personal and work Git profiles in under three minutes.'
  },

  // 3. Core Engines
  {
    src: 'docs/core-engines/identity-routing.md',
    dest: 'core-engines/identity-routing.md',
    title: 'Identity Routing',
    category: 'core-engines',
    slug: 'core-engines/identity-routing',
    description: 'Hierarchical includeIf routing engine mapping repository working directories to isolated Git identities.'
  },
  {
    src: 'docs/core-engines/ssh-orchestrator.md',
    dest: 'core-engines/ssh-orchestrator.md',
    title: 'SSH Orchestrator',
    category: 'core-engines',
    slug: 'core-engines/ssh-orchestrator',
    description: 'Automated OpenSSH key generation, ~/.ssh/config profile management, and multi-host multiplexing.'
  },
  {
    src: 'docs/core-engines/credential-broker.md',
    dest: 'core-engines/credential-broker.md',
    title: 'Credential Broker',
    category: 'core-engines',
    slug: 'core-engines/credential-broker',
    description: 'OS keychain integration and encrypted credential vault storing personal access tokens securely.'
  },
  {
    src: 'docs/core-engines/precommit-guard.md',
    dest: 'core-engines/precommit-guard.md',
    title: 'Pre-Commit Guard',
    category: 'core-engines',
    slug: 'core-engines/precommit-guard',
    description: 'Deterministic pre-commit hook preventing cross-identity commit pollution and secret leakage.'
  },

  // 4. Guides
  {
    src: 'docs/guides/shell-prompt.md',
    dest: 'guides/shell-prompt.md',
    title: 'Shell Prompt Integration',
    category: 'guides',
    slug: 'guides/shell-prompt',
    description: 'Dynamic prompt modules for Bash, Zsh, Starship, and Fish displaying the active Git identity.'
  },
  {
    src: 'docs/guides/hardware-keys.md',
    dest: 'guides/hardware-keys.md',
    title: 'Hardware Keys (FIDO2)',
    category: 'guides',
    slug: 'guides/hardware-keys',
    description: 'Configuration guide for FIDO2/WebAuthn hardware security keys and resident SSH credentials.'
  },
  {
    src: 'docs/guides/wsl-integration.md',
    dest: 'guides/wsl-integration.md',
    title: 'WSL Integration',
    category: 'guides',
    slug: 'guides/wsl-integration',
    description: 'Seamless Windows Subsystem for Linux (WSL) interoperability with Windows credential managers.'
  },
  {
    src: 'docs/guides/vault-backups.md',
    dest: 'guides/vault-backups.md',
    title: 'Vault Backups',
    category: 'guides',
    slug: 'guides/vault-backups',
    description: 'Encrypted profile backup, restoration, and cryptographic verification procedures.'
  },

  // 5. Enterprise & Vision
  {
    src: 'docs/enterprise/security-privacy.md',
    dest: 'enterprise/security-privacy.md',
    title: 'Security & Privacy',
    category: 'enterprise',
    slug: 'enterprise/security-privacy',
    description: 'Threat model, air-gapped deployment guarantees, zero-telemetry policy, and audit trail specifications.'
  },
  {
    src: 'docs/enterprise/product-roadmap.md',
    dest: 'enterprise/product-roadmap.md',
    title: 'Product Roadmap',
    category: 'enterprise',
    slug: 'enterprise/product-roadmap',
    description: 'Strategic milestones, protocol enhancements, and enterprise roadmap for GitSetu.'
  },

  // 6. Reference & Support
  {
    src: 'docs/reference/cli-commands.md',
    dest: 'reference/cli-commands.md',
    title: 'CLI Commands',
    category: 'reference',
    slug: 'reference/cli-commands',
    description: 'Exhaustive CLI command reference documenting all flags, subcommands, and exit codes.'
  },
  {
    src: 'docs/reference/troubleshooting.md',
    dest: 'reference/troubleshooting.md',
    title: 'Troubleshooting',
    category: 'reference',
    slug: 'reference/troubleshooting',
    description: 'Diagnostic workflows and solutions for SSH permission errors, keychain locks, and hook conflicts.'
  },
  {
    src: 'docs/reference/faq.md',
    dest: 'reference/faq.md',
    title: 'FAQ',
    category: 'reference',
    slug: 'reference/faq',
    description: 'Frequently asked questions regarding security, compatibility, key rotation, and performance.'
  },
  {
    src: 'docs/MANUAL_QA.md',
    dest: 'reference/manual-qa.md',
    title: 'Manual QA Playbook',
    category: 'reference',
    slug: 'reference/manual-qa',
    description: 'Step-by-step manual quality assurance test scenarios and cross-platform verification matrices.'
  },
  {
    src: 'CONTRIBUTING.md',
    dest: 'reference/contributing.md',
    title: 'Contributing Guide',
    category: 'reference',
    slug: 'reference/contributing',
    description: 'Developer guidelines, coding conventions, test execution, and pull request workflows.'
  },

  // 7. Architecture Decisions (ADR)
  {
    src: 'docs/adr/0001-dual-ssh-routing-strategy.md',
    dest: 'adr/0001-dual-ssh-routing-strategy.md',
    title: 'ADR 0001: Dual SSH Routing',
    category: 'adr',
    slug: 'adr/0001-dual-ssh-routing-strategy',
    description: 'Architectural Decision Record: Dual SSH key routing via Match blocks versus include directives.'
  },
  {
    src: 'docs/adr/0002-ssh-config-include-directive.md',
    dest: 'adr/0002-ssh-config-include-directive.md',
    title: 'ADR 0002: OpenSSH Include Pivot',
    category: 'adr',
    slug: 'adr/0002-ssh-config-include-directive',
    description: 'Architectural Decision Record: Standardizing on modular Include ~/.config/gitsetu/profiles/ssh_config.'
  }
];

let syncedCount = 0;

for (const { src, dest, title, category, slug, description } of docsMapping) {
  const srcPath = path.join(LOCAL_REPO_DIR, src);
  const destPath = path.join(DOCS_DIR, dest);

  let rawContent = null;

  // 1. Try local filesystem first (local dev)
  if (fs.existsSync(srcPath)) {
    rawContent = fs.readFileSync(srcPath, 'utf-8');
  } else {
    // 2. Fallback to GitHub raw fetch (CI/CD / Cloudflare Pages)
    const remoteUrl = `${GITHUB_RAW_BASE}/${src}`;
    try {
      console.log(`Fetching from remote: ${remoteUrl}`);
      const res = await fetch(remoteUrl);
      if (res.ok) {
        rawContent = await res.text();
      } else {
        console.warn(`Remote fetch returned ${res.status} for ${remoteUrl}`);
      }
    } catch (err) {
      console.warn(`Failed remote fetch for ${remoteUrl}:`, err.message);
    }
  }

  // 3. If neither local nor remote is available, preserve existing file if present
  if (!rawContent) {
    if (fs.existsSync(destPath)) {
      console.log(`Preserving existing ${dest}`);
      syncedCount++;
      continue;
    } else {
      console.error(`Error: Could not retrieve source for ${dest} (${src})`);
      continue;
    }
  }

  let content = rawContent.replace(/\r\n/g, '\n');

  // Calculate relative depth for DocsLayout.astro
  const depth = (dest.match(/\//g) || []).length;
  let layoutPath = '../../layouts/DocsLayout.astro';
  for (let i = 0; i < depth; i++) {
    layoutPath = `../${layoutPath}`;
  }

  // Prepend Astro frontmatter with rich metadata
  const frontmatter = `---\nlayout: ${layoutPath}\ntitle: "${title}"\ndescription: "${description}"\ncategory: "${category}"\nslug: "${slug}"\n---\n`;

  // Transform markdown links: strip .md extensions and convert ../ to /docs/
  const transformed = content
    .replace(/\]\(([^)]+)\.md(#.*?)?\)/g, '](\$1\$2)')
    .replace(/\]\(\.\.\//g, '](/docs/');

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, frontmatter + transformed, 'utf-8');
  console.log(`Synced ${dest}`);
  syncedCount++;
}

console.log(`Documentation sync complete! ${syncedCount} of ${docsMapping.length} documentation pages successfully processed.`);
if (syncedCount < docsMapping.length) {
  process.exitCode = 1;
}
