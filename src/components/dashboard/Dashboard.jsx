import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import TopBar from './TopBar';
import BottomNavigation from './BottomNavigation';
import HomeTab from './tabs/HomeTab';
import BookingsTab from './tabs/BookingsTab';
import ServicesTab from './tabs/ServicesTab';
// import ChatTab from './tabs/ChatTab';
import CartTab from './tabs/CartTab';
import EarningsTab from './tabs/EarningsTab';
import ProfileTab from './tabs/ProfileTab';
import SettingsScreen from './SettingsScreen';
import styles from './Dashboard.styles';
import JobDetailsScreen from './components/JobDetailsScreen';
import { useAuth } from '../../context/AuthContext';
import { ChatProvider } from '../../context/ChatContext';
import permissionService from '../../utils/permissions';

const Dashboard = ({ userData }) => {
  const { user, logout } = useAuth();
  const currentUserData = user || userData;
  const [activeTab, setActiveTab] = useState('home');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Get user type from logged-in user data (no longer toggleable)
  const userType = currentUserData?.userType || 'customer';
  
  console.log('Dashboard: Current user type:', userType);
  console.log('Dashboard: Current user data:', currentUserData);

  // Reset active tab to home when user type changes
  useEffect(() => {
    setActiveTab('home');
  }, [userType]);

  // Request permissions when dashboard loads
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await permissionService.requestAllPermissions();
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    };

    // Request permissions after a short delay to allow UI to render
    const timer = setTimeout(() => {
      requestPermissions();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
        return (
          <HomeTab
            userType={userType}
          />
        );
      case 'bookings':
        return <BookingsTab userType={userType} />;
      case 'services':
        return <ServicesTab userType={userType} />;
      // case 'chat':
      //   return <ChatTab />;
      case 'cart':
        return <CartTab />;
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
          activeTab={activeTab}
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
