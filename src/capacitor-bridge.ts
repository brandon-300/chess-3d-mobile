// capacitor-bridge.ts — Minimal native bridge for Chess 3D
// Handles: status bar, orientation lock, OAuth deep-linking

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { App } from '@capacitor/app';

let bridgeInitialized = false;

/**
 * Initialize native features on app startup.
 * Safe to call on web — exits early if not on a native platform.
 */
export async function initializeCapacitorBridge(): Promise<void> {
  if (bridgeInitialized) return;

  try {
    // Only proceed if running on a real device
    if (!Capacitor.isNativePlatform()) {
      console.log('Not running on native platform — skipping Capacitor bridge');
      return;
    }

    // 1. Configure status bar — dark overlay matching chess aesthetic
    await StatusBar.setBackgroundColor({ color: '#0a0806' });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setOverlaysWebView({ overlay: true });
    console.log('Status bar configured');

    // 2. Listen for deep-link OAuth callbacks
    App.addListener('appUrlOpen', (data: { url: string }) => {
      handleDeepLink(data.url);
    });
    console.log('Deep-link listener registered');

    bridgeInitialized = true;
    console.log('Capacitor bridge initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Capacitor bridge:', error);
  }
}

/**
 * Lock screen to landscape orientation (for gameplay).
 */
export async function lockGameplayOrientation(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await ScreenOrientation.lock({ orientation: 'landscape' });
    await StatusBar.hide();
  } catch (error) {
    console.error('Failed to lock orientation:', error);
  }
}

/**
 * Unlock screen orientation (for menus).
 */
export async function unlockMenuOrientation(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await ScreenOrientation.unlock();
    await StatusBar.show();
  } catch (error) {
    console.error('Failed to unlock orientation:', error);
  }
}

/**
 * Handle deep-link OAuth callback from chess3d:// scheme.
 * Parses the authorization code and exchanges it with Supabase.
 */
function handleDeepLink(url: string): void {
  try {
    const urlObj = new URL(url);

    // Only handle OAuth callbacks
    if (urlObj.pathname !== '/oauth' && !urlObj.searchParams.has('code')) {
      return;
    }

    const code = urlObj.searchParams.get('code');
    if (!code) {
      console.error('Deep link missing authorization code');
      return;
    }

    // Dispatch a custom event so the main app can handle the exchange
    // This decouples the bridge from Supabase logic
    window.dispatchEvent(
      new CustomEvent('oauth:callback', {
        detail: { code, url },
      })
    );

    console.log('OAuth deep-link processed');
  } catch (error) {
    console.error('Failed to handle deep link:', error);
  }
}

/**
 * Listen for OAuth callback events (call from main.js init).
 * When triggered, the main app exchanges the code for a Supabase session.
 */
export function onOAuthCallback(handler: (code: string) => void): void {
  window.addEventListener('oauth:callback', ((e: CustomEvent) => {
    handler(e.detail.code);
  }) as EventListener);
}