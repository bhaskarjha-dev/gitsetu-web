<div align="center">

<img src="public/logo.png" alt="GitSetu" width="96" />

# GitSetu — Official Website & Docs Portal

**The static marketing site, interactive CLI sandbox, and 28-page documentation engine for [GitSetu v1.1.0](https://github.com/bhaskarjha-dev/gitsetu).**

[![Live Portal](https://img.shields.io/badge/live-gitsetu.bhaskarjha.dev-00c4cc?style=flat)](https://gitsetu.bhaskarjha.dev)
[![GitSetu Release](https://img.shields.io/badge/gitsetu-v1.1.0-10b981?style=flat)](https://github.com/bhaskarjha-dev/gitsetu/releases/tag/v1.1.0)
[![Astro v6](https://img.shields.io/badge/Astro-v6%20SSG-ff5d01?logo=astro&logoColor=white)](https://astro.build/)
[![Vanilla CSS](https://img.shields.io/badge/CSS-Vanilla%20Tokens-0ea5e9)](#design-system--guardrails)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

<br/>

<a href="https://gitsetu.bhaskarjha.dev">
  <img src="public/og-image.png" alt="GitSetu v1.1.0 — One command. All identities. Every single machine." width="760" />
</a>

<br/>

[Live Site](https://gitsetu.bhaskarjha.dev) · [Quick Start](#quick-start) · [What Powers the Portal](#what-powers-the-portal) · [Docs SSOT Pipeline](#docs-single-source-of-truth-pipeline) · [Routes & Endpoints](#routes--machine-endpoints) · [Deployment](#deployment-cloudflare-pages) · [Contributing](#design-system--guardrails)

</div>

> [!NOTE]
> **Looking for the GitSetu CLI itself?** Head to [**bhaskarjha-dev/gitsetu**](https://github.com/bhaskarjha-dev/gitsetu) or visit [**gitsetu.bhaskarjha.dev**](https://gitsetu.bhaskarjha.dev) for verified installation instructions, quickstart guides, and releases. This repository powers the website and documentation portal.

---

## Quick Start

Requires **Node.js 18+**.

```bash
# 1. Install dependencies
npm install

# 2. Sync all 28 docs + generate llms*.txt + start local dev server
npm run dev

# 3. Sync docs & compile full production static bundle into dist/
npm run build

# 4. Preview the compiled production bundle locally
npm run preview
```

To run only the documentation sync & LLM corpus generators without starting Astro:

```bash
npm run sync-docs
```

---

## What Powers the Portal

Built to match the philosophy of GitSetu itself: **zero bloated runtime frameworks, instant static delivery, and faithful CLI representation.**

| Layer | Implementation | Why It Matters |
| :--- | :--- | :--- |
| **Static Core & Routing** | [Astro v6](https://astro.build/) SSG + `ClientRouter` View Transitions | Sub-second HTML delivery with smooth SPA-like navigation and zero React/Vue runtime overhead. |
| **Design System & Typography** | Vanilla CSS tokens ([`global.css`](src/styles/global.css)) + self-hosted `Noto Sans Devanagari` | Zero CSS framework bloat, WCAG 2.2 AA contrast, `prefers-reduced-motion` support, and crisp Devanagari (`सेतु`) rendering across every OS. |
| **Interactive Terminal Sandbox** | [`@xterm/xterm`](https://xtermjs.org/) + `@xterm/addon-fit` ([`TerminalDemo.astro`](src/components/TerminalDemo.astro)) | Authentic v1.1.0 CLI simulator with 3-path guided onboarding, exact `--json`/`--porcelain`/`explain`/`audit`/`verify`/`guard` outputs, `git setu` alias, and `↑`/`↓` command history. |
| **Offline `⌘K` Search** | [`@orama/orama`](https://oramasearch.com/) + [`search.json.ts`](src/pages/search.json.ts) | Client-side, typo-tolerant search across all 28 docs and quick actions with zero backend API latency. |
| **Dynamic Social Cards** | `satori` + `@resvg/resvg-js` ([`[...slug].png.ts`](src/pages/og/%5B...slug%5D.png.ts)) | Build-time 1200×630 Open Graph PNGs for every documentation page alongside the 1200×630 homepage card (`public/og-image.png`). |
| **GitHub Callout Alerts** | [`remark-github-alerts.mjs`](src/utils/remark-github-alerts.mjs) | Zero-dependency remark plugin rendering upstream `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, and `[!CAUTION]` blocks. |
| **Agentic & Search Discovery** | [`generate_llms.js`](scripts/generate_llms.js) + JSON-LD + [`sitemap.xml.ts`](src/pages/sitemap.xml.ts) | Emits spec-compliant `/llms.txt` index, `/llms-full.txt` complete Markdown corpus, `WebSite`/`SoftwareApplication`/`TechArticle` JSON-LD, and XML sitemap. |

---

## Docs Single Source of Truth Pipeline

> [!IMPORTANT]
> **Do not manually edit Markdown files inside `src/pages/docs/`.** They are overwritten on every `npm run dev` / `npm run build` by `scripts/sync_docs.js`.

All 28 documentation pages originate in the core [`gitsetu`](https://github.com/bhaskarjha-dev/gitsetu) repository (`docs/**`, `CONTRIBUTING.md`, `CHANGELOG.md`, and `SECURITY.md`). A single manifest — [`src/data/docs.mjs`](src/data/docs.mjs) — drives the entire portal:

```text
  gitsetu repo (sibling checkout or GitHub main raw fallback)
  docs/** + CONTRIBUTING.md + CHANGELOG.md + SECURITY.md
                           │
                           ▼
                   src/data/docs.mjs   (Single Source of Truth: 28 docs)
                    ┌──────┴──────────────────────────────┐
                    ▼                                     ▼
          scripts/sync_docs.js                  Astro Build + Endpoints
          ├─ strips upstream frontmatter        ├─ DocsLayout.astro (sidebar, breadcrumbs, prev/next, edit URLs)
          ├─ rewrites relative links            ├─ src/pages/search.json.ts (Orama index + category labels)
          ├─ prunes stale doc files             ├─ src/pages/sitemap.xml.ts (29 canonical URLs)
          └─ runs scripts/generate_llms.js      ├─ src/pages/og/[...slug].png.ts (28 dynamic OG PNGs)
             ├─ public/llms.txt (index)         └─ remark-github-alerts.mjs (styled callouts)
             └─ public/llms-full.txt (corpus)
```

### Adding or Updating a Documentation Page

1. Edit or add the Markdown file in the core [`gitsetu`](https://github.com/bhaskarjha-dev/gitsetu) repository.
2. If adding or renaming a page, register its entry in [`src/data/docs.mjs`](src/data/docs.mjs) (and add any 301 redirect in [`public/_redirects`](public/_redirects) and [`astro.config.mjs`](astro.config.mjs)).
3. Run `npm run build` — `sync_docs.js` automatically syncs the file, prunes obsolete pages, refreshes `llms.txt` / `llms-full.txt`, rebuilds `search.json` and `sitemap.xml`, and generates its Open Graph PNG.

---

## Routes & Machine Endpoints

| Route | Type | Description |
| :--- | :--- | :--- |
| `/` | HTML | Landing page with v1.1.0 4-channel Install Station, interactive Xterm sandbox, visual isolation diagram, feature bento, comparison, philosophy, and roadmap. |
| `/docs` | HTML | Documentation portal root (28 pages across 7 categories, TOC, heading anchors, code copy buttons). |
| `/docs/reference/changelog` | HTML | Full v1.1.0 & v1.0.0 release notes and breaking-change migration guide. |
| `/docs/enterprise/security-policy` | HTML | Supported release channels and private vulnerability disclosure policy. |
| `/install`, `/install.sh` | 302 Edge | Redirects to verified `releases/latest/download/install.sh` (via `public/_redirects`). |
| `/uninstall`, `/uninstall.sh` | 302 Edge | Redirects to verified `releases/latest/download/uninstall.sh`. |
| `/install.ps1`, `/uninstall.ps1` | 302 Edge | Redirects to the verified Windows checkout installation & removal instructions (no blind `irm \| iex`). |
| `/docs/core-engines/credential-broker` | 301 Edge | Permanent redirect from v1.0.0 route to `/docs/core-engines/https-credentials`. |
| `/llms.txt` | `text/plain` | Standards-compliant curated index, v1.1.0 install commands, and anti-hallucination guidance for AI agents. |
| `/llms-full.txt` | `text/plain` | Complete single-file Markdown compilation of all 28 documentation pages with absolute links. |
| `/search.json` | JSON | Pre-built client-side search index consumed by Orama in the `⌘K` Command Palette. |
| `/sitemap.xml` | XML | Canonical sitemap covering `/` and all 28 documentation routes. |
| `/og/<slug>.png` | PNG | Build-time 1200×630 Open Graph social card for every documentation route. |

---

## Deployment (Cloudflare Pages)

The site is designed for zero-config static hosting on **Cloudflare Pages** (or any static host honoring `_redirects` and `_headers`):

| Setting | Value |
| :--- | :--- |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node.js version** | `18` or newer (tested on Node 24) |
| **Optional env var** | `GITHUB_TOKEN` (increases GitHub raw fetch rate limits when syncing docs in CI without a sibling `gitsetu` checkout) |

Cloudflare automatically enforces [`public/_redirects`](public/_redirects) and [`public/_headers`](public/_headers) (security headers, UTF-8 content-types for `llms*.txt`, immutable caching for `/_assets/*` and `/fonts/*`).

---

## Design System & Guardrails

When contributing UI or styling updates, keep these non-negotiable invariants intact:

- **Vanilla CSS only** — No Tailwind, Bootstrap, React, or Vue. Scope component styles inside `.astro` files and reuse tokens from [`src/styles/global.css`](src/styles/global.css) (`--bg-*`, `--text-*`, `--accent-*`, `--space-*`, `--text-*`, `--radius-*`).
- **Strict CLI fidelity** — Every command, flag, JSON schema, and install snippet on the site must match the actual [`gitsetu`](https://github.com/bhaskarjha-dev/gitsetu) v1.1.0 source code.
- **Responsive & Accessible** — Zero horizontal overflow from `375px` mobile through `1920px` ultrawide, full keyboard navigation & focus management (`CommandPalette`, mobile drawers), and complete `@media (prefers-reduced-motion: reduce)` support.
- **No direct edits in `src/pages/docs/`** — Always edit upstream in `gitsetu`.

---

## Repository Map

```text
├── astro.config.mjs                    # Astro SSG config, Shiki theme, remark alerts & redirects
├── package.json                        # Scripts (sync-docs, dev, build, preview) & dependencies
├── docs/
│   └── PROMPTS.md                      # Maintenance & audit prompt templates
├── scripts/
│   ├── sync_docs.js                    # Cross-platform doc sync, frontmatter strip & stale pruner
│   ├── sync_docs.sh                    # POSIX wrapper delegating to sync_docs.js
│   └── generate_llms.js                # Generates public/llms.txt & public/llms-full.txt
├── public/
│   ├── _redirects                      # Cloudflare Pages installer & route redirects
│   ├── _headers                        # Security headers, UTF-8 MIME & cache policy
│   ├── robots.txt                      # Crawler rules + sitemap & llms.txt reference
│   ├── favicon.svg / favicon.ico       # Brand vector & 48×48 ICO favicons
│   ├── logo.png / logo.webp            # Brand marks
│   ├── og-image.png                    # 1200×630 homepage Open Graph card
│   └── fonts/
│       └── noto-sans-devanagari.woff2  # Self-hosted SIL OFL 1.1 Devanagari webfont (सेतु)
└── src/
    ├── data/docs.mjs                   # Single source of truth for all 28 docs & categories
    ├── utils/remark-github-alerts.mjs  # Zero-dependency GitHub alert callouts plugin
    ├── styles/global.css               # Design tokens, typography, reset & a11y rules
    ├── layouts/
    │   ├── Layout.astro                # Base layout (SEO, OG, JSON-LD, ClientRouter)
    │   └── DocsLayout.astro            # 3-column docs shell (sidebar, TOC, alerts, pagination)
    ├── components/                     # Hero, TerminalDemo, VisualCapabilities, BentoGrid, etc.
    └── pages/
        ├── index.astro                 # Landing page composition
        ├── 404.astro                   # Custom route-trace 404 page
        ├── search.json.ts              # Orama search index endpoint
        ├── sitemap.xml.ts              # Canonical XML sitemap endpoint
        ├── og/[...slug].png.ts         # Satori + Resvg dynamic OG PNG generator
        └── docs/                       # Synced Markdown pages (auto-managed by sync_docs.js)
```

---

## License

Released under the [MIT License](LICENSE) © 2026 Bhaskar Jha.

<div align="center">

**[Live Site](https://gitsetu.bhaskarjha.dev)** · **[Documentation](https://gitsetu.bhaskarjha.dev/docs)** · **[GitSetu CLI](https://github.com/bhaskarjha-dev/gitsetu)** · **[v1.1.0 Changelog](https://gitsetu.bhaskarjha.dev/docs/reference/changelog)** · **[llms.txt](https://gitsetu.bhaskarjha.dev/llms.txt)**

</div>
