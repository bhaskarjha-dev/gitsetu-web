import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DOCS_MANIFEST } from '../src/data/docs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_REPO_DIR = path.resolve(__dirname, '../..');
const DOCS_DIR = path.resolve(__dirname, '../src/pages/docs');
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/bhaskarjha-dev/gitsetu/main';

console.log('Syncing v1.1.0 documentation (cross-platform Node.js engine)...');

fs.mkdirSync(DOCS_DIR, { recursive: true });

// Track all expected destination files so ghost files from previous releases are pruned cleanly
const expectedDestPaths = new Set(
  DOCS_MANIFEST.map((doc) => path.resolve(DOCS_DIR, doc.dest))
);

function pruneStaleDocs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pruneStaleDocs(fullPath);
      if (fs.readdirSync(fullPath).length === 0) {
        fs.rmdirSync(fullPath);
      }
    } else if (entry.name.endsWith('.md') && !expectedDestPaths.has(path.resolve(fullPath))) {
      fs.unlinkSync(fullPath);
      console.log(`Pruned stale doc: ${path.relative(DOCS_DIR, fullPath)}`);
    }
  }
}

function escapeYaml(str) {
  return String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function stripExistingFrontmatter(md) {
  if (md.startsWith('---\n')) {
    const endIdx = md.indexOf('\n---\n', 4);
    if (endIdx !== -1) {
      return md.slice(endIdx + 5).replace(/^\n+/, '');
    }
  }
  return md;
}

function transformLinks(md) {
  return md
    // Strip .md extension from relative markdown links (never touch external http(s) URLs)
    .replace(/\]\((?!https?:\/\/)([^)]+?)\.md(#[^)]*)?\)/g, ']($1$2)')
    // Convert relative ../ links into absolute /docs/ routes
    .replace(/\]\(\.\.\//g, '](/docs/');
}

let syncedCount = 0;

for (const { src, dest, title, category, slug, description } of DOCS_MANIFEST) {
  const srcPath = path.join(LOCAL_REPO_DIR, src);
  const destPath = path.join(DOCS_DIR, dest);

  let rawContent = null;

  // 1. Try local filesystem first (local dev / sibling checkout)
  if (fs.existsSync(srcPath)) {
    rawContent = fs.readFileSync(srcPath, 'utf-8');
  } else {
    // 2. Fallback to GitHub raw fetch (CI/CD / Cloudflare Pages)
    const remoteUrl = `${GITHUB_RAW_BASE}/${src}`;
    try {
      console.log(`Fetching from remote: ${remoteUrl}`);
      const headers = process.env.GITHUB_TOKEN
        ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
        : {};
      const res = await fetch(remoteUrl, { headers });
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

  const normalized = stripExistingFrontmatter(rawContent.replace(/\r\n/g, '\n'));

  // Calculate relative depth for DocsLayout.astro
  const depth = (dest.match(/\//g) || []).length;
  let layoutPath = '../../layouts/DocsLayout.astro';
  for (let i = 0; i < depth; i++) {
    layoutPath = `../${layoutPath}`;
  }

  const frontmatter = [
    '---',
    `layout: ${layoutPath}`,
    `title: "${escapeYaml(title)}"`,
    `description: "${escapeYaml(description)}"`,
    `category: "${escapeYaml(category)}"`,
    `slug: "${escapeYaml(slug)}"`,
    '---',
    ''
  ].join('\n');

  const transformed = transformLinks(normalized);

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, frontmatter + transformed, 'utf-8');
  console.log(`Synced ${dest}`);
  syncedCount++;
}

pruneStaleDocs(DOCS_DIR);

console.log(`Documentation sync complete! ${syncedCount} of ${DOCS_MANIFEST.length} documentation pages processed.`);
if (syncedCount < DOCS_MANIFEST.length) {
  process.exitCode = 1;
}
