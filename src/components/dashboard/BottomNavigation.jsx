import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './BottomNavigation.styles';

const BottomNavigation = ({ activeTab, setActiveTab, userType }) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity 
        style={[styles.bottomTab, activeTab === 'home' && styles.activeTab]} 
        onPress={() => setActiveTab('home')}
      >
        <Text style={[styles.bottomTabIcon, activeTab === 'home' && styles.activeTabIcon]}>🏠</Text>
        <Text style={[styles.bottomTabText, activeTab === 'home' && styles.activeTabText]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bottomTab, activeTab === 'bookings' && styles.activeTab]} 
        onPress={() => setActiveTab('bookings')}
      >
        <Text style={[styles.bottomTabIcon, activeTab === 'bookings' && styles.activeTabIcon]}>
          {userType === 'customer' ? '📋' : '🔧'}
        </Text>
        <Text style={[styles.bottomTabText, activeTab === 'bookings' && styles.activeTabText]}>
          {userType === 'customer' ? 'Bookings' : 'Jobs'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bottomTab, activeTab === 'services' && styles.activeTab]} 
        onPress={() => setActiveTab('services')}
      >
        <Text style={[styles.bottomTabIcon, activeTab === 'services' && styles.activeTabIcon]}>🛠️</Text>
        <Text style={[styles.bottomTabText, activeTab === 'services' && styles.activeTabText]}>Services</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bottomTab, activeTab === 'chat' && styles.activeTab]} 
        onPress={() => setActiveTab('chat')}
      >
        <Text style={[styles.bottomTabIcon, activeTab === 'chat' && styles.activeTabIcon]}>💬</Text>
        <Text style={[styles.bottomTabText, activeTab === 'chat' && styles.activeTabText]}>Chat</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bottomTab, activeTab === 'earnings' && styles.activeTab]} 
        onPress={() => setActiveTab('earnings')}
      >
        <Text style={[styles.bottomTabIcon, activeTab === 'earnings' && styles.activeTabIcon]}>💰</Text>
        <Text style={[styles.bottomTabText, activeTab === 'earnings' && styles.activeTabText]}>Earnings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bottomTab, activeTab === 'profile' && styles.activeTab]} 
        onPress={() => setActiveTab('profile')}
      >
        <Text style={[styles.bottomTabIcon, activeTab === 'profile' && styles.activeTabIcon]}>👤</Text>
        <Text style={[styles.bottomTabText, activeTab === 'profile' && styles.activeTabText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;





