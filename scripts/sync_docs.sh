#!/usr/bin/env bash
# sync_docs.sh
# Thin wrapper that delegates to the canonical Node.js documentation sync engine
# (which reads the single-source manifest from src/data/docs.mjs).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v node >/dev/null 2>&1; then
  exec node "$SCRIPT_DIR/sync_docs.js"
fi

echo "Error: Node.js 18+ is required to run scripts/sync_docs.js." >&2
exit 1
