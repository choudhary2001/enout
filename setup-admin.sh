#!/bin/bash
set -e

# Navigate to the repo root
cd "$(dirname "$0")"

# Install dependencies
echo "=== Installing dependencies ==="
pnpm install

# Build shared package
echo "=== Building shared package ==="
pnpm --filter @enout/shared build

# Build UI package
echo "=== Building UI package ==="
pnpm --filter @enout/ui build

# Run tests
echo "=== Running tests ==="
pnpm --filter @enout/admin test

# Start the admin app
echo "=== Starting admin app ==="
NEXT_PUBLIC_API_URL=http://localhost:3003 pnpm --filter @enout/admin dev

# Note: You need to have the API running on port 3003
# In a separate terminal, run:
# PORT=3003 pnpm --filter @enout/api dev
