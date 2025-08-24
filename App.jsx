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
      {isSplashVisible ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <AuthWrapper />
      )}
    </SafeAreaProvider>
  );
}

export default App;
