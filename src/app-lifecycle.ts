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

      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseToken = localStorage.getItem('supabase_token');
      
      if (!supabaseUrl || !supabaseToken) return;

      // Fetch current game state from Supabase
      const response = await fetch(
        `${supabaseUrl}/rest/v1/games?id=eq.${gameId}`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseToken}`,
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
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseToken = localStorage.getItem('supabase_token');
      
      if (!userId || !supabaseUrl || !supabaseToken) return;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseToken}`,
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
