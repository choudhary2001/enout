#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MOBILE_DIR="$SCRIPT_DIR/mobile"
TEMP_BUILD_DIR="/tmp/enout-mobile-build-$$"

echo "=========================================="
echo "Building Android APK and AAB files (Isolated)"
echo "=========================================="
echo ""

cleanup() {
    echo ""
    if [ -d "$TEMP_BUILD_DIR" ]; then
        echo "Cleaning up temporary build directory..."
        rm -rf "$TEMP_BUILD_DIR" 2>/dev/null || true
    fi
}

trap cleanup EXIT INT TERM

echo "Creating isolated build environment..."
mkdir -p "$TEMP_BUILD_DIR"

echo "Copying mobile directory..."
cd "$MOBILE_DIR"
tar --exclude='node_modules' --exclude='.expo' --exclude='build' --exclude='android' \
    --exclude='ios' --exclude='*.log' --exclude='.DS_Store' \
    -czf "$TEMP_BUILD_DIR/mobile.tar.gz" .

cd "$TEMP_BUILD_DIR"
tar -xzf mobile.tar.gz
rm mobile.tar.gz

echo "Ensuring npm configuration..."
echo "package-lock=true" > .npmrc
echo "package-manager=npm" >> .npmrc

if ! grep -q '"packageManager"' package.json; then
    echo "Adding packageManager to package.json..."
    node -e "const fs=require('fs'); const pkg=JSON.parse(fs.readFileSync('package.json')); pkg.packageManager='npm@10.0.0'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
fi

echo "Verifying no workspace files..."
rm -f pnpm-lock.yaml pnpm-workspace.yaml 2>/dev/null || true

echo "Initializing git repository..."
git init
git add .
git commit -m "Build commit" || git commit --allow-empty -m "Build commit"

# Sanitize EAS profile env to avoid hardcoded NDK paths
if [ -f "eas.json" ]; then
    node - <<'NODE'
const fs = require('fs');
try {
  const p = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
  const removeNdk = (env) => {
    if (!env) return;
    delete env.ANDROID_NDK_HOME;
    delete env.ANDROID_NDK;
  };
  if (p.build) {
    if (p.build.production && p.build.production.env) removeNdk(p.build.production.env);
    if (p.build['production-aab'] && p.build['production-aab'].env) removeNdk(p.build['production-aab'].env);
    if (p.build.preview && p.build.preview.env) removeNdk(p.build.preview.env);
  }
  fs.writeFileSync('eas.json', JSON.stringify(p, null, 4));
} catch (e) {
  // ignore
}
NODE
fi

echo "Installing npm dependencies..."
npm install --legacy-peer-deps --include=dev

echo "Fixing missing dependencies and version mismatches..."
npm install expo-constants@~18.0.10 --legacy-peer-deps --save || true

echo "Verifying critical packages..."
if [ ! -d "node_modules/expo-constants" ]; then
    echo "ERROR: expo-constants not found"
    npm install expo-constants@~18.0.10 --legacy-peer-deps
fi

echo "Installing missing peer dependencies to fix package-lock.json..."
npm install @babel/plugin-transform-template-literals@7.27.1 semver@7.7.2 --legacy-peer-deps --save-dev || true

echo "Regenerating package-lock.json with all dependencies..."
rm -f package-lock.json
npm install --legacy-peer-deps --include=dev

echo "Verifying npm ci will work (without --legacy-peer-deps flag)..."
npm ci --include=dev --dry-run >/dev/null 2>&1 || {
    echo "WARNING: npm ci may fail. Installing missing packages..."
    npm install --legacy-peer-deps --include=dev
    rm -f package-lock.json
    npm install --include=dev
}

echo "Committing updated package-lock.json..."
git add package.json package-lock.json .npmrc
git commit -m "Build commit with complete dependencies" || git commit --allow-empty -m "Build commit"

echo "Checking EAS authentication..."
if ! eas whoami &> /dev/null; then
    echo "Please log in to Expo:"
    eas login
fi

echo "Setting up Android SDK environment..."
if [ -d "$HOME/Library/Android/sdk" ]; then
    export ANDROID_HOME="$HOME/Library/Android/sdk"
    export PATH="$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH"
    echo "Android SDK found at: $ANDROID_HOME"
