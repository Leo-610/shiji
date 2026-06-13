#!/usr/bin/env bash
set -euo pipefail

# Configure email magic-link login (Resend) and site URLs on Vercel.
#
# Usage:
#   export AUTH_RESEND_KEY=re_xxxx   # from https://resend.com/api-keys
#   export AUTH_RESEND_FROM='量子余烬 <noreply@shiji.ink>'  # optional
#   ./scripts/configure-email-auth.sh
#
# Vercel Resend integration sets RESEND_API_KEY instead — also supported.

export PATH="/tmp/node/bin:${PATH:-}"
cd "$(dirname "$0")/.."

SITE_URL="${SITE_URL:-https://shiji.ink}"
RESEND_FROM="${AUTH_RESEND_FROM:-量子余烬 <notify@shiji.ink>}"
RESEND_KEY="${AUTH_RESEND_KEY:-${RESEND_API_KEY:-}}"

echo "==> Project: shiji ($(vercel whoami))"
echo "==> Site URL: $SITE_URL"

add_env() {
  local name="$1"
  local value="$2"
  local env="$3"
  echo "==> Setting $name ($env)"
  vercel env add "$name" "$env" --value "$value" --yes --force --non-interactive
}

for env in production preview development; do
  add_env AUTH_URL "$SITE_URL" "$env"
  add_env NEXT_PUBLIC_SITE_URL "$SITE_URL" "$env"
  add_env AUTH_RESEND_FROM "$RESEND_FROM" "$env"
done

if [ -n "$RESEND_KEY" ]; then
  for env in production preview development; do
    add_env AUTH_RESEND_KEY "$RESEND_KEY" "$env"
    add_env RESEND_API_KEY "$RESEND_KEY" "$env"
  done
  echo "==> Resend API key configured"
else
  echo ""
  echo "⚠️  No AUTH_RESEND_KEY / RESEND_API_KEY in environment."
  echo "    Get a key: https://resend.com/api-keys"
  echo "    Or install: https://vercel.com/integrations/resend"
  echo "    Then re-run: export AUTH_RESEND_KEY=re_xxx && $0"
fi

echo ""
echo "==> Redeploying production"
vercel deploy --prod --yes

echo ""
echo "Done. Test: $SITE_URL/auth/signin"
