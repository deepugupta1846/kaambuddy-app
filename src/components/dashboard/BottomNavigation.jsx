import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './BottomNavigation.styles';
import colors from '../../theme/colors';

const BottomNavigation = ({ activeTab, setActiveTab, userType }) => {
  console.log('BottomNavigation: Rendering for user type:', userType);
  
  // Define tabs based on user type
  const getTabsForUserType = () => {
    if (userType === 'customer') {
      return [
        { key: 'home', iconName: 'home', label: 'Home' },
        { key: 'bookings', iconName: 'clipboard-list', label: 'Bookings' },
        { key: 'services', iconName: 'tools', label: 'Services' },
        { key: 'chat', iconName: 'comments', label: 'Chat' },
        { key: 'profile', iconName: 'user', label: 'Profile' }
      ];
    } else {
      // Worker tabs
      return [
        { key: 'home', iconName: 'home', label: 'Home' },
        { key: 'bookings', iconName: 'briefcase', label: 'Jobs' },
        { key: 'earnings', iconName: 'dollar-sign', label: 'Earnings' },
        { key: 'chat', iconName: 'comments', label: 'Chat' },
        { key: 'profile', iconName: 'user', label: 'Profile' }
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
          <Icon 
            name={tab.iconName} 
            size={24} 
            color={activeTab === tab.key ? colors.primary : colors.textSecondary}
            solid
            style={[styles.bottomTabIcon, activeTab === tab.key && styles.activeTabIcon]}
          />
          <Text style={[styles.bottomTabText, activeTab === tab.key && styles.activeTabText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavigation;





