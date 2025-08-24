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

const Dashboard = ({ onLogout, userData }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [userType, setUserType] = useState(userData?.userType || 'customer'); // 'customer' or 'worker'

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
         return <ProfileTab onLogout={onLogout} userData={userData} />;
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
