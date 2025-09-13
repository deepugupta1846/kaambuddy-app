/**
 * KaamBuddy React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/components/SplashScreen.jsx';
import AuthWrapper from './src/components/AuthWrapper.jsx';
import colors from './src/theme/colors';
import { AuthProvider } from './src/context/AuthContext';
import { JobProvider } from './src/context/JobContext';
import { BookingProvider } from './src/context/BookingContext';
import { NotificationProvider } from './src/context/NotificationContext';

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';

  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={true}
      />
      <AuthProvider>
        <JobProvider>
          <BookingProvider>
            <NotificationProvider>
              {isSplashVisible ? (
                <SplashScreen onFinish={handleSplashFinish} />
              ) : (
                <AuthWrapper />
              )}
            </NotificationProvider>
          </BookingProvider>
        </JobProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
