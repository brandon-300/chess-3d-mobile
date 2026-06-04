# Chess 3D Mobile App - Installation & Setup Guide

## Prerequisites

Before starting, ensure you have the following installed on your development machine:

### Required for All Platforms

```bash
# Node.js v18+ and npm
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher

# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Verify installation
capacitor --version
```

### For iOS Development (macOS only)

```bash
# Xcode Command Line Tools
xcode-select --install

# Verify installation
xcode-select -p  # Should show /Applications/Xcode.app/Contents/Developer

# CocoaPods (for dependency management)
sudo gem install cocoapods
```

### For Android Development

```bash
# Android Studio (includes SDK)
# Download from: https://developer.android.com/studio

# Set ANDROID_HOME environment variable
# Add to ~/.zshrc or ~/.bash_profile:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Verify installation
adb --version
```

---

## Step-by-Step Installation

### Step 1: Clone or Create Project

```bash
# Option A: Clone the existing Chess 3D web app
git clone https://github.com/your-org/chess-3d-web.git chess-3d-mobile
cd chess-3d-mobile

# Option B: Create new project from scratch
mkdir chess-3d-mobile
cd chess-3d-mobile
```

### Step 2: Install Dependencies

```bash
# Install npm packages
npm install

# Install Capacitor core and CLI
npm install @capacitor/core @capacitor/cli --save-dev

# Install native plugins
npm install \
  @capacitor/app \
  @capacitor/browser \
  @capacitor/device \
  @capacitor/keyboard \
  @capacitor/push-notifications \
  @capacitor/screen-orientation \
  @capacitor/status-bar
```

### Step 3: Initialize Capacitor

```bash
# Initialize Capacitor in your project
npx cap init

# When prompted, provide:
# App name: Chess 3D
# App ID (Android): com.chess3d.mobile
# App ID (iOS): com.chess3d
# Web directory: dist (or public, depending on your build output)
```

### Step 4: Build Web Assets

```bash
# Build the web application for production
npm run build

# This generates the web assets in the dist/ directory
# which Capacitor will package into the native app
```

### Step 5: Add Native Platforms

```bash
# Add iOS platform (macOS only)
npx cap add ios

# Add Android platform
npx cap add android

# Sync web assets to native projects
npx cap sync
```

---

## Platform-Specific Setup

### iOS Setup

#### 1. Configure Xcode Project

```bash
# Open iOS project in Xcode
npx cap open ios
```

In Xcode:

1. Select the **App** target
2. Go to **Signing & Capabilities**
3. Add your **Team ID** (Apple Developer account)
4. Enable the following capabilities:
   - **Push Notifications**
   - **Background Modes** (Remote notifications)

#### 2. Configure Info.plist

Edit `ios/App/App/Info.plist` and add:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>Chess 3D</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>chess3d</string>
    </array>
  </dict>
</array>

<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>

<key>NSLocalNetworkUsageDescription</key>
<string>Chess 3D uses local network for multiplayer connectivity</string>

<key>NSBonjourServices</key>
<array>
  <string>_chess3d._tcp</string>
</array>
```

#### 3. Build and Run

```bash
# Build for simulator
npx cap run ios

# Or open in Xcode for more control
npx cap open ios
# Then: Product → Run (Cmd+R)
```

### Android Setup

#### 1. Configure Android Manifest

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Add custom URL scheme for deep-linking -->
<activity android:name=".MainActivity" ...>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="chess3d" android:host="oauth" />
  </intent-filter>
</activity>

<!-- Add push notification permission -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

#### 2. Configure Firebase (for Push Notifications)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: "Chess 3D"
3. Register Android app with package ID: `com.chess3d.mobile`
4. Download `google-services.json`
5. Place in `android/app/`

Edit `android/app/build.gradle`:

```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
  implementation 'com.google.firebase:firebase-messaging:23.2.1'
}
```

Edit `android/build.gradle`:

```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```

#### 3. Build and Run

```bash
# Build for emulator
npx cap run android

# Or open in Android Studio
npx cap open android
# Then: Run → Run 'app'
```

---

## Configuration Files

### capacitor.config.ts

Place this file in your project root:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chess3d.mobile',
  appName: 'Chess 3D',
  webDir: 'dist',
  
  server: {
    androidScheme: 'https',
    cleartext: true,
  },

  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0806',
      overlaysWebView: true,
    },
    Keyboard: {
      resize: 'none',
      resizeOnFullScreen: true,
    },
  },

  ios: {
    scheme: 'chess3d',
  },

  android: {
    scheme: 'chess3d',
  },
};

export default config;
```

### Environment Variables

Create `.env` file in project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
FIREBASE_PROJECT_ID=chess-3d-mobile
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

---

## Common Commands

```bash
# Development
npm run dev              # Start web dev server
npm run build            # Build web assets

# Capacitor
npm run cap:sync         # Sync web assets to native projects
npm run cap:open:ios     # Open iOS project in Xcode
npm run cap:open:android # Open Android project in Android Studio

# Testing
npm run test:ios         # Build and run on iOS simulator
npm run test:android     # Build and run on Android emulator

# Deployment
npm run cap:build:ios    # Build iOS app for App Store
npm run cap:build:android # Build Android app for Play Store
```

---

## Troubleshooting

### Issue: "capacitor command not found"

```bash
# Solution: Install Capacitor CLI globally
npm install -g @capacitor/cli
```

### Issue: "Cannot find module '@capacitor/core'"

```bash
# Solution: Install dependencies
npm install
```

### Issue: iOS build fails with "No signing identity found"

```bash
# Solution: Set Team ID in Xcode
# Xcode → App target → Signing & Capabilities → Team
```

### Issue: Android build fails with "SDK not found"

```bash
# Solution: Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Issue: WebView shows blank screen

```bash
# Solution: Ensure web assets are built and synced
npm run build
npm run cap:sync
```

### Issue: Push notifications not working

```bash
# iOS: Verify APNs certificate in Apple Developer Portal
# Android: Verify Firebase Cloud Messaging is configured
# Both: Check that push token is saved to Supabase
```

---

## Next Steps

1. **Test on physical devices** before submitting to app stores
2. **Configure push notifications** (Firebase for Android, APNs for iOS)
3. **Set up OAuth** with Google Sign-In
4. **Optimize performance** for mobile devices
5. **Submit to app stores** (Google Play Store and Apple App Store)

---

**Version**: 1.0  
**Last Updated**: June 4, 2026  
**Author**: Manus AI
