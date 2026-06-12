#!/usr/bin/env bash
set -euo pipefail

# Copy GitHub OAuth credentials to Preview environment (often missing).
#
# Usage:
#   export AUTH_GITHUB_ID=...
#   export AUTH_GITHUB_SECRET=...
#   ./scripts/configure-preview-auth.sh

export PATH="/tmp/node/bin:${PATH:-}"
cd "$(dirname "$0")/.."

if [ -z "${AUTH_GITHUB_ID:-}" ] || [ -z "${AUTH_GITHUB_SECRET:-}" ]; then
  echo "Error: Set AUTH_GITHUB_ID and AUTH_GITHUB_SECRET"
  exit 1
fi

add_env() {
  vercel env add "$1" preview --value "$2" --yes --force --non-interactive
}

add_env AUTH_GITHUB_ID "$AUTH_GITHUB_ID"
add_env AUTH_GITHUB_SECRET "$AUTH_GITHUB_SECRET"

echo "Preview GitHub OAuth configured."
