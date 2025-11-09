import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import TopBar from './TopBar';
import BottomNavigation from './BottomNavigation';
import HomeTab from './tabs/HomeTab';
import BookingsTab from './tabs/BookingsTab';
import ServicesTab from './tabs/ServicesTab';
import ChatTab from './tabs/ChatTab';
import EarningsTab from './tabs/EarningsTab';
import ProfileTab from './tabs/ProfileTab';
import SettingsScreen from './SettingsScreen';
import styles from './Dashboard.styles';
import { useAuth } from '../../context/AuthContext';
import { ChatProvider } from '../../context/ChatContext';

const Dashboard = ({ userData }) => {
  const { user, logout } = useAuth();
  const currentUserData = user || userData;
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  
  // Get user type from logged-in user data (no longer toggleable)
  const userType = currentUserData?.userType || 'customer';
  
  console.log('Dashboard: Current user type:', userType);
  console.log('Dashboard: Current user data:', currentUserData);

  // Reset active tab to home when user type changes
  useEffect(() => {
    setActiveTab('home');
  }, [userType]);

  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  const handleNotificationPress = () => {
    // TODO: Handle notification press
    console.log('Notification pressed');
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab userType={userType} />;
      case 'bookings':
        return <BookingsTab userType={userType} />;
      case 'services':
        return <ServicesTab userType={userType} />;
      case 'chat':
        return <ChatTab />;
      case 'earnings':
        return <EarningsTab userType={userType} />;
      case 'profile':
        return <ProfileTab userData={currentUserData} />;
      default:
        return null;
    }
  };

  return (
    <ChatProvider>
      <View style={styles.container}>
        <StatusBar backgroundColor="#fdd017" barStyle="light-content" translucent={true} />
        
        <TopBar 
          onSettingsPress={handleSettingsPress}
          onNotificationPress={handleNotificationPress}
        />
        {renderContent()}
        <BottomNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userType={userType} 
        />
        
        {/* Settings Screen */}
        <SettingsScreen 
          visible={showSettings}
          onClose={handleCloseSettings}
        />
      </View>
    </ChatProvider>
  );
};

export default Dashboard;
