#!/bin/bash

set -e

cd "$(dirname "$0")/mobile"

echo "=========================================="
echo "Building Android APK and AAB files"
echo "=========================================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check if logged in to Expo
echo "Checking EAS authentication..."
if ! eas whoami &> /dev/null; then
    echo "Please log in to Expo:"
    eas login
fi

echo ""
echo "Building APK (Production)..."
echo "----------------------------------------"
eas build --platform android --profile production --local --non-interactive

echo ""
echo "Building AAB (Production)..."
echo "----------------------------------------"
eas build --platform android --profile production-aab --local --non-interactive

echo ""
echo "=========================================="
echo "Build completed successfully!"
echo "=========================================="
echo ""
echo "Output files:"
echo "  - APK: mobile/build-*.apk"
echo "  - AAB: mobile/build-*.aab"
echo ""
echo "To find your files, check the build output above or:"
echo "  find mobile -name '*.apk' -o -name '*.aab'"

