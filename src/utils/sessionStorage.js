import AsyncStorage from '@react-native-async-storage/async-storage';

// Session storage keys
export const SESSION_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SESSION_START: 'session_start',
  LAST_ACTIVITY: 'last_activity',
  SESSION_ID: 'session_id',
  APP_VERSION: 'app_version',
  DEVICE_ID: 'device_id',
};

// Session configuration
export const SESSION_CONFIG = {
  TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
  APP_VERSION: '1.0.0',
};

class SessionStorage {
  constructor() {
    this.sessionId = null;
    this.deviceId = null;
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate device ID
  generateDeviceId() {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize session
  async initializeSession() {
    try {
      // Get or create device ID
      let deviceId = await AsyncStorage.getItem(SESSION_KEYS.DEVICE_ID);
      if (!deviceId) {
        deviceId = this.generateDeviceId();
        await AsyncStorage.setItem(SESSION_KEYS.DEVICE_ID, deviceId);
      }
      this.deviceId = deviceId;

      // Create new session ID
      this.sessionId = this.generateSessionId();
      await AsyncStorage.setItem(SESSION_KEYS.SESSION_ID, this.sessionId);

      // Set session start time
      await AsyncStorage.setItem(SESSION_KEYS.SESSION_START, Date.now().toString());

      // Set app version
      await AsyncStorage.setItem(SESSION_KEYS.APP_VERSION, SESSION_CONFIG.APP_VERSION);

      console.log('Session initialized:', this.sessionId);
      return this.sessionId;
    } catch (error) {
      console.error('Error initializing session:', error);
      return null;
    }
  }

  // Start user session
  async startUserSession(userData, token) {
    try {
      // Initialize session if not already done
      if (!this.sessionId) {
        await this.initializeSession();
      }

      // Store user data and token
      await AsyncStorage.setItem(SESSION_KEYS.USER_DATA, JSON.stringify(userData));
      await AsyncStorage.setItem(SESSION_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(SESSION_KEYS.LAST_ACTIVITY, Date.now().toString());

      console.log('User session started for:', userData.name);
      return true;
    } catch (error) {
      console.error('Error starting user session:', error);
      return false;
    }
  }

  // Update last activity
  async updateLastActivity() {
    try {
      await AsyncStorage.setItem(SESSION_KEYS.LAST_ACTIVITY, Date.now().toString());
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  }

  // Check if session is expired
  async isSessionExpired() {
    try {
      const lastActivity = await AsyncStorage.getItem(SESSION_KEYS.LAST_ACTIVITY);
      if (!lastActivity) return true;

      const now = Date.now();
      const lastActivityTime = parseInt(lastActivity);
      const timeDiff = now - lastActivityTime;

      return timeDiff > SESSION_CONFIG.TIMEOUT;
    } catch (error) {
      console.error('Error checking session expiry:', error);
      return true;
    }
  }

  // Get session data
  async getSessionData() {
    try {
      const [userData, token, sessionId, lastActivity, deviceId] = await Promise.all([
        AsyncStorage.getItem(SESSION_KEYS.USER_DATA),
        AsyncStorage.getItem(SESSION_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(SESSION_KEYS.SESSION_ID),
        AsyncStorage.getItem(SESSION_KEYS.LAST_ACTIVITY),
        AsyncStorage.getItem(SESSION_KEYS.DEVICE_ID)
      ]);

      return {
        userData: userData ? JSON.parse(userData) : null,
        token,
        sessionId,
        lastActivity: lastActivity ? parseInt(lastActivity) : null,
        deviceId,
        isExpired: await this.isSessionExpired()
      };
    } catch (error) {
      console.error('Error getting session data:', error);
      return {
        userData: null,
        token: null,
        sessionId: null,
        lastActivity: null,
        deviceId: null,
        isExpired: true
      };
    }
  }

  // Clear session data
  async clearSession() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(SESSION_KEYS.USER_DATA),
        AsyncStorage.removeItem(SESSION_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(SESSION_KEYS.LAST_ACTIVITY),
        AsyncStorage.removeItem(SESSION_KEYS.SESSION_ID),
        AsyncStorage.removeItem(SESSION_KEYS.SESSION_START)
      ]);

      console.log('Session cleared');
      return true;
    } catch (error) {
      console.error('Error clearing session:', error);
      return false;
    }
  }

  // Get session info for debugging
  async getSessionInfo() {
    try {
      const sessionData = await this.getSessionData();
      const sessionStart = await AsyncStorage.getItem(SESSION_KEYS.SESSION_START);
      const appVersion = await AsyncStorage.getItem(SESSION_KEYS.APP_VERSION);

      return {
        ...sessionData,
        sessionStart: sessionStart ? parseInt(sessionStart) : null,
        appVersion,
        sessionDuration: sessionStart ? Date.now() - parseInt(sessionStart) : 0,
        timeSinceLastActivity: sessionData.lastActivity ? Date.now() - sessionData.lastActivity : 0
      };
    } catch (error) {
      console.error('Error getting session info:', error);
      return null;
    }
  }

  // Refresh session (extend expiry)
  async refreshSession() {
    try {
      const token = await AsyncStorage.getItem(SESSION_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(SESSION_KEYS.USER_DATA);
      
      if (token && userData) {
        await this.updateLastActivity();
        console.log('Session refreshed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  }
}

// Create singleton instance
const sessionStorage = new SessionStorage();
export default sessionStorage;



