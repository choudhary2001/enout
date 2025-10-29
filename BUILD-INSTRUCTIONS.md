# Android Build Instructions

## Quick Start

### Build Both APK and AAB (All-in-one)
```bash
./build-android-all.sh
```

### Or use npm scripts from mobile directory:
```bash
cd mobile
npm run build:all
```

## Individual Builds

### Production APK (for direct installation)
```bash
cd mobile
npm run build:apk:prod
```

### Production AAB (for Google Play Store)
```bash
cd mobile
npm run build:aab
```

## Prerequisites

1. **Install EAS CLI** (if not installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo** (if not logged in):
   ```bash
   eas login
   ```

3. **For Local Builds** (recommended):
   - Requires Android SDK installed
   - Requires Java JDK
   - Builds locally on your machine

4. **For Remote Builds** (alternative):
   - Only requires EAS account
   - Builds in Expo cloud
   - Download from Expo dashboard

## Output Files

After building, find your files:
- **APK**: `mobile/build-*.apk` (install directly on Android devices)
- **AAB**: `mobile/build-*.aab` (upload to Google Play Console)

## Installation

### Install APK on device:
```bash
adb install -r mobile/build-*.apk
```

Or transfer APK to device and install manually.

## Google Play Store Upload

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select existing app
3. Navigate to "Release" > "Production" > "Create new release"
4. Upload the AAB file (`mobile/build-*.aab`)
5. Complete store listing and submit for review

## Notes

- APK files can be installed directly on any Android device
- AAB files are required for Google Play Store uploads
- Local builds are faster but require Android build tools
- Remote builds are slower but don't require local setup
- Production builds are signed and optimized for distribution

