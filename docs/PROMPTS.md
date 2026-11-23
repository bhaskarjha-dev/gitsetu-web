# GitSetu-Web — Prompt Library

> **What this is**: Copy-paste prompts for an AI session to audit, sync, and extend the GitSetu marketing & documentation website (`gitsetu-web`).
> Each prompt establishes the stack boundaries (**Astro v6 SSG**, **Vanilla CSS** using `src/styles/global.css` tokens, **Single Source of Truth** in `src/data/docs.mjs`).

---

## Table of Contents

1. [Architecture & Narrative Audit](#1-architecture--narrative-audit)
2. [UI/UX & Responsive Layout Audit](#2-uiux--responsive-layout-audit)
3. [Cross-Repo CLI & Docs Sync](#3-cross-repo-cli--docs-sync)
4. [Performance, SEO & Accessibility Audit](#4-performance-seo--accessibility-audit)
5. [Build a New Component](#5-build-a-new-component)
6. [Documentation Pipeline Maintenance](#6-documentation-pipeline-maintenance)
7. [Zero-Defect Release Prep](#7-zero-defect-release-prep)

---

## 1. Architecture & Narrative Audit

```text
Audit the GitSetu marketing and documentation site (`gitsetu-web`, Astro v6 + Vanilla CSS).
Inspect `astro.config.mjs`, `src/data/docs.mjs`, `src/styles/global.css`, `src/layouts/`, and `src/components/`.
Verify that the messaging, visual hierarchy, and developer experience reflect modern developer-tool standards without adding bloated frameworks.
Report concrete flaws, tradeoffs, and prioritized fixes before making changes.
```

---

## 2. UI/UX & Responsive Layout Audit

```text
Perform a surgical responsive layout audit of `gitsetu-web` across mobile (375px), tablet (768px), desktop (1440px), and ultrawide (1920px) viewports.

CONSTRAINTS:
1. Vanilla CSS only — NO Tailwind, React, or Vue.
2. Strictly use design tokens from `src/styles/global.css` (`var(--space-md)`, `var(--text-xl)`, etc.).

Check `Navbar.astro`, `Hero.astro`, `TerminalDemo.astro`, `VisualCapabilities.astro`, `BentoGrid.astro`, `CodeCompare.astro`, `Comparison.astro`, `Philosophy.astro`, `Roadmap.astro`, `Cta.astro`, `Footer.astro`, and `DocsLayout.astro` for horizontal overflow, clipping, bad wrapping, or broken touch targets.
```

---

## 3. Cross-Repo CLI & Docs Sync

```text
Compare the actual `gitsetu` CLI source code (`../gitsetu`, `../lib/*.sh`, `../CHANGELOG.md`, `../docs/**`) against `gitsetu-web`.
Verify every CLI flag, JSON/porcelain schema, interactive prompt in `TerminalDemo.astro`, install channel in `Hero.astro`, `_redirects` rule, and feature card in `BentoGrid.astro` / `Comparison.astro` / `Roadmap.astro` matches the exact published CLI release with zero drift or unverified claims.
```

---

## 4. Performance, SEO & Accessibility Audit

```text
Audit `gitsetu-web` for Lighthouse Performance, Accessibility (WCAG 2.2 AA), Best Practices, and SEO:
1. Review `src/layouts/Layout.astro` and `src/layouts/DocsLayout.astro` for OpenGraph, Twitter Card, JSON-LD, canonical links, `llms.txt` discovery, and non-blocking font loading.
2. Verify heading hierarchy, `aria-*` attributes, keyboard focus trapping (`CommandPalette.astro`, mobile drawers), and `prefers-reduced-motion` support.
3. Confirm Devanagari (`सेतु`) and Latin glyphs render cleanly without tofu boxes or FOUT.
```

---

## 5. Build a New Component

```text
Build a new `.astro` component for `gitsetu-web` using strictly Vanilla CSS scoped styles and design tokens from `src/styles/global.css`.
Ensure zero horizontal overflow down to 320px, proper `min-width: 0` on Grid/Flex children, keyboard accessibility, and `prefers-reduced-motion` support.
```

---

## 6. Documentation Pipeline Maintenance

```text
Review the documentation sync pipeline in `gitsetu-web`:
1. `src/data/docs.mjs` — single source of truth for categories, manifest, and metadata.
2. `scripts/sync_docs.js` (and wrapper `scripts/sync_docs.sh`) — local-first sync with GitHub raw fallback, YAML frontmatter stripping, link rewriting, and stale-doc pruning.
3. `src/utils/remark-github-alerts.mjs` — zero-dependency GitHub alert callout renderer (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`).
4. `scripts/generate_llms.js` — `public/llms.txt` index and `public/llms-full.txt` corpus.
Verify all synced pages build cleanly with zero broken internal links or anchors.
```

---

## 7. Zero-Defect Release Prep

```text
Perform a Go/No-Go release readiness check for `gitsetu-web`:
1. Run `npm run build` and verify `sync_docs.js`, `generate_llms.js`, Satori OG image generation (`/og/**/*.png`), `search.json`, and `sitemap.xml` all succeed cleanly.
2. Verify `.gitignore` keeps generated docs (`src/pages/docs/`) and `public/llms*.txt` untracked.
3. Audit every link, redirect (`public/_redirects`), header (`public/_headers`), and console/network response in headless Chrome before publishing.
```
