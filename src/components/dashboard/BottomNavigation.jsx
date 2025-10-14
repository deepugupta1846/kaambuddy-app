import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './BottomNavigation.styles';

const BottomNavigation = ({ activeTab, setActiveTab, userType }) => {
  console.log('BottomNavigation: Rendering for user type:', userType);
  
  // Define tabs based on user type
  const getTabsForUserType = () => {
    if (userType === 'customer') {
      return [
        { key: 'home', icon: '🏠', label: 'Home' },
        { key: 'bookings', icon: '📋', label: 'Bookings' },
        { key: 'services', icon: '🛠️', label: 'Services' },
        { key: 'chat', icon: '💬', label: 'Chat' },
        { key: 'profile', icon: '👤', label: 'Profile' }
      ];
    } else {
      // Worker tabs
      return [
        { key: 'home', icon: '🏠', label: 'Home' },
        { key: 'bookings', icon: '🔧', label: 'Jobs' },
        { key: 'earnings', icon: '💰', label: 'Earnings' },
        { key: 'chat', icon: '💬', label: 'Chat' },
        { key: 'profile', icon: '👤', label: 'Profile' }
      ];
    }
  };

  const tabs = getTabsForUserType();

  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab) => (
        <TouchableOpacity 
          key={tab.key}
          style={[styles.bottomTab, activeTab === tab.key && styles.activeTab]} 
          onPress={() => setActiveTab(tab.key)}
        >
          <Text style={[styles.bottomTabIcon, activeTab === tab.key && styles.activeTabIcon]}>
            {tab.icon}
          </Text>
          <Text style={[styles.bottomTabText, activeTab === tab.key && styles.activeTabText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavigation;