elif [ -n "$ANDROID_HOME" ]; then
    export PATH="$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH"
    echo "Using ANDROID_HOME from environment: $ANDROID_HOME"
else
    echo "WARNING: ANDROID_HOME not set. Build may fail. Install Android SDK or set ANDROID_HOME."
    echo "Default location on macOS: $HOME/Library/Android/sdk"
fi

echo "Ensuring Android NDK 26.1.10909125 is installed and selected..."

# Use existing NDK if already available to avoid long installs
if [ -d "$ANDROID_HOME/ndk/26.1.10909125" ]; then
    export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"
    export ANDROID_NDK="$ANDROID_NDK_HOME"
    echo "Using existing NDK at: $ANDROID_NDK_HOME"
else
    echo "NDK 26.1.10909125 not found locally. Attempting installation via sdkmanager..."
    SDKMANAGER_BIN=""
    if command -v sdkmanager >/dev/null 2>&1; then
        SDKMANAGER_BIN="$(command -v sdkmanager)"
    elif [ -x "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
        SDKMANAGER_BIN="$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager"
    elif [ -x "$ANDROID_HOME/tools/bin/sdkmanager" ]; then
        SDKMANAGER_BIN="$ANDROID_HOME/tools/bin/sdkmanager"
    else
        SDKMANAGER_GLOB=$(ls -d "$ANDROID_HOME"/cmdline-tools/*/bin 2>/dev/null | head -1)
        if [ -n "$SDKMANAGER_GLOB" ] && [ -x "$SDKMANAGER_GLOB/sdkmanager" ]; then
            SDKMANAGER_BIN="$SDKMANAGER_GLOB/sdkmanager"
        fi
    fi

    if [ -n "$SDKMANAGER_BIN" ]; then
        echo "sdkmanager detected at: $SDKMANAGER_BIN"
        SDKMANAGER_TIMEOUT="${SDKMANAGER_TIMEOUT:-900}"
        if command -v timeout >/dev/null 2>&1; then
            echo "Installing NDK with timeout ${SDKMANAGER_TIMEOUT}s (prints progress)..."
            yes | timeout "$SDKMANAGER_TIMEOUT" "$SDKMANAGER_BIN" "ndk;26.1.10909125" || true
        else
            echo "Installing NDK without timeout (no 'timeout' binary found). This may take several minutes..."
            yes | "$SDKMANAGER_BIN" "ndk;26.1.10909125" || true
        fi
    else
        echo "WARNING: sdkmanager not found. Skipping NDK installation attempt."
    fi

    if [ -d "$ANDROID_HOME/ndk/26.1.10909125" ]; then
        export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"
        export ANDROID_NDK="$ANDROID_NDK_HOME"
        echo "Using NDK at: $ANDROID_NDK_HOME"
    else
        echo "WARNING: Requested NDK not found after install attempt. Proceeding without explicit ANDROID_NDK settings."
        unset ANDROID_NDK_HOME || true
        unset ANDROID_NDK || true
    fi
fi

echo ""
echo "Building APK (Production)..."
echo "----------------------------------------"
export NODE_ENV=production
eas build --platform android --profile production --local --non-interactive

echo ""
echo "Building AAB (Production)..."
echo "----------------------------------------"
eas build --platform android --profile production-aab --local --non-interactive

echo ""
echo "Finding build artifacts..."
APK_FILE=$(find . -name "*.apk" | head -1)
AAB_FILE=$(find . -name "*.aab" | head -1)

if [ -n "$APK_FILE" ]; then
    echo "Found APK: $APK_FILE"
    cp -v "$APK_FILE" "$MOBILE_DIR/"
fi

if [ -n "$AAB_FILE" ]; then
    echo "Found AAB: $AAB_FILE"
    cp -v "$AAB_FILE" "$MOBILE_DIR/"
fi

echo ""
echo "=========================================="
echo "Build completed successfully!"
echo "=========================================="
echo ""
echo "Output files in: $MOBILE_DIR"
ls -lh "$MOBILE_DIR"/*.{apk,aab} 2>/dev/null || echo "Build artifacts not found"
