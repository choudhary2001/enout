#!/bin/bash

cd /root/enout-event-management-APP-/mobile

export PATH="/root/.local/share/pnpm:$PATH"

echo "Installing dependencies..."
pnpm install

echo "Installing missing packages..."
pnpm add react-native-safe-area-context@4.10.5

echo "Preparing Android build..."
npx expo prebuild --platform android --clean

echo "Building APK..."
cd android
./gradlew assembleDebug

echo "Copying APK..."
cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk ./enout-mobile.apk

echo "✓ APK built successfully: mobile/enout-mobile.apk"
echo "Install with: adb install -r enout-mobile.apk"

