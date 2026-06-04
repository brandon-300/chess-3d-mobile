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
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseToken = localStorage.getItem('supabase_token');
    
    if (!supabaseUrl || !supabaseToken) return;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseToken}`,
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
          `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseToken}`,
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

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) return;

    // Exchange code for session token with Supabase
    const response = await fetch(
      `${supabaseUrl}/auth/v1/callback?code=${code}&state=${state}`,
      {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
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

/**
 * Initialize push notifications
 */
async function initializePushNotifications() {
  try {
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
      await PushNotifications.register();
      const token = await PushNotifications.getDeliveryToken();
      console.log('Push notification token:', token.value);
      
      // Save token to Supabase
      await savePushTokenToSupabase(token.value);
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
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseToken = localStorage.getItem('supabase_token');
    
    if (!userId || !supabaseUrl || !supabaseToken) return;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/push_tokens`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseToken}`,
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
