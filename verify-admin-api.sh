#!/bin/bash
set -e

# Navigate to the repo root
cd /Users/tanmaymanocha/New_Enout_App

echo "=== Building shared package ==="
pnpm --filter @enout/shared build

echo "=== Building admin app ==="
pnpm --filter @enout/admin build

echo "=== Starting API server on port 3003 ==="
JWT_SECRET=dev-secret PORT=3003 pnpm --filter @enout/api dev &
API_PID=$!

echo "=== Waiting for API to start ==="
sleep 10

echo "=== Starting admin app on port 3000 ==="
NEXT_PUBLIC_API_URL=http://localhost:3003 pnpm --filter @enout/admin dev &
ADMIN_PID=$!

echo "=== Waiting for admin app to start ==="
sleep 15

echo "=== Checking API health ==="
curl -s http://localhost:3003/health | grep -q '{"ok":true}' || { echo "API health check failed"; kill $API_PID $ADMIN_PID; exit 1; }

echo "=== Checking API events endpoint ==="
curl -s http://localhost:3003/events | grep -q '"name":"Brevo Annual Off-site 2025"' || { echo "API events check failed"; kill $API_PID $ADMIN_PID; exit 1; }

echo "=== Checking admin app ==="
curl -s http://localhost:3000/events | grep -q 'Events' || { echo "Admin app check failed"; kill $API_PID $ADMIN_PID; exit 1; }

echo "=== All checks passed! ==="
echo "Admin app: http://localhost:3000/events"
echo "API docs: http://localhost:3003/docs"

# Keep running until interrupted
echo "Press Ctrl+C to stop both servers"
wait
