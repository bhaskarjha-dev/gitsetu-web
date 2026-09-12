#!/usr/bin/env bash
# sync_docs.sh
# Syncs documentation from the core GitSetu repository to Astro pages.

set -euo pipefail

REPO_RAW_URL="https://raw.githubusercontent.com/bhaskarjha-dev/gitsetu/main"
LOCAL_REPO_DIR=".."
DOCS_DIR="src/pages/docs"

echo "Syncing documentation..."

# Clear old docs entirely to prevent ghost files
rm -rf "$DOCS_DIR"
mkdir -p "$DOCS_DIR"

# Function to copy/download and format a markdown file
sync_doc() {
  local source_path=$1
  local dest_path=$2
  local title=$3
  local category=$4
  local slug=$5
  local description=$6

  echo "Syncing $dest_path..."
  
  local temp_file
  temp_file=$(mktemp)
  
  # Try local first (for monorepo/local dev), fallback to curl
  if [ -f "$LOCAL_REPO_DIR/$source_path" ]; then
    cp "$LOCAL_REPO_DIR/$source_path" "$temp_file"
  else
    # Check if a GitHub PAT is provided in Cloudflare env vars
    if [ -n "${GITHUB_TOKEN:-}" ]; then
      curl -sL -f -H "Authorization: token $GITHUB_TOKEN" "$REPO_RAW_URL/$source_path" -o "$temp_file" || {
        echo "Warning: Could not fetch $source_path (Private Auth Failed)"
        rm -f "$temp_file"
        return
      }
    else
      curl -sL -f "$REPO_RAW_URL/$source_path" -o "$temp_file" || {
        echo "Warning: Could not fetch $source_path (Public Auth Failed)"
        rm -f "$temp_file"
        return
      }
    fi
  fi

  # Sanitize CRLF to LF
  tr -d '\r' < "$temp_file" > "${temp_file}.lf"
  mv "${temp_file}.lf" "$temp_file"

  # Create subdirectories if needed
  mkdir -p "$(dirname "$DOCS_DIR/$dest_path")"

  # Calculate relative path to layout based on depth
  local stripped="${dest_path//[^\/]/}"
  local depth=${#stripped}
  local layout_path="../../layouts/DocsLayout.astro"
  for ((i=0; i<depth; i++)); do
    layout_path="../$layout_path"
  done

  # Prepend Astro frontmatter with rich metadata
  cat <<EOF > "$DOCS_DIR/$dest_path"
---
layout: $layout_path
title: "$title"
description: "$description"
category: "$category"
slug: "$slug"
---
EOF

  # Strip .md extensions and convert relative ../ links to /docs/ for clean, robust routing
  sed -E 's|\]\(([^)]+)\.md(#.*)?\)|](\1\2)|g' "$temp_file" | sed -E 's|\]\(\.\./|](/docs/|g' >> "$DOCS_DIR/$dest_path"

  rm -f "$temp_file"
}

# 1. Platform Overview
sync_doc "docs/overview/introduction.md" "index.md" "Introduction" "overview" "index" "Zero-dependency Git multi-identity orchestration and automated SSH profile switching for modern developer workflows."
sync_doc "docs/overview/architecture.md" "overview/architecture.md" "Architecture" "overview" "overview/architecture" "Internal mechanics, modular compilation patterns, and zero-trust execution flows of GitSetu."
sync_doc "docs/overview/comparisons.md" "overview/comparisons.md" "Ecosystem Comparisons" "overview" "overview/comparisons" "Comparative evaluation of GitSetu versus manual SSH configs, direnv, and alternative Git identity managers."
sync_doc "docs/overview/manifesto.md" "overview/manifesto.md" "Design Manifesto" "overview" "overview/manifesto" "Core engineering principles prioritizing zero dependencies, POSIX compliance, and atomic safety."

# 2. Getting Started
sync_doc "docs/getting-started/introduction.md" "getting-started/introduction.md" "Getting Started" "getting-started" "getting-started/introduction" "Onboarding guide covering prerequisites, system requirements, and foundational GitSetu setup."
sync_doc "docs/getting-started/installation.md" "getting-started/installation.md" "Installation" "getting-started" "getting-started/installation" "Installation guides across 9 distribution channels including Homebrew, WinGet, Scoop, AUR, Nix, and native scripts."
sync_doc "docs/getting-started/quickstart.md" "getting-started/quickstart.md" "Quickstart" "getting-started" "getting-started/quickstart" "Fast-track tutorial to configure your personal and work Git profiles in under three minutes."

# 3. Core Engines
sync_doc "docs/core-engines/identity-routing.md" "core-engines/identity-routing.md" "Identity Routing" "core-engines" "core-engines/identity-routing" "Hierarchical includeIf routing engine mapping repository working directories to isolated Git identities."
sync_doc "docs/core-engines/ssh-orchestrator.md" "core-engines/ssh-orchestrator.md" "SSH Orchestrator" "core-engines" "core-engines/ssh-orchestrator" "Automated OpenSSH key generation, ~/.ssh/config profile management, and multi-host multiplexing."
sync_doc "docs/core-engines/credential-broker.md" "core-engines/credential-broker.md" "Credential Broker" "core-engines" "core-engines/credential-broker" "OS keychain integration and encrypted credential vault storing personal access tokens securely."
sync_doc "docs/core-engines/precommit-guard.md" "core-engines/precommit-guard.md" "Pre-Commit Guard" "core-engines" "core-engines/precommit-guard" "Deterministic pre-commit hook preventing cross-identity commit pollution and secret leakage."

# 4. Guides
sync_doc "docs/guides/shell-prompt.md" "guides/shell-prompt.md" "Shell Prompt Integration" "guides" "guides/shell-prompt" "Dynamic prompt modules for Bash, Zsh, Starship, and Fish displaying the active Git identity."
sync_doc "docs/guides/hardware-keys.md" "guides/hardware-keys.md" "Hardware Keys (FIDO2)" "guides" "guides/hardware-keys" "Configuration guide for FIDO2/WebAuthn hardware security keys and resident SSH credentials."
sync_doc "docs/guides/wsl-integration.md" "guides/wsl-integration.md" "WSL Integration" "guides" "guides/wsl-integration" "Seamless Windows Subsystem for Linux (WSL) interoperability with Windows credential managers."
sync_doc "docs/guides/vault-backups.md" "guides/vault-backups.md" "Vault Backups" "guides" "guides/vault-backups" "Encrypted profile backup, restoration, and cryptographic verification procedures."

# 5. Enterprise & Vision
sync_doc "docs/enterprise/security-privacy.md" "enterprise/security-privacy.md" "Security & Privacy" "enterprise" "enterprise/security-privacy" "Threat model, air-gapped deployment guarantees, zero-telemetry policy, and audit trail specifications."
sync_doc "docs/enterprise/product-roadmap.md" "enterprise/product-roadmap.md" "Product Roadmap" "enterprise" "enterprise/product-roadmap" "Strategic milestones, protocol enhancements, and enterprise roadmap for GitSetu."

# 6. Reference & Support
sync_doc "docs/reference/cli-commands.md" "reference/cli-commands.md" "CLI Commands" "reference" "reference/cli-commands" "Exhaustive CLI command reference documenting all flags, subcommands, and exit codes."
sync_doc "docs/reference/troubleshooting.md" "reference/troubleshooting.md" "Troubleshooting" "reference" "reference/troubleshooting" "Diagnostic workflows and solutions for SSH permission errors, keychain locks, and hook conflicts."
sync_doc "docs/reference/faq.md" "reference/faq.md" "FAQ" "reference" "reference/faq" "Frequently asked questions regarding security, compatibility, key rotation, and performance."
sync_doc "docs/MANUAL_QA.md" "reference/manual-qa.md" "Manual QA Playbook" "reference" "reference/manual-qa" "Step-by-step manual quality assurance test scenarios and cross-platform verification matrices."
sync_doc "CONTRIBUTING.md" "reference/contributing.md" "Contributing Guide" "reference" "reference/contributing" "Developer guidelines, coding conventions, test execution, and pull request workflows."

# 7. Architecture Decisions (ADR)
sync_doc "docs/adr/0001-dual-ssh-routing-strategy.md" "adr/0001-dual-ssh-routing-strategy.md" "ADR 0001: Dual SSH Routing" "adr" "adr/0001-dual-ssh-routing-strategy" "Architectural Decision Record: Dual SSH key routing via Match blocks versus include directives."
sync_doc "docs/adr/0002-ssh-config-include-directive.md" "adr/0002-ssh-config-include-directive.md" "ADR 0002: OpenSSH Include Pivot" "adr" "adr/0002-ssh-config-include-directive" "Architectural Decision Record: Standardizing on modular Include ~/.config/gitsetu/profiles/ssh_config."

echo "Documentation sync complete!"
