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

# Initialize EAS project if needed
echo "Checking EAS project configuration..."
if ! eas project:info &> /dev/null; then
    echo "Initializing EAS project..."
    eas project:init --force --non-interactive || echo "EAS project initialization completed"
fi

echo ""
echo "Note: If this is the first build, you may be prompted to generate Android credentials."
echo "This is安全生产工作 and will only happen once."
echo ""

echo ""
echo "Building APK (Production)..."
echo "----------------------------------------"
if command -v sdkmanager >/dev/null 2>&1; then
    echo "Ensuring Android NDK 26.1.10909125 is installed..."
    yes | sdkmanager "ndk;26.1.10909125" >/dev/null 2>&1 || true
elif [ -x "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo "Ensuring Android NDK 26.1.10909125 is installed (cmdline-tools)..."
    yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" "ndk;26.1.10909125" >/dev/null 2>&1 || true
elif [ -x "$ANDROID_HOME/tools/bin/sdkmanager" ]; then
    echo "Ensuring Android NDK 26.1.10909125 is installed (tools/bin)..."
    yes | "$ANDROID_HOME/tools/bin/sdkmanager" "ndk;26.1.10909125" >/dev/null 2>&1 || true
else
    SDKMANAGER_GLOB=$(ls -d "$ANDROID_HOME"/cmdline-tools/*/bin 2>/dev/null | head -1)
    if [ -n "$SDKMANAGER_GLOB" ] && [ -x "$SDKMANAGER_GLOB/sdkmanager" ]; then
        echo "Ensuring Android NDK 26.1.10909125 is installed ($SDKMANAGER_GLOB)..."
        yes | "$SDKMANAGER_GLOB/sdkmanager" "ndk;26.1.10909125" >/dev/null 2>&1 || true
    fi
fi
if [ -d "$ANDROID_HOME/ndk/26.1.10909125" ]; then
    export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"
    export ANDROID_NDK="$ANDROID_NDK_HOME"
    echo "Using NDK at: $ANDROID_NDK_HOME"
else
    echo "WARNING: Requested NDK not found. Proceeding without explicit ANDROID_NDK settings."
    unset ANDROID_NDK_HOME || true
    unset ANDROID_NDK || true
fi
eas build --platform android --profile production --local

echo ""
echo "Building AAB (Production)..."
echo "----------------------------------------"
eas build --platform android --profile production-aab --local

echo ""
echo "=========================================="
echo "Build completed successfully!"
echo "=========================================="
echo ""
echo "Output files:"
echo "  - APK: Check mobile directory for build-*.apk"
echo "  - AAB: Check mobile directory for build-*.aab"
echo ""
echo "To find your files:"
echo "  find . -name '*.apk' -o -name '*.aab' | head -5"
