import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Session timeout management (24 hours)
  useEffect(() => {
    if (isAuthenticated) {
      const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      const checkSessionTimeout = () => {
        const now = Date.now();
        if (now - lastActivity > SESSION_TIMEOUT) {
          console.log('Session timeout - logging out user');
          logout();
        }
      };

      // Check every 5 minutes
      const interval = setInterval(checkSessionTimeout, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, lastActivity]);

  // Update last activity on user interaction
  const updateLastActivity = () => {
    setLastActivity(Date.now());
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await apiService.getAuthToken();
      
      if (token) {
        try {
          // First try to get user data from storage for faster loading
          const storedUserData = await apiService.getUserData();
          if (storedUserData) {
            console.log('Loading user data from storage:', storedUserData);
            setUser(storedUserData);
            setIsAuthenticated(true);
          }

          // Then verify token with backend and update if needed
          const userData = await apiService.getCurrentUser();
          if (userData.success) {
            console.log('Verified user data from backend:', userData.data);
            setUser(userData.data);
            setIsAuthenticated(true);
            // Update stored user data with fresh data from backend
            await apiService.setUserData(userData.data);
          }
        } catch (backendError) {
          console.error('Backend verification failed:', backendError);
          // If backend verification fails, still use stored data if available
          if (storedUserData) {
            console.log('Using stored user data due to backend error');
            setUser(storedUserData);
            setIsAuthenticated(true);
          } else {
            throw backendError;
          }
        }
      } else {
        // No token, check if there's stored user data to clear
        const storedUserData = await apiService.getUserData();
        if (storedUserData) {
          console.log('No token but found stored user data, clearing...');
          await apiService.logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens and user data
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(phoneNumber);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber, otp) => {
    try {
      setIsLoading(true);
      const response = await apiService.verifyOTP(phoneNumber, otp);
      
      console.log('OTP Verification Response:', response);
      
      if (response.success) {
        // Store token and user data
        await apiService.setAuthToken(response.data.token);
        await apiService.setUserData(response.data.user);
        
        console.log('Setting user data:', response.data.user);
        setUser(response.data.user);
        setIsAuthenticated(true);
        updateLastActivity();
      }
      
      return response;
    } catch (error) {
      console.error('OTP Verification Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (phoneNumber) => {
    try {
      setIsLoading(true);
      const response = await apiService.sendOtp(phoneNumber);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await apiService.register(userData);
      
      console.log('Registration Response:', response);
      
      if (response.success) {
        // Store token and user data
        await apiService.setAuthToken(response.data.token);
        await apiService.setUserData(response.data.user);
        
        console.log('Setting user data after registration:', response.data.user);
        setUser(response.data.user);
        setIsAuthenticated(true);
        updateLastActivity();
      }
      
      return response;
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      const response = await apiService.updateUserProfile(profileData);
      
      if (response.success) {
        // Update local user data
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        await apiService.setUserData(updatedUser);
      }
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      if (userData.success) {
        setUser(userData.data);
        await apiService.setUserData(userData.data);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Fallback to stored user data if backend fails
      const storedUserData = await apiService.getUserData();
      if (storedUserData) {
        setUser(storedUserData);
      }
    }
  };

  // Get user data from storage (offline mode)
  const getUserFromStorage = async () => {
    try {
      const storedUserData = await apiService.getUserData();
      if (storedUserData) {
        setUser(storedUserData);
        setIsAuthenticated(true);
        return storedUserData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  };

  // Check if user data exists in storage
  const hasStoredUserData = async () => {
    try {
      const token = await apiService.getAuthToken();
      const userData = await apiService.getUserData();
      return !!(token && userData);
    } catch (error) {
      console.error('Error checking stored user data:', error);
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    verifyOTP,
    resendOTP,
    register,
    logout,
    updateProfile,
    refreshUserData,
    getUserFromStorage,
    hasStoredUserData,
    updateLastActivity,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
