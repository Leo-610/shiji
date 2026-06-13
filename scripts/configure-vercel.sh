#!/usr/bin/env bash
set -euo pipefail

# Configure Vercel environment variables and Neon database for shiji project.
# Requires: vercel CLI logged in (vercel whoami)

export PATH="/tmp/node/bin:${PATH:-}"
cd "$(dirname "$0")/.."

AUTH_SECRET="${AUTH_SECRET:-$(openssl rand -base64 32)}"
AUTH_URL="${AUTH_URL:-https://shiji.ink}"

echo "==> Project: shiji"
vercel whoami

add_env() {
  local name="$1"
  local value="$2"
  local env="$3"
  echo "==> Setting $name ($env)"
  if [ "$env" = "preview" ]; then
    # Preview requires branch-less form for all preview deployments
    vercel env add "$name" preview --value "$value" --yes --force --non-interactive 2>&1 || \
      echo "    (skip preview — add manually in Vercel dashboard if needed)"
  else
    vercel env add "$name" "$env" --value "$value" --yes --force --non-interactive
  fi
}

for env in production preview development; do
  add_env AUTH_SECRET "$AUTH_SECRET" "$env"
  add_env AUTH_URL "$AUTH_URL" "$env"
done

echo ""
echo "==> Installing Neon integration (accept terms in browser if prompted)"
vercel integration add neon --name shiji-db -e production -e preview -e development --non-interactive || true

echo ""
echo "==> Pulling environment variables"
vercel env pull .env.local --yes --environment=production

echo ""
echo "==> Initializing database"
npm install --silent
# drizzle-kit and tsx do not auto-load .env.local
export DATABASE_URL="${DATABASE_URL:-$(grep '^DATABASE_URL=' .env.local 2>/dev/null | cut -d= -f2- | tr -d '"')}"
export DATABASE_URL="${DATABASE_URL:-$(grep '^POSTGRES_URL=' .env.local 2>/dev/null | cut -d= -f2- | tr -d '"')}"
npm run db:push
npm run db:seed

echo ""
echo "==> Redeploying production"
vercel deploy --prod --yes

echo ""
echo "Done! Site: $AUTH_URL"
echo "AUTH_SECRET (saved to Vercel): $AUTH_SECRET"
