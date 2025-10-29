#!/bin/bash
set -e

# Navigate to the repo root
cd "$(dirname "$0")"

# Install dependencies
echo "=== Installing dependencies ==="
pnpm install

# Build the shared package
echo "=== Building shared package ==="
pnpm --filter @enout/shared build

# Build the API
echo "=== Building API ==="
pnpm --filter @enout/api build

# Make sure Docker services are running
echo "=== Checking Docker services ==="
docker compose -f infra/docker/docker-compose.dev.yml ps || docker compose -f infra/docker/docker-compose.dev.yml up -d

# Ensure .env files exist
echo "=== Ensuring .env files exist ==="
[ -f .env ] || cp .env.example .env
[ -f infra/prisma/.env ] || cp infra/prisma/.env.example infra/prisma/.env

# Run the seed script
echo "=== Running seed script ==="
pnpm -w --filter @enout/api db:seed

# Start the API server on port 3002 (since 3001 might be in use)
echo "=== Starting API server on port 3002 ==="
PORT=3002 pnpm --filter @enout/api dev &
API_PID=$!

# Wait for API to start
echo "=== Waiting for API to start ==="
sleep 10

# Verify API endpoints
echo -e "\n=== Verification Tests ==="

# Check health endpoint
echo -e "\n1. Testing health endpoint:"
curl -s http://localhost:3002/health | jq

# Import invites
echo -e "\n2. Importing invites:"
curl -s -X POST http://localhost:3002/events/clq1234567890abcdefghijkl/invites/import \
  -H "Content-Type: application/json" \
  -d '{"rows":[{"email":"test@example.com","firstName":"Test","lastName":"User"}]}' | jq

# Request OTP for non-existent email
echo -e "\n3. Requesting OTP for non-existent email:"
curl -s -X POST http://localhost:3002/auth/request-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com","eventId":"clq1234567890abcdefghijkl"}' | jq

# Request OTP for existing email
echo -e "\n4. Requesting OTP for existing email (check console for OTP code):"
curl -s -X POST http://localhost:3002/auth/request-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","eventId":"clq1234567890abcdefghijkl"}' | jq

# List guests
echo -e "\n5. Listing guests:"
curl -s http://localhost:3002/events/clq1234567890abcdefghijkl/invites | jq

# Clean up
echo -e "\n=== Stopping API server ==="
kill $API_PID

echo -e "\n=== All tests completed! ==="
echo "Swagger documentation available at: http://localhost:3002/docs"
