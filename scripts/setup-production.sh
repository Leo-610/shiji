#!/usr/bin/env bash
set -euo pipefail

# One-time production database setup after Vercel deploy.
# Usage: DATABASE_URL="postgresql://..." ./scripts/setup-production.sh

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Error: DATABASE_URL is not set."
  echo "Get it from Neon Console or Vercel → Storage → Neon."
  exit 1
fi

echo "Pushing schema to database..."
npm run db:push

echo "Seeding categories..."
npm run db:seed

echo "Done! Database is ready."
