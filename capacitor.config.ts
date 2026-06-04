import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chess3d.mobile',
  appName: 'Chess 3D',
  webDir: 'dist',
  
  // Server configuration
  server: {
    androidScheme: 'https',
    cleartext: true,
    // Uncomment for local development
    // url: 'http://192.168.1.100:3000',
    // cleartext: true,
  },

  // Plugin configurations
  plugins: {
    // Push Notifications
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    // Status Bar
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0806',
      overlaysWebView: true,
    },

    // Keyboard
    Keyboard: {
      resize: 'none',
      resizeOnFullScreen: true,
    },

    // Screen Orientation
    ScreenOrientation: {
      // Controlled programmatically
    },
  },

  // iOS-specific configuration
  ios: {
    scheme: 'chess3d',
    // Enable hardware acceleration for WebGL
    webViewConfiguration: {
      allowsInlineMediaPlayback: true,
      mediaTypesRequiringUserActionForPlayback: [],
    },
  },

  // Android-specific configuration
  android: {
    scheme: 'chess3d',
    // Enable hardware acceleration
    webViewConfiguration: {
      hardwareAccelerated: true,
    },
  },
};

export default config;
