import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for session management
 * Automatically updates last activity on user interactions
 */
export const useSession = () => {
  const { updateLastActivity, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Update activity on app state changes
    const handleAppStateChange = () => {
      updateLastActivity();
    };

    // Update activity on user interactions
    const handleUserInteraction = () => {
      updateLastActivity();
    };

    // Add event listeners for user activity
    const events = [
      'touchstart',
      'touchmove',
      'touchend',
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'click'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, true);
    });

    // Add app state change listener (for React Native)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleAppStateChange);
    }

    // Cleanup event listeners
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction, true);
      });
      
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleAppStateChange);
      }
    };
  }, [isAuthenticated, updateLastActivity]);

  return {
    updateLastActivity
  };
};

/**
 * Hook for checking session status
 */
export const useSessionStatus = () => {
  const { user, isAuthenticated, isLoading, hasStoredUserData } = useAuth();

  const checkSessionStatus = async () => {
    try {
      const hasData = await hasStoredUserData();
      return {
        hasStoredData: hasData,
        isAuthenticated,
        user,
        isLoading
      };
    } catch (error) {
      console.error('Error checking session status:', error);
      return {
        hasStoredData: false,
        isAuthenticated: false,
        user: null,
        isLoading: false
      };
    }
  };

  return {
    checkSessionStatus,
    isAuthenticated,
    user,
    isLoading
  };
};


