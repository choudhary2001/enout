#!/bin/bash

cd /root/enout-event-management-APP-/mobile

export PATH="/root/.local/share/pnpm:$PATH"

echo "Installing dependencies..."
pnpm install

echo "Starting Expo development server..."
echo "Press 'a' for Android or 'w' for web"

pnpm start

