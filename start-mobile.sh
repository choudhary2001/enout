#!/bin/bash
cd /root/enout-event-management-APP-/mobile
export PATH="/root/.local/share/pnpm:$PATH"
exec pnpm start --web --port 8081 --no-dev-client

