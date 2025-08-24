import React, { useState } from 'react';
import LoginScreen from './LoginScreen.jsx';
import SignupScreen from './SignupScreen.jsx';
import OTPVerificationScreen from './OTPVerificationScreen.jsx';
import SignupSuccessScreen from './SignupSuccessScreen.jsx';
import Dashboard from './dashboard/Dashboard.jsx';

const AuthWrapper = () => {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'signup', 'otp', 'success', 'dashboard'
  const [signupData, setSignupData] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleLogin = (userData) => {
    setUserData(userData);
    setCurrentScreen('dashboard');
  };

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
    setUserData(data);
    setCurrentScreen('success');
  };

  const handleGoToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUserData(null);
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
          onLogin={handleLogin}
          onSwitchToSignup={handleNavigateToSignup}
        />
      );
    case 'signup':
      return (
        <SignupScreen
          onSignup={handleLogin}
          onNavigateToLogin={handleNavigateToLogin}
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
          userData={userData}
          onGoToDashboard={handleGoToDashboard}
        />
      );
           case 'dashboard':
         return <Dashboard onLogout={handleLogout} userData={userData} />;
    default:
      return (
        <LoginScreen
          onLogin={handleLogin}
          onSwitchToSignup={handleNavigateToSignup}
        />
      );
  }
};

export default AuthWrapper;
