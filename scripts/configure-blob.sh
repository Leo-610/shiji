#!/usr/bin/env bash
set -euo pipefail

# Create and link Vercel Blob store for avatar uploads.
# Requires: vercel CLI logged in, project linked (vercel link)

export PATH="/tmp/node/bin:${PATH:-}"
cd "$(dirname "$0")/.."

STORE_NAME="${BLOB_STORE_NAME:-shiji-avatars}"

echo "==> Project: shiji ($(vercel whoami))"

if vercel blob list-stores 2>/dev/null | grep -q "$STORE_NAME"; then
  echo "==> Blob store $STORE_NAME already exists"
else
  echo "==> Creating blob store $STORE_NAME"
  vercel blob create-store "$STORE_NAME" \
    --access public \
    --yes \
    -e production \
    -e preview \
    -e development
fi

echo ""
echo "==> Pulling environment variables"
vercel env pull .env.local --yes --environment=development

echo ""
vercel env ls | grep -i BLOB || true

echo ""
echo "Done! BLOB_READ_WRITE_TOKEN is set on Production, Preview, and Development."
