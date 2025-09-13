import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import TopBar from './TopBar';
import BottomNavigation from './BottomNavigation';
import HomeTab from './tabs/HomeTab';
import BookingsTab from './tabs/BookingsTab';
import ServicesTab from './tabs/ServicesTab';
import EarningsTab from './tabs/EarningsTab';
import ProfileTab from './tabs/ProfileTab';
import styles from './Dashboard.styles';
import { useAuth } from '../../context/AuthContext';

const Dashboard = ({ userData }) => {
  const { user, logout } = useAuth();
  const currentUserData = user || userData;
  const [activeTab, setActiveTab] = useState('home');
  const [userType, setUserType] = useState(currentUserData?.userType || 'customer'); // 'customer' or 'worker'

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab userType={userType} setUserType={setUserType} />;
      case 'bookings':
        return <BookingsTab userType={userType} />;
      case 'services':
        return <ServicesTab userType={userType} />;
      case 'earnings':
        return <EarningsTab />;
                     case 'profile':
          return <ProfileTab onLogout={logout} userData={currentUserData} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fdd017" barStyle="light-content" translucent={true} />
      
      <TopBar />
      {renderContent()}
      <BottomNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userType={userType} 
      />
    </View>
  );
};

export default Dashboard;
