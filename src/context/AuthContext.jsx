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

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await apiService.getAuthToken();
      
      if (token) {
        // Verify token with backend
        const userData = await apiService.getCurrentUser();
        setUser(userData.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      await apiService.logout();
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
      const response = await apiService.resendOTP(phoneNumber);
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
      return response;
    } catch (error) {
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
