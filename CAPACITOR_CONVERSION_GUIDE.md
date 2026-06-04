# 3D Multiplayer Chess: Capacitor Native Mobile App Conversion Guide

## Executive Summary

This guide provides a complete, production-ready implementation for converting the existing **3D Multiplayer Chess** web application into a cross-platform native mobile app using **Capacitor by Ionic**. The conversion preserves the luxury, dark-mythological aesthetic while optimizing for mobile performance, adding native features, and ensuring seamless platform-specific functionality.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites & Environment Setup](#prerequisites--environment-setup)
3. [Installation & Initialization](#installation--initialization)
4. [Capacitor Configuration](#capacitor-configuration)
5. [Native Plugin Integrations](#native-plugin-integrations)
6. [Implementation Code](#implementation-code)
7. [Build & Deployment](#build--deployment)
8. [Testing & Troubleshooting](#testing--troubleshooting)

---

## Project Overview

### Current Architecture

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Vanilla HTML5, CSS3, JavaScript, Three.js | 3D chessboard rendering and interactive gameplay |
| Backend | Supabase | Database, real-time broadcasting, RLS, matchmaking |
| Authentication | Supabase Auth | Username/password and Google OAuth (PKCE flow) |
| Hosting | Vercel | Web deployment |

### Mobile Conversion Objectives

- **Preserve Web Experience**: Maintain all existing functionality within a native WebView container
- **Add Native Capabilities**: Push notifications, deep-linking, state resilience, immersive display
- **Optimize Performance**: Hardware acceleration, landscape orientation lock, full-screen mode
- **Cross-Platform Support**: Single codebase for both iOS and Android

### Design Preservation

The mobile app maintains the original luxury aesthetic:

- **Color Palette**: Deep black background (`#0a0806`), translucent panels (`rgba(16,10,6,.70)` with `backdrop-filter: blur(20px)`), sharp gold accents (`#c9a84c`), muted gold borders (`#7a6230`)
- **Typography**: Immersive display fonts (Cinzel and Cormorant Garamond)
- **Visual Theme**: Dark-mythological with glowing gold circuit lines

---

## Prerequisites & Environment Setup

### Required Tools

Ensure the following are installed on your development machine:

```bash
# Node.js and npm (v18 or higher)
node --version
npm --version

# Capacitor CLI (global installation)
npm install -g @capacitor/cli

# For iOS development (macOS only)
# Xcode Command Line Tools
xcode-select --install

# For Android development
# Android Studio with SDK Platform 34+
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Project Structure

```
chess-3d-mobile/
├── capacitor.config.ts          # Main Capacitor configuration
├── ios/                         # iOS native project (auto-generated)
├── android/                     # Android native project (auto-generated)
├── web/                         # Web assets (copied from Vercel)
├── src/                         # Native bridge code
│   ├── native-bridge.ts         # Capacitor plugin wrappers
│   ├── push-notifications.ts    # FCM/APNs integration
│   ├── oauth-handler.ts         # Deep-linking OAuth
│   └── app-lifecycle.ts         # Foreground/background handling
└── package.json
```

---

## Installation & Initialization

### Step 1: Clone the Web Project

```bash
# Clone the existing Chess 3D web app repository
git clone https://github.com/your-org/chess-3d-web.git chess-3d-mobile
cd chess-3d-mobile
```

### Step 2: Install Capacitor

```bash
# Install Capacitor core and CLI
npm install @capacitor/core @capacitor/cli --save-dev

# Initialize Capacitor in your project
npx cap init

# When prompted, provide:
# - App name: Chess 3D
# - App ID: com.chess3d.mobile (Android) / com.chess3d (iOS)
# - Web directory: dist (or public, depending on your build output)
```

### Step 3: Install Native Plugins

```bash
# Core plugins
npm install @capacitor/app @capacitor/keyboard @capacitor/status-bar

# Push notifications
npm install @capacitor/push-notifications

# Deep-linking and URL handling
npm install @capacitor/app

# Screen orientation
npm install @capacitor/screen-orientation

# Device information
npm install @capacitor/device

# Browser API for OAuth redirects
npm install @capacitor/browser
```

### Step 4: Build the Web App

```bash
# Build the web application for production
npm run build

# This generates the web assets in the dist/ directory
# which Capacitor will package into the native app
```

### Step 5: Add Platforms

```bash
# Add iOS platform (macOS only)
npx cap add ios

# Add Android platform
npx cap add android

# Sync web assets to native projects
npx cap sync
```

---

## Capacitor Configuration

### capacitor.config.ts

Create or update `capacitor.config.ts` with the following comprehensive configuration:

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
    // Push Notifications Configuration
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    // Screen Orientation Lock
    ScreenOrientation: {
      // Will be controlled programmatically
    },
    // Status Bar Configuration
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0806',
      overlaysWebView: true,
    },
    // Keyboard Configuration
    Keyboard: {
      resize: 'none',
      resizeOnFullScreen: true,
    },
  },
  // Custom URL scheme for OAuth deep-linking
  ios: {
    scheme: 'chess3d',
  },
  android: {
    scheme: 'chess3d',
  },
};

export default config;
```

### iOS Configuration (Info.plist)

Add the following to `ios/App/App/Info.plist` to support custom URL schemes:

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

<!-- Push Notifications Capability -->
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

### Android Configuration (AndroidManifest.xml)

Add the following to `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Custom URL scheme for deep-linking -->
<activity android:name=".MainActivity" ...>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="chess3d" android:host="oauth" />
  </intent-filter>
</activity>

<!-- Push Notifications Permissions -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

---

## Native Plugin Integrations

### 1. Push Notifications (FCM / APNs)

#### Firebase Cloud Messaging (Android)

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project named "Chess 3D"
   - Register your Android app with package ID `com.chess3d.mobile`
   - Download `google-services.json` and place it in `android/app/`

2. **Update Android Gradle**:

   In `android/app/build.gradle`:

   ```gradle
   apply plugin: 'com.google.gms.google-services'

   dependencies {
     implementation 'com.google.firebase:firebase-messaging:23.2.1'
   }
   ```

   In `android/build.gradle`:

   ```gradle
   buildscript {
     dependencies {
       classpath 'com.google.gms:google-services:4.3.15'
     }
   }
   ```

#### Apple Push Notification Service (iOS)

1. **Enable Push Notifications Capability**:
   - Open `ios/App/App.xcodeproj` in Xcode
   - Select the App target
   - Go to Signing & Capabilities
   - Click "+ Capability" and add "Push Notifications"

2. **Create APNs Certificate**:
   - Go to [Apple Developer Portal](https://developer.apple.com/)
   - Create an APNs certificate for your app ID
   - Download and install the certificate in Keychain

#### JavaScript Implementation

See the [Implementation Code](#implementation-code) section for the complete push notification handler.

### 2. OAuth Deep-Linking

#### URL Scheme Registration

The URL scheme `chess3d://` is configured in `capacitor.config.ts` and native manifests. When users complete Google Sign-In, the OAuth callback redirects to:

```
chess3d://oauth?code=AUTH_CODE&state=STATE
```

The app intercepts this URL and passes the authorization code to Supabase.

#### JavaScript Handler

See the [Implementation Code](#implementation-code) section for the OAuth handler.

### 3. Screen Orientation & Immersive Display

#### Landscape Lock for Gameplay

```typescript
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar, Style } from '@capacitor/status-bar';

// Lock to landscape when entering gameplay
export async function lockLandscapeOrientation() {
  await ScreenOrientation.lock({ orientation: 'landscape' });
  
  // Hide status bar for immersive experience
  await StatusBar.hide();
}

// Unlock when returning to menu
export async function unlockOrientation() {
  await ScreenOrientation.unlock();
  
  // Show status bar in menu
  await StatusBar.show();
}
```

---

## Implementation Code

### native-bridge.ts

```typescript
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar, Style } from '@capacitor/status-bar';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';

/**
 * Initialize all native capabilities when the app starts
 */
export async function initializeNativeBridge() {
  try {
    // Configure status bar
    await StatusBar.setBackgroundColor({ color: '#0a0806' });
    await StatusBar.setStyle({ style: Style.Dark });
    
    // Get device info for analytics
    const deviceInfo = await Device.getInfo();
    console.log('Device:', deviceInfo.platform, deviceInfo.osVersion);
    
    // Set up app lifecycle listeners
    setupAppLifecycleListeners();
    
    // Initialize push notifications
    await initializePushNotifications();
    
    console.log('Native bridge initialized successfully');
  } catch (error) {
    console.error('Failed to initialize native bridge:', error);
  }
}

/**
 * Handle app lifecycle events (foreground/background)
 */
function setupAppLifecycleListeners() {
  App.addListener('appStateChange', async (state) => {
    if (state.isActive) {
      console.log('App is now in foreground');
      // Resume game if it was paused
      window.dispatchEvent(new CustomEvent('app:foreground'));
    } else {
      console.log('App is now in background');
      // Pause game and save state
      window.dispatchEvent(new CustomEvent('app:background'));
      
      // Flag player as temporarily unavailable in Supabase
      await flagPlayerAsAway();
    }
  });

  // Handle app termination
  App.addListener('appUrlOpen', async (data: any) => {
    console.log('App opened with URL:', data.url);
    handleOAuthCallback(data.url);
  });
}

/**
 * Flag player as away in Supabase (60-second grace period)
 */
async function flagPlayerAsAway() {
  try {
    const userId = localStorage.getItem('supabase_user_id');
    if (!userId) return;

    // Update user profile with away status
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
        },
        body: JSON.stringify({
          status: 'away',
          last_seen: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update player status: ${response.statusText}`);
    }

    // Set a 60-second timer to mark as offline if app doesn't return
    setTimeout(async () => {
      const currentStatus = localStorage.getItem('player_status');
      if (currentStatus === 'away') {
        await fetch(
          `${process.env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
            },
            body: JSON.stringify({ status: 'offline' }),
          }
        );
      }
    }, 60000);
  } catch (error) {
    console.error('Error flagging player as away:', error);
  }
}

/**
 * Handle OAuth callback from deep-link
 */
async function handleOAuthCallback(url: string) {
  try {
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');
    const state = urlObj.searchParams.get('state');

    if (!code) {
      console.error('No authorization code in callback');
      return;
    }

    // Exchange code for session token with Supabase
    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/callback?code=${code}&state=${state}`,
      {
        method: 'GET',
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY,
        },
      }
    );

    if (response.ok) {
      const session = await response.json();
      localStorage.setItem('supabase_token', session.session.access_token);
      localStorage.setItem('supabase_user_id', session.session.user.id);
      
      // Redirect to home page
      window.location.href = '/';
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
  }
}

/**
 * Lock screen to landscape orientation for gameplay
 */
export async function lockGameplayOrientation() {
  try {
    await ScreenOrientation.lock({ orientation: 'landscape' });
    await StatusBar.hide();
  } catch (error) {
    console.error('Failed to lock orientation:', error);
  }
}

/**
 * Unlock screen orientation for menu
 */
export async function unlockMenuOrientation() {
  try {
    await ScreenOrientation.unlock();
    await StatusBar.show();
  } catch (error) {
    console.error('Failed to unlock orientation:', error);
  }
}

/**
 * Open external URL in browser
 */
export async function openExternalURL(url: string) {
  try {
    await Browser.open({ url });
  } catch (error) {
    console.error('Failed to open URL:', error);
  }
}
```

### push-notifications.ts

```typescript
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';

/**
 * Initialize push notifications and request user permission
 */
export async function initializePushNotifications() {
  try {
    // Request permission from user
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
      // Permission granted, register for push notifications
      await PushNotifications.register();
      
      // Get the device token
      const token = await PushNotifications.getDeliveryToken();
      console.log('Push notification token:', token.value);
      
      // Send token to Supabase for storage
      await savePushTokenToSupabase(token.value);
      
      // Set up push notification listeners
      setupPushNotificationListeners();
    } else {
      console.warn('Push notification permission denied');
    }
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
  }
}

/**
 * Save push notification token to Supabase
 */
async function savePushTokenToSupabase(token: string) {
  try {
    const userId = localStorage.getItem('supabase_user_id');
    const deviceInfo = await Device.getInfo();
    
    if (!userId) return;

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/push_tokens`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
        },
        body: JSON.stringify({
          user_id: userId,
          token: token,
          platform: deviceInfo.platform,
          device_model: deviceInfo.model,
          os_version: deviceInfo.osVersion,
          created_at: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to save push token: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error saving push token:', error);
  }
}

/**
 * Set up listeners for incoming push notifications
 */
function setupPushNotificationListeners() {
  // Handle notification when app is in foreground
  PushNotifications.addListener(
    'pushNotificationReceived',
    (notification: any) => {
      console.log('Push notification received:', notification);
      
      const title = notification.title || 'Chess 3D';
      const message = notification.body || 'You have a new notification';
      
      // Display local notification
      displayLocalNotification(title, message, notification.data);
    }
  );

  // Handle notification tap
  PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (notification: any) => {
      console.log('Push notification tapped:', notification);
      
      const data = notification.notification.data;
      
      // Handle different notification types
      if (data.type === 'match_found') {
        // Redirect to game
        window.location.href = `/game/${data.match_id}`;
      } else if (data.type === 'opponent_moved') {
        // Refresh game state
        window.dispatchEvent(new CustomEvent('game:opponentMoved', { detail: data }));
      } else if (data.type === 'game_invite') {
        // Show invitation dialog
        window.dispatchEvent(new CustomEvent('game:invitation', { detail: data }));
      }
    }
  );

  // Handle registration error
  PushNotifications.addListener('registrationError', (error: any) => {
    console.error('Push notification registration error:', error);
  });
}

/**
 * Display a local notification
 */
function displayLocalNotification(title: string, message: string, data?: any) {
  // Use browser Notification API as fallback
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/assets/icon-192x192.png',
      tag: 'chess-3d',
      data: data,
    });
  }
}

/**
 * Send a test push notification (for development)
 */
export async function sendTestNotification() {
  try {
    // This would typically be called from your backend
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/send-push-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
        },
        body: JSON.stringify({
          title: 'Test Notification',
          message: 'This is a test push notification',
          type: 'test',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send test notification: ${response.statusText}`);
    }

    console.log('Test notification sent');
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
}
```

### app-lifecycle.ts

```typescript
import { App } from '@capacitor/app';

/**
 * Handle app state changes and implement state resilience
 */
export function setupAppLifecycleHandlers() {
  // Track app state
  let appState = 'active';
  let gameState: any = null;

  // Listen for app state changes
  App.addListener('appStateChange', async (state) => {
    appState = state.isActive ? 'active' : 'background';
    
    if (state.isActive) {
      handleAppRestore();
    } else {
      handleAppBackground();
    }
  });

  /**
   * Called when app comes to foreground
   */
  async function handleAppRestore() {
    console.log('App restored to foreground');
    
    try {
      // Check if player was in a game
      const gameId = localStorage.getItem('current_game_id');
      if (!gameId) return;

      // Fetch current game state from Supabase
      const response = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/games?id=eq.${gameId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
          },
        }
      );

      if (response.ok) {
        const games = await response.json();
        if (games.length > 0) {
          gameState = games[0];
          
          // Restore game UI
          window.dispatchEvent(new CustomEvent('game:restore', { detail: gameState }));
          
          // Update player status to active
          await updatePlayerStatus('active');
        }
      }
    } catch (error) {
      console.error('Error restoring game state:', error);
    }
  }

  /**
   * Called when app goes to background
   */
  async function handleAppBackground() {
    console.log('App moved to background');
    
    try {
      // Save current game state
      const gameId = localStorage.getItem('current_game_id');
      if (gameId) {
        // Trigger game save event
        window.dispatchEvent(new CustomEvent('game:save'));
        
        // Update player status to away (60-second grace period)
        await updatePlayerStatus('away');
      }
    } catch (error) {
      console.error('Error handling app background:', error);
    }
  }

  /**
   * Update player status in Supabase
   */
  async function updatePlayerStatus(status: 'active' | 'away' | 'offline') {
    try {
      const userId = localStorage.getItem('supabase_user_id');
      if (!userId) return;

      const response = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
          },
          body: JSON.stringify({
            status: status,
            last_seen: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update player status: ${response.statusText}`);
      }

      console.log(`Player status updated to: ${status}`);
    } catch (error) {
      console.error('Error updating player status:', error);
    }
  }
}
```

### main.ts (Web Entry Point)

```typescript
import { initializeNativeBridge } from './native-bridge';
import { setupAppLifecycleHandlers } from './app-lifecycle';

// Initialize native bridge when app loads
if (window.Capacitor) {
  initializeNativeBridge();
  setupAppLifecycleHandlers();
}

// Your existing web app initialization code
import('./web-app-main');
```

---

## Build & Deployment

### iOS Build

```bash
# Sync web assets to iOS project
npx cap sync ios

# Open iOS project in Xcode
npx cap open ios

# In Xcode:
# 1. Select the App target
# 2. Set your team ID in Signing & Capabilities
# 3. Build and run on simulator or device
# 4. Product → Archive for App Store submission
```

### Android Build

```bash
# Sync web assets to Android project
npx cap sync android

# Open Android project in Android Studio
npx cap open android

# In Android Studio:
# 1. Build → Generate Signed Bundle / APK
# 2. Select Release configuration
# 3. Sign with your keystore
# 4. Upload to Google Play Console
```

### Continuous Deployment

```bash
# Update web app
npm run build

# Sync changes to native projects
npx cap sync

# Commit and push
git add .
git commit -m "Update native app with latest web changes"
git push origin main
```

---

## Testing & Troubleshooting

### Local Testing on Emulators

```bash
# iOS Simulator
npx cap run ios

# Android Emulator
npx cap run android
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Push notifications not received | Verify Firebase/APNs configuration; check token is saved to Supabase |
| OAuth callback not triggered | Ensure URL scheme is registered in native manifests; test with deep-link tester |
| Canvas rendering issues | Enable hardware acceleration in WebView settings; check Three.js WebGL context |
| Orientation lock not working | Verify ScreenOrientation plugin is installed; check native permissions |
| App crashes on background | Implement proper state saving in app-lifecycle.ts; test with memory profiler |

### Debug Logging

```typescript
// Enable verbose logging
localStorage.setItem('debug_mode', 'true');

// View logs in native debuggers
// iOS: Xcode Console
// Android: Android Studio Logcat
```

---

## Appendix: Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
FIREBASE_PROJECT_ID=chess-3d-mobile
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

---

## Next Steps

1. **Test on physical devices** before submitting to app stores
2. **Configure Firebase Cloud Messaging** for Android push notifications
3. **Set up Apple Push Notification service** for iOS
4. **Submit to Google Play Store** and **Apple App Store**
5. **Monitor crash reports** and **user feedback** after launch
6. **Iterate on performance** based on real-world usage data

---

**Document Version**: 1.0  
**Last Updated**: June 4, 2026  
**Author**: Manus AI
