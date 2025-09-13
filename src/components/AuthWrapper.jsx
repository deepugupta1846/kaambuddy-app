import React, { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen.jsx';
import SignupScreen from './SignupScreen.jsx';
import OTPVerificationScreen from './OTPVerificationScreen.jsx';
import SignupSuccessScreen from './SignupSuccessScreen.jsx';
import Dashboard from './dashboard/Dashboard.jsx';
import { useAuth } from '../context/AuthContext';

const AuthWrapper = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'signup', 'otp', 'success'
  const [signupData, setSignupData] = useState(null);

  // Check if user is authenticated and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentScreen('dashboard');
    }
  }, [isAuthenticated, user]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return null; // or a loading component
  }

  // If user is authenticated, show dashboard
  if (isAuthenticated && user) {
    return <Dashboard userData={user} />;
  }

  const handleNavigateToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleNavigateToOTP = (data) => {
    setSignupData(data);
    setCurrentScreen('otp');
  };

  const handleOTPVerificationSuccess = (data) => {
    setCurrentScreen('success');
  };

  const handleGoToDashboard = () => {
    // After successful signup, redirect to login screen
    // Clear any stored user data and signup data
    setUserData(null);
    setSignupData(null);
    setCurrentScreen('login');
  };

  const handleLogout = () => {
    setSignupData(null);
    setCurrentScreen('login');
  };

  const handleGoBack = () => {
    switch (currentScreen) {
      case 'otp':
        setCurrentScreen('signup');
        break;
      case 'success':
        setCurrentScreen('otp');
        break;
      default:
        setCurrentScreen('login');
    }
  };

  switch (currentScreen) {
    case 'login':
      return (
        <LoginScreen
          onSwitchToSignup={handleNavigateToSignup}
        />
      );
    case 'signup':
      return (
        <SignupScreen
          onSwitchToLogin={handleNavigateToLogin}
          onNavigateToOTP={handleNavigateToOTP}
        />
      );
    case 'otp':
      return (
        <OTPVerificationScreen
          signupData={signupData}
          onVerificationSuccess={handleOTPVerificationSuccess}
          onGoBack={handleGoBack}
        />
      );
    case 'success':
      return (
        <SignupSuccessScreen
          userData={signupData}
          onGoToDashboard={handleGoToDashboard}
        />
      );
    default:
      return (
        <LoginScreen
          onSwitchToSignup={handleNavigateToSignup}
        />
      );
  }
};

export default AuthWrapper;
