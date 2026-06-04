import { initializeNativeBridge } from './native-bridge';
import { setupAppLifecycleHandlers } from './app-lifecycle';

/**
 * Initialize native bridge when app loads
 */
if (window.Capacitor) {
  initializeNativeBridge();
  setupAppLifecycleHandlers();
  console.log('Capacitor native bridge initialized');
}

/**
 * Your existing web app initialization code goes here
 * Import and initialize your Three.js chess app, Supabase client, etc.
 */

console.log('Chess 3D Mobile App initialized');
