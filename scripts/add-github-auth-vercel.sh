#!/usr/bin/env bash
set -euo pipefail

# Add GitHub OAuth credentials to Vercel and redeploy.
# Usage:
#   export AUTH_GITHUB_ID=your_client_id
#   export AUTH_GITHUB_SECRET=your_client_secret
#   export https_proxy=http://127.0.0.1:7890   # optional, for Clash
#   ./scripts/add-github-auth-vercel.sh

export PATH="/tmp/node/bin:${PATH:-}"
cd "$(dirname "$0")/.."

if [ -z "${AUTH_GITHUB_ID:-}" ] || [ -z "${AUTH_GITHUB_SECRET:-}" ]; then
  echo "Error: Set AUTH_GITHUB_ID and AUTH_GITHUB_SECRET first."
  echo ""
  echo "Create OAuth App: https://github.com/settings/applications/new"
  echo "  Homepage URL:  https://shiji.ink"
  echo "  Callback URL:  https://shiji.ink/api/auth/callback/github"
  echo "               (also add https://shiji-tau.vercel.app/api/auth/callback/github if needed)"
  exit 1
fi

add_env() {
  local name="$1"
  local value="$2"
  local env="$3"
  echo "==> $name ($env)"
  vercel env add "$name" "$env" --value "$value" --yes --force --non-interactive
}

for env in production development; do
  add_env AUTH_GITHUB_ID "$AUTH_GITHUB_ID" "$env"
  add_env AUTH_GITHUB_SECRET "$AUTH_GITHUB_SECRET" "$env"
done

echo "==> preview (all branches)"
vercel env add AUTH_GITHUB_ID preview --value "$AUTH_GITHUB_ID" --yes --force --non-interactive || true
vercel env add AUTH_GITHUB_SECRET preview --value "$AUTH_GITHUB_SECRET" --yes --force --non-interactive || true

echo ""
vercel env ls | grep -i GITHUB || vercel env ls

echo ""
echo "==> Redeploying production..."
vercel deploy --prod --yes --non-interactive

echo ""
echo "Done. Test login: https://shiji.ink/auth/signin"
