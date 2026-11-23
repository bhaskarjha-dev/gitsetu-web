import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DOC_CATEGORIES,
  DOCS_MANIFEST,
  GITSETU_REPO,
  GITSETU_SITE,
  GITSETU_VERSION
} from '../src/data/docs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.resolve(__dirname, '../src/pages/docs');
const publicDir = path.resolve(__dirname, '../public');
const indexFile = path.join(publicDir, 'llms.txt');
const fullFile = path.join(publicDir, 'llms-full.txt');

fs.mkdirSync(publicDir, { recursive: true });

// 1. Generate standards-compliant curated index (https://llmstxt.org/)
const indexLines = [
  '# GitSetu',
  '',
  `> GitSetu v${GITSETU_VERSION} is a Bash 3.2-compatible Git multi-identity orchestration engine that compiles directory-scoped and remote-URL includeIf rules, isolated OpenSSH Include configs, native OS HTTPS credential routing, an opt-in fail-closed pre-commit guard, and authenticated v2 backup vaults.`,
  '',
  '## Quick Facts for AI Agents & Tooling',
  '',
  '- **Runtime:** Pure Bash 3.2 core + native Git (`2.36+` for `--remote`) and OpenSSH (`7.3+`). Zero background daemons, zero `git` binary wrappers, zero telemetry.',
  '- **Official v1.1.0 Install Channels:**',
  '  - Linux / macOS / WSL / Git Bash: `curl -fsSL https://github.com/bhaskarjha-dev/gitsetu/releases/latest/download/install.sh | bash` (verifies pinned SHA-256 & byte size + optional `gh` attestation; add `~/.local/bin` to `PATH`).',
  '  - npm (all platforms, Node 18+): `npm install -g gitsetu` (or one-off `npx gitsetu status`).',
  '  - Windows PowerShell & CMD (requires Git for Windows): `git clone https://github.com/bhaskarjha-dev/gitsetu; cd gitsetu; git checkout v1.1.0; powershell -ExecutionPolicy Bypass -File .\\install.ps1` (no blind `irm | iex`).',
  '- **Headless & Machine-Readable Commands:**',
  '  - Inspect state: `gitsetu status --json`, `gitsetu status --porcelain`, `gitsetu doctor --json`, `gitsetu explain [path]`, `gitsetu audit [count]`.',
  '  - Provision profiles: `gitsetu add <label> "<name>" <email> <dir>` or `gitsetu profile add <label> --name="..." --email=... --dir=... [--remote="*org/*"] [--provider-user=...] [--fido2] [--sign=inherit|1|0]`.',
  '  - Ephemeral execution: `gitsetu run <profile> -- <command>`.',
  '- **Important v1.1.0 Accuracy Boundaries (Do Not Recommend Retired v1.0 Patterns):**',
  '  - SSH host aliases use `gitsetu-<label>` (renamed from `github-<label>`).',
  '  - HTTPS credentials delegate to native OS helpers (`osxkeychain`, `libsecret`, Windows GCM) via `credential.https://<host>.username` — the v1.0 custom credential broker was removed.',
  '  - Profile registry (`~/.config/gitsetu/profiles.conf`) uses strict `%HH`-escaped v2 format (`# gitsetu-registry-v2`).',
  '  - Backup vaults use authenticated `GITSETU_VAULT_V2` (PBKDF2-HMAC-SHA256 600k + AES-256-CTR + RFC 2104 HMAC-SHA256); legacy unauthenticated CBC vaults are rejected.',
  '  - Official distribution is GitHub Releases and npm only (legacy Homebrew/Scoop/WinGet/AUR/Nix templates and `update --development` were removed in v1.1.0).',
  `- **Full Documentation Corpus:** [llms-full.txt](${GITSETU_SITE}/llms-full.txt) (all ${DOCS_MANIFEST.length} docs in one Markdown file).`,
  `- **Source Repository:** ${GITSETU_REPO}`,
  ''
];

for (const category of DOC_CATEGORIES) {
  const categoryDocs = DOCS_MANIFEST.filter((doc) => doc.category === category.id);
  if (categoryDocs.length === 0) continue;

  indexLines.push(`## ${category.label}`);
  indexLines.push('');
  for (const doc of categoryDocs) {
    indexLines.push(`- [${doc.title}](${GITSETU_SITE}${doc.href}): ${doc.description}`);
  }
  indexLines.push('');
}

indexLines.push('## Optional');
indexLines.push('');
indexLines.push(`- [Full Documentation Bundle (llms-full.txt)](${GITSETU_SITE}/llms-full.txt): Complete single-file Markdown compilation of all ${DOCS_MANIFEST.length} GitSetu v${GITSETU_VERSION} documentation pages with absolute links.`);
indexLines.push(`- [GitHub Release v${GITSETU_VERSION}](${GITSETU_REPO}/releases/tag/v${GITSETU_VERSION}): Verified release installer, standalone bundle, and checksums.`);
indexLines.push(`- [Search Index JSON](${GITSETU_SITE}/search.json): Structured JSON representation of all ${DOCS_MANIFEST.length} documentation pages.`);
indexLines.push('');

// 2. Generate complete deterministic full-text corpus (llms-full.txt)
const fullParts = [
  `# GitSetu v${GITSETU_VERSION} — Complete Documentation Corpus`,
  '',
  `> Generated from canonical GitSetu documentation for AI agents and offline context ingestion. Curated index: ${GITSETU_SITE}/llms.txt`,
  '',
  `Homepage: ${GITSETU_SITE}`,
  `Repository: ${GITSETU_REPO}`,
  `Version: ${GITSETU_VERSION}`,
  ''
];

for (const doc of DOCS_MANIFEST) {
  const fullPath = path.join(docsDir, doc.dest);
  if (!fs.existsSync(fullPath)) continue;

  const rawContent = fs.readFileSync(fullPath, 'utf-8');
  const body = rawContent
    .replace(/^---\n[\s\S]*?\n---\n+/, '')
    // Convert root-relative /docs links to absolute URLs so standalone consumers can resolve every link
    .replace(/\]\((\/docs[^)]*)\)/g, `](${GITSETU_SITE}$1)`)
    .trim();

  fullParts.push(`--- START OF FILE: ${doc.dest} (${GITSETU_SITE}${doc.href}) ---`);
  fullParts.push('');
  fullParts.push(body);
  fullParts.push('');
  fullParts.push(`--- END OF FILE: ${doc.dest} ---`);
  fullParts.push('');
}

try {
  fs.writeFileSync(indexFile, indexLines.join('\n'), 'utf-8');
  fs.writeFileSync(fullFile, fullParts.join('\n'), 'utf-8');
  console.log(`[Agentic SEO] Generated ${indexFile} and ${fullFile} (${DOCS_MANIFEST.length} docs).`);
} catch (error) {
  console.error('[Agentic SEO] Error generating llms.txt files:', error);
  process.exitCode = 1;
}
