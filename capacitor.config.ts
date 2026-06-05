import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chess3d.mobile',
  appName: 'Chess 3D',
  webDir: 'dist',

  // Use HTTPS scheme in WebView (required for OAuth, Supabase)
   server: {
   androidScheme: 'https',
   allowNavigation: ['fonts.googleapis.com', 'fonts.gstatic.com'],

  },

  plugins: {
    // Immersive status bar matching the chess app aesthetic
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0806',
      overlaysWebView: true,
    },

    // Screen orientation — locked to landscape during gameplay
    ScreenOrientation: {
      // Controlled programmatically by the app
    },
  },

  // Custom URL scheme for Google OAuth deep-linking
  ios: {
    scheme: 'chess3d',
  },

  android: {
    scheme: 'chess3d',
    // Enable hardware acceleration for Three.js WebGL rendering
    webViewConfiguration: {
      hardwareAccelerated: true,
    },
    // Allow the WebView to handle the chess3d:// scheme
    allowMixedContent: false,
  },
};

export default config;
