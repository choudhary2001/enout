# Enout Mobile App

React Native mobile app built with Expo Router for event attendees.

## Quick Start

### Development Mode
```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Press 'a' for Android or 'w' for web browser
```

### Build APK

**Option 1: Local Build (Recommended)**
```bash
cd /root/enout-event-management-APP-
./build-android.sh
# APK will be at: mobile/enout-mobile.apk
```

**Option 2: EAS Build (Cloud)**
```bash
# Login to Expo (first time only)
npx eas login

# Build preview APK
npx eas build --platform android --profile preview

# Build production APK
npx eas build --platform android --profile production
```

**Option 3: Direct Build**
```bash
cd mobile
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
# APK at: android/app/build/outputs/apk/debug/app-debug.apk
```

## Configuration

### Environment Variables
```bash
# API endpoint
EXPO_PUBLIC_API_URL=http://localhost:3003

# Default event ID for testing
EXPO_PUBLIC_DEFAULT_EVENT_ID=event-1
```

### Build Profiles
- **Development**: For testing with dev client
- **Preview**: APK for testing/distribution
- **Production**: AAB for Play Store upload

## Project Structure
```
mobile/
  app/              # Expo Router screens (file-based routing)
  src/              # Source code
    components/     # Reusable components
    lib/           # Core libraries (API, storage, config)
  assets/          # Images, icons, splash
  app.json         # Expo configuration
  eas.json         # EAS build configuration
  babel.config.js  # Babel configuration
  metro.config.js  # Metro bundler configuration
```

## Features
- Email/OTP authentication
- Event registration
- ID card upload
- Phone verification
- Message inbox
- Event schedule
- Profile management

## Troubleshooting

### Build Error: Boolean Casting
**Error**: `java.lang.String cannot be cast to java.lang.Boolean`

**Solution**: This has been fixed by adding:
- babel.config.js
- metro.config.js
- react-native-safe-area-context
- react-native-reanimated plugin

### APK Build Failed
1. Ensure Android SDK is installed
2. Set ANDROID_HOME environment variable
3. Check Java version (JDK 11+ required)
4. Run: `npx expo prebuild --clean`

### Cache Issues
```bash
# Clear cache and reinstall
rm -rf node_modules
pnpm install
npx expo start --clear
```

## Dependencies
- Expo SDK 54
- React 19
- React Native 0.81.4
- Expo Router 6.0.8
- TanStack Query (state management)
- Zustand (local state)
- React Hook Form (forms)
- Zod (validation)

## Production Build
1. Update version in app.json
2. Run: `npx eas build --platform android --profile production`
3. Download AAB from EAS dashboard
4. Upload to Google Play Console
5. Submit for review

