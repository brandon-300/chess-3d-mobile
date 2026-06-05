// capacitor-bridge.ts — Minimal native bridge for Chess 3D
// Handles: status bar, orientation lock, OAuth deep-linking

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { App } from '@capacitor/app';

let bridgeInitialized = false;
let deepLinkHandle: PluginListenerHandle | null = null;

export async function initializeCapacitorBridge(): Promise<void> {
  if (bridgeInitialized) return;

  try {
    if (!Capacitor.isNativePlatform()) {
      console.log('Not running on native platform — skipping Capacitor bridge');
      return;
    }

    // 1. Configure status bar
    await StatusBar.setBackgroundColor({ color: '#0a0806' });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setOverlaysWebView({ overlay: true });
    console.log('Status bar configured');

    // 2. Listen for deep-link OAuth callbacks
    deepLinkHandle = await App.addListener('appUrlOpen', (data: { url: string }) => {
      try {
        const urlObj = new URL(data.url);
        if (urlObj.hostname === 'oauth') {
          const pending = sessionStorage.getItem('pendingGoogleAuth');
          if (pending === '1') {
            console.log('OAuth callback received while login page is active – ignoring in bridge');
            return;
          }
          window.location.href = 'index.html';
        }
      } catch (_) { /* ignore malformed URLs */ }
    });
    console.log('Deep-link listener registered');

    bridgeInitialized = true;
    console.log('Capacitor bridge initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Capacitor bridge:', error);
  }
}

export async function lockGameplayOrientation(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await ScreenOrientation.lock({ orientation: 'landscape' });
    await StatusBar.hide();
  } catch (error) {
    console.error('Failed to lock orientation:', error);
  }
}

export async function unlockMenuOrientation(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await ScreenOrientation.unlock();
    await StatusBar.show();
  } catch (error) {
    console.error('Failed to unlock orientation:', error);
  }
}