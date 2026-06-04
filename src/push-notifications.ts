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
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseToken = localStorage.getItem('supabase_token');
    
    if (!supabaseUrl || !supabaseToken) return;

    // This would typically be called from your backend
    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-push-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseToken}`,
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
