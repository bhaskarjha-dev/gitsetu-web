export const GITSETU_VERSION = '1.1.0';
export const GITSETU_REPO = 'https://github.com/bhaskarjha-dev/gitsetu';
export const GITSETU_SITE = 'https://gitsetu.bhaskarjha.dev';

export const DOC_CATEGORIES = [
  { id: 'overview', label: 'Platform Overview' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'core-engines', label: 'Core Engines' },
  { id: 'guides', label: 'Guides' },
  { id: 'enterprise', label: 'Security & Roadmap' },
  { id: 'reference', label: 'Reference & Support' },
  { id: 'adr', label: 'Architecture Decisions (ADR)' }
];

export const DOCS_MANIFEST = [
  // 1. Platform Overview
  {
    src: 'docs/overview/introduction.md',
    dest: 'index.md',
    href: '/docs',
    title: 'Introduction',
    sidebarTitle: 'Introduction',
    category: 'overview',
    slug: 'index',
    description: 'Bash 3.2-compatible Git multi-identity orchestration engine for directory-scoped configs, isolated SSH keys, and native credential routing.',
    keywords: 'gitsetu overview introduction multi-identity bash git ssh'
  },
  {
    src: 'docs/overview/architecture.md',
    dest: 'overview/architecture.md',
    href: '/docs/overview/architecture',
    title: 'Architecture',
    sidebarTitle: 'Architecture',
    category: 'overview',
    slug: 'overview/architecture',
    description: 'Compiler-style architecture, strict v2 registry, atomic directory locking, and native Git/OpenSSH execution flows.',
    keywords: 'architecture compiler registry v2 atomic locking profiles.lock modular'
  },
  {
    src: 'docs/overview/comparisons.md',
    dest: 'overview/comparisons.md',
    href: '/docs/overview/comparisons',
    title: 'How GitSetu Compares',
    sidebarTitle: 'How GitSetu Compares',
    category: 'overview',
    slug: 'overview/comparisons',
    description: 'Objective comparison of generated native Git config versus hand-written configs, on-demand switchers, and shell hooks like direnv.',
    keywords: 'comparison approaches direnv manual includeIf switch on demand git-ego gitch karn gguser tradeoffs'
  },
  {
    src: 'docs/overview/manifesto.md',
    dest: 'overview/manifesto.md',
    href: '/docs/overview/manifesto',
    title: 'Design Manifesto',
    sidebarTitle: 'Design Manifesto',
    category: 'overview',
    slug: 'overview/manifesto',
    description: 'Core engineering principles: Bash 3.2 portability, managed-file boundaries, atomic writes, and honest security limits.',
    keywords: 'manifesto philosophy principles bash 3.2 posix atomic managed-file safety'
  },

  // 2. Getting Started
  {
    src: 'docs/getting-started/introduction.md',
    dest: 'getting-started/introduction.md',
    href: '/docs/getting-started/introduction',
    title: 'Getting Started',
    sidebarTitle: 'Getting Started',
    category: 'getting-started',
    slug: 'getting-started/introduction',
    description: 'Onboarding overview covering prerequisites, supported operating systems, and how GitSetu organizes managed state.',
    keywords: 'prerequisites system requirements onboarding macos linux wsl windows'
  },
  {
    src: 'docs/getting-started/installation.md',
    dest: 'getting-started/installation.md',
    href: '/docs/getting-started/installation',
    title: 'Installation',
    sidebarTitle: 'Installation',
    category: 'getting-started',
    slug: 'getting-started/installation',
    description: 'Verified v1.1.0 installation via GitHub Releases (SHA-256 + attestation), npm/npx, Windows PowerShell/CMD checkout, and source builds.',
    keywords: 'install github releases sha256 attestation npm npx powershell cmd git for windows install.sh install.ps1 upgrade uninstall'
  },
  {
    src: 'docs/getting-started/quickstart.md',
    dest: 'getting-started/quickstart.md',
    href: '/docs/getting-started/quickstart',
    title: 'Quickstart',
    sidebarTitle: 'Quickstart',
    category: 'getting-started',
    slug: 'getting-started/quickstart',
    description: 'Configure your personal and work Git identities, isolated SSH keys, and optional pre-commit guard in minutes.',
    keywords: 'quickstart setup init first profile work personal tutorial onboarding guided wizard'
  },

  // 3. Core Engines
  {
    src: 'docs/core-engines/identity-routing.md',
    dest: 'core-engines/identity-routing.md',
    href: '/docs/core-engines/identity-routing',
    title: 'Identity Routing',
    sidebarTitle: 'Identity Routing',
    category: 'core-engines',
    slug: 'core-engines/identity-routing',
    description: 'Directory-scoped includeIf (gitdir/gitdir/i) and remote-URL routing (hasconfig:remote.*.url) with longest-prefix precedence.',
    keywords: 'includeIf conditional routing gitdir gitdir/i hasconfig remote url longest-prefix case-insensitive windows macos coexistence'
  },
  {
    src: 'docs/core-engines/ssh-orchestrator.md',
    dest: 'core-engines/ssh-orchestrator.md',
    href: '/docs/core-engines/ssh-orchestrator',
    title: 'SSH Orchestrator',
    sidebarTitle: 'SSH Orchestrator',
    category: 'core-engines',
    slug: 'core-engines/ssh-orchestrator',
    description: 'Per-profile Ed25519/FIDO2 key generation, OpenSSH Include isolation, gitsetu-<label> host aliases, and IdentitiesOnly enforcement.',
    keywords: 'ssh config include ed25519 identityfile identitiesonly gitsetu alias host quoting adr 0001 adr 0002'
  },
  {
    src: 'docs/core-engines/https-credentials.md',
    dest: 'core-engines/https-credentials.md',
    href: '/docs/core-engines/https-credentials',
    title: 'HTTPS Credentials',
    sidebarTitle: 'HTTPS Credentials',
    category: 'core-engines',
    slug: 'core-engines/https-credentials',
    description: 'Native HTTPS credential delegation via per-profile credential.https://<host>.username for macOS Keychain, Linux Secret Service, and Windows GCM.',
    keywords: 'https credentials credential helper osxkeychain libsecret gcm git credential manager username routing compatibility shim pat token'
  },
  {
    src: 'docs/core-engines/precommit-guard.md',
    dest: 'core-engines/precommit-guard.md',
    href: '/docs/core-engines/precommit-guard',
    title: 'Pre-Commit Guard',
    sidebarTitle: 'Pre-Commit Guard',
    category: 'core-engines',
    slug: 'core-engines/precommit-guard',
    description: 'Opt-in client-side pre-commit guard that fails closed on identity mismatches in managed repos while preserving project hooks.',
    keywords: 'pre-commit hook guard fail closed email mismatch author committer core.hooksPath opt-in gitsetu guard'
  },

  // 4. Guides
  {
    src: 'docs/guides/shell-prompt.md',
    dest: 'guides/shell-prompt.md',
    href: '/docs/guides/shell-prompt',
    title: 'Shell Prompt Integration',
    sidebarTitle: 'Shell Prompt Integration',
    category: 'guides',
    slug: 'guides/shell-prompt',
    description: 'Surface your active GitSetu profile directly in Bash, Zsh, Oh-My-Zsh, and Starship prompts using gitsetu prompt.',
    keywords: 'starship oh-my-zsh bash zsh ps1 prompt integration active profile'
  },
  {
    src: 'docs/guides/hardware-keys.md',
    dest: 'guides/hardware-keys.md',
    href: '/docs/guides/hardware-keys',
    title: 'Hardware Keys (FIDO2)',
    sidebarTitle: 'Hardware Keys (FIDO2)',
    category: 'guides',
    slug: 'guides/hardware-keys',
    description: 'Provisioning resident FIDO2/WebAuthn SSH keys (ed25519-sk) for YubiKey and compatible security tokens with no silent downgrade.',
    keywords: 'yubikey fido2 webauthn ed25519-sk hardware security key resident touch verification libfido2'
  },
  {
    src: 'docs/guides/wsl-integration.md',
    dest: 'guides/wsl-integration.md',
    href: '/docs/guides/wsl-integration',
    title: 'WSL Integration',
    sidebarTitle: 'WSL Integration',
    category: 'guides',
    slug: 'guides/wsl-integration',
    description: 'Running GitSetu inside Windows Subsystem for Linux (WSL) with cross-boundary paths and Windows Git Credential Manager.',
    keywords: 'wsl wsl2 windows subsystem linux mnt gcm git-credential-manager.exe'
  },
  {
    src: 'docs/guides/vault-backups.md',
    dest: 'guides/vault-backups.md',
    href: '/docs/guides/vault-backups',
    title: 'Vault Backups (v2)',
    sidebarTitle: 'Vault Backups (v2)',
    category: 'guides',
    slug: 'guides/vault-backups',
    description: 'Authenticated v2 encrypted vaults (PBKDF2-HMAC-SHA256 600k, AES-256-CTR, HMAC-SHA256) with transactional restore and rollback.',
    keywords: 'vault backup restore v2 pbkdf2 aes-256-ctr hmac-sha256 encrypt-then-mac openssl migration transactional rollback force'
  },
  {
    src: 'docs/ai/SKILL.md',
    dest: 'guides/ai-agents.md',
    href: '/docs/guides/ai-agents',
    title: 'AI Agent Skill',
    sidebarTitle: 'AI Agent Skill',
    category: 'guides',
    slug: 'guides/ai-agents',
    description: 'Structured skill guide for AI coding agents to provision profiles headlessly, trace identity origins, and respect guard policies.',
    keywords: 'ai agent skill llm automation headless non-interactive explain status porcelain run'
  },

  // 5. Security & Roadmap
  {
    src: 'docs/enterprise/security-privacy.md',
    dest: 'enterprise/security-privacy.md',
    href: '/docs/enterprise/security-privacy',
    title: 'Security & Privacy',
    sidebarTitle: 'Security & Privacy',
    category: 'enterprise',
    slug: 'enterprise/security-privacy',
    description: 'Explicit threat model, local-first zero-telemetry design, authenticated vault cryptography, and honest client-side boundaries.',
    keywords: 'security privacy threat model zero telemetry cryptography symlink protection permissions lock'
  },
  {
    src: 'SECURITY.md',
    dest: 'enterprise/security-policy.md',
    href: '/docs/enterprise/security-policy',
    title: 'Security Policy',
    sidebarTitle: 'Security Policy',
    category: 'enterprise',
    slug: 'enterprise/security-policy',
    description: 'Supported v1.1.0 release channels, cryptographic artifact verification guidance, and private vulnerability disclosure policy.',
    keywords: 'security policy vulnerability disclosure reporting advisory supported versions security@bhaskarjha.dev'
  },
  {
    src: 'docs/enterprise/product-roadmap.md',
    dest: 'enterprise/product-roadmap.md',
    href: '/docs/enterprise/product-roadmap',
    title: 'Product Roadmap',
    sidebarTitle: 'Product Roadmap',
    category: 'enterprise',
    slug: 'enterprise/product-roadmap',
    description: 'Shipped v1.1.0 milestones and upcoming v1.2.0 plans including external SSH agents, gitsetu clone, and community package managers.',
    keywords: 'roadmap v1.1.0 v1.2.0 future 1password secretive clone homebrew scoop winget aur nix'
  },

  // 6. Reference & Support
  {
    src: 'docs/reference/cli-commands.md',
    dest: 'reference/cli-commands.md',
    href: '/docs/reference/cli-commands',
    title: 'CLI Commands',
    sidebarTitle: 'CLI Commands',
    category: 'reference',
    slug: 'reference/cli-commands',
    description: 'Complete CLI command reference covering setup, add, profile, status, explain, audit, import, doctor, verify, guard, backup, restore, and teardown.',
    keywords: 'cli commands flags setup add profile status json porcelain explain audit import doctor repair verify network guard backup restore run prompt teardown'
  },
  {
    src: 'CHANGELOG.md',
    dest: 'reference/changelog.md',
    href: '/docs/reference/changelog',
    title: 'Changelog (v1.1.0)',
    sidebarTitle: 'Changelog (v1.1.0)',
    category: 'reference',
    slug: 'reference/changelog',
    description: 'Release notes, breaking changes, and upgrade history for GitSetu v1.1.0 and v1.0.0.',
    keywords: 'changelog release notes v1.1.0 v1.0.0 breaking changes migration upgrade history'
  },
  {
    src: 'docs/reference/troubleshooting.md',
    dest: 'reference/troubleshooting.md',
    href: '/docs/reference/troubleshooting',
    title: 'Troubleshooting',
    sidebarTitle: 'Troubleshooting',
    category: 'reference',
    slug: 'reference/troubleshooting',
    description: 'Resolving OpenSSH authentication collisions, pre-commit guard blocks, includeIf matching issues, and Windows NTFS permissions.',
    keywords: 'troubleshooting debug doctor permission denied publickey guard blocking includeIf ntfs 644 teardown'
  },
  {
    src: 'docs/reference/faq.md',
    dest: 'reference/faq.md',
    href: '/docs/reference/faq',
    title: 'FAQ',
    sidebarTitle: 'FAQ',
    category: 'reference',
    slug: 'reference/faq',
    description: 'Answers on runtime dependencies, coexistence with manual includeIf setups, HTTPS credentials, Windows support, and nested folders.',
    keywords: 'faq questions manual includeIf coexistence backups useConfigOnly git for windows nested folders'
  },
  {
    src: 'docs/reference/manual-qa.md',
    dest: 'reference/manual-qa.md',
    href: '/docs/reference/manual-qa',
    title: 'Manual QA Playbook',
    sidebarTitle: 'Manual QA Playbook',
    category: 'reference',
    slug: 'reference/manual-qa',
    description: 'Step-by-step v1.1.0 verification checklist covering POSIX, macOS, WSL, Windows PowerShell/CMD, vaults, and release gates.',
    keywords: 'manual qa playbook testing checklist verification release gate cross-platform'
  },
  {
    src: 'CONTRIBUTING.md',
    dest: 'reference/contributing.md',
    href: '/docs/reference/contributing',
    title: 'Contributing Guide',
    sidebarTitle: 'Contributing Guide',
    category: 'reference',
    slug: 'reference/contributing',
    description: 'Engineering guidelines for Bash 3.2 compatibility, atomic file writes, zero-telemetry invariants, testing, and pull requests.',
    keywords: 'contributing pull request bash 3.2 shellcheck make test lint atomic'
  },

  // 7. Architecture Decisions (ADR)
  {
    src: 'docs/adr/0001-dual-ssh-routing-strategy.md',
    dest: 'adr/0001-dual-ssh-routing-strategy.md',
    href: '/docs/adr/0001-dual-ssh-routing-strategy',
    title: 'ADR 0001: Dual SSH Routing',
    sidebarTitle: 'ADR 0001: Dual SSH Routing',
    category: 'adr',
    slug: 'adr/0001-dual-ssh-routing-strategy',
    description: 'Architectural Decision Record: Combining directory-scoped core.sshCommand with gitsetu-<label> OpenSSH host aliases.',
    keywords: 'adr 0001 dual ssh routing core.sshCommand gitsetu alias'
  },
  {
    src: 'docs/adr/0002-ssh-config-include-directive.md',
    dest: 'adr/0002-ssh-config-include-directive.md',
    href: '/docs/adr/0002-ssh-config-include-directive',
    title: 'ADR 0002: OpenSSH Include Pivot',
    sidebarTitle: 'ADR 0002: OpenSSH Include Pivot',
    category: 'adr',
    slug: 'adr/0002-ssh-config-include-directive',
    description: 'Architectural Decision Record: Isolating managed SSH host entries behind a single Include directive in ~/.ssh/config.',
    keywords: 'adr 0002 openssh include directive ssh_config isolation'
  },
  {
    src: 'docs/adr/0003-fut03-codebase-consolidation-architecture.md',
    dest: 'adr/0003-fut03-codebase-consolidation-architecture.md',
    href: '/docs/adr/0003-fut03-codebase-consolidation-architecture',
    title: 'ADR 0003: Core Consolidation',
    sidebarTitle: 'ADR 0003: Core Consolidation',
    category: 'adr',
    slug: 'adr/0003-fut03-codebase-consolidation-architecture',
    description: 'Architectural Decision Record: Safe v1.2.0 deduplication plan preserving security invariants, Bash 3.2 compatibility, and module clarity.',
    keywords: 'adr 0003 fut-03 consolidation architecture v1.2.0 deduplication bash modules'
  }
];

export function getCategoryLabel(categoryId) {
  const found = DOC_CATEGORIES.find((c) => c.id === categoryId);
  if (found) return found.label;
  return categoryId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getDocByHref(pathname) {
  const norm = '/' + String(pathname || '').replace(/^\/|\/$/g, '');
  const canonical = norm === '/docs/index' || norm === '/docs/overview/introduction' ? '/docs' : norm;
  return DOCS_MANIFEST.find((doc) => doc.href === canonical) || null;
}
