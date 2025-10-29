#!/bin/bash

# Start Expo for Android with Watchman disabled
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

# Disable Watchman to avoid permission issues
unset CI
unset WATCHMAN

# Shutdown Watchman if running
watchman shutdown-server 2>/dev/null || true

# Kill existing Expo processes on port 8081
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 2

# Start Expo
cd "$(dirname "$0")"
npx expo start --android --clear

