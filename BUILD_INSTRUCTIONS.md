# Chess 3D Mobile App - Local Build Instructions

## Building on Your Local Machine

This guide provides step-by-step instructions to build the Android APK and iOS app on your local development machine.

### Prerequisites

#### For Android Development

1. **Android Studio** (includes Android SDK)
   - Download: https://developer.android.com/studio
   - Install Android SDK Platform 34+
   - Install Android Build Tools 34.0.0+

2. **Java Development Kit (JDK)**
   ```bash
   # macOS
   brew install openjdk@17
   
   # Linux
   sudo apt-get install openjdk-17-jdk
   ```

3. **Environment Variables**
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   export JAVA_HOME=$(/usr/libexec/java_home -v 17)
   ```

#### For iOS Development (macOS only)

1. **Xcode** (latest version)
   ```bash
   xcode-select --install
   ```

2. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

### Step 1: Clone the Repository

```bash
git clone https://github.com/brandon-300/chess-3d-mobile.git
cd chess-3d-mobile
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual credentials
nano .env

# Required variables:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key
# FIREBASE_PROJECT_ID=chess-3d-mobile
# FIREBASE_MESSAGING_SENDER_ID=your-sender-id
# GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Step 4: Build Web Assets

```bash
npm run build
```

This generates the web assets in the `dist/` directory.

## Building Android APK

### Option A: Using Android Studio (Recommended)

```bash
# 1. Add Android platform
npx cap add android

# 2. Sync web assets
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

In Android Studio:

1. Wait for Gradle sync to complete
2. Select **Build** → **Generate Signed Bundle / APK**
3. Choose **APK** (not Bundle)
4. Select your signing key or create a new one
5. Choose **Release** build type
6. Click **Finish**

The APK will be generated at: `android/app/build/outputs/apk/release/app-release.apk`

### Option B: Using Command Line

```bash
# 1. Add Android platform
npx cap add android

# 2. Sync web assets
npx cap sync android

# 3. Build APK
cd android
./gradlew assembleRelease
cd ..
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Option C: Debug APK (for testing)

```bash
# Build debug APK
npx cap run android

# Or manually:
cd android
./gradlew assembleDebug
cd ..
```

Debug APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## Building iOS App

### Option A: Using Xcode (Recommended)

```bash
# 1. Add iOS platform
npx cap add ios

# 2. Sync web assets
npx cap sync ios

# 3. Open in Xcode
npx cap open ios
```

In Xcode:

1. Select the **App** target
2. Go to **Signing & Capabilities**
3. Set your **Team ID** (Apple Developer account)
4. Select **Product** → **Archive**
5. Click **Distribute App**
6. Follow the App Store submission flow

### Option B: Using Command Line

```bash
# 1. Add iOS platform
npx cap add ios

# 2. Sync web assets
npx cap sync ios

# 3. Build for simulator
npx cap run ios

# 4. Build for device/archive
cd ios/App
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -derivedDataPath build \
  archive -archivePath build/App.xcarchive
cd ../..
```

## Testing on Devices

### Android Device

```bash
# Connect device via USB with USB debugging enabled
adb devices

# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or install release APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

### iOS Device

Use Xcode to deploy to connected device:

1. Connect iPhone via USB
2. Select device in Xcode top toolbar
3. Click **Product** → **Run** (Cmd+R)

## Troubleshooting

### Android Build Issues

**Error: "SDK location not found"**
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Library/Android/sdk
```

**Error: "Gradle sync failed"**
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew build
cd ..
```

**Error: "Java version mismatch"**
```bash
# Use Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### iOS Build Issues

**Error: "Pod install failed"**
```bash
cd ios/App
rm -rf Pods
pod install
cd ../..
```

**Error: "Code signing failed"**
- Verify Team ID in Xcode
- Check Apple Developer certificate is installed
- Verify provisioning profile is valid

### WebView Issues

**Blank white screen**
- Verify web assets were built: `npm run build`
- Verify sync was successful: `npx cap sync`
- Check browser console for errors

**Three.js rendering issues**
- Ensure hardware acceleration is enabled in WebView
- Check WebGL context initialization
- Verify Three.js is properly loaded

## Deployment

### Google Play Store

1. Build release APK (see above)
2. Go to [Google Play Console](https://play.google.com/console)
3. Create new app or select existing
4. Upload APK to Internal Testing track
5. Test thoroughly
6. Promote to Production

### Apple App Store

1. Build and archive in Xcode (see above)
2. Go to [App Store Connect](https://appstoreconnect.apple.com)
3. Create new app or select existing
4. Upload build
5. Add app information, screenshots, etc.
6. Submit for review

## Performance Optimization

### Android

- Enable ProGuard/R8 for release builds (automatic)
- Use hardware acceleration (enabled in capacitor.config.ts)
- Test on real devices, not just emulators

### iOS

- Use Xcode Profiler to identify bottlenecks
- Check memory usage with Instruments
- Optimize Three.js rendering for mobile

## Support

For issues:

1. Check the main [README.md](./README.md)
2. Review [CAPACITOR_CONVERSION_GUIDE.md](./CAPACITOR_CONVERSION_GUIDE.md)
3. Check [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
4. Review Capacitor documentation: https://capacitorjs.com/docs

---

**Version**: 1.0  
**Last Updated**: June 4, 2026
