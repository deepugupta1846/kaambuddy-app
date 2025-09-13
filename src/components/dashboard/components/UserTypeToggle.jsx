import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './UserTypeToggle.styles';

const UserTypeToggle = ({ userType, setUserType }) => {
  return (
    <View style={styles.userTypeToggle}>
      <TouchableOpacity 
        style={[
          styles.toggleButton, 
          userType === 'customer' && styles.activeToggleButton
        ]}
        onPress={() => setUserType('customer')}
      >
        <Text style={[
          styles.toggleText,
          userType === 'customer' && styles.activeToggleText
        ]}>👤 Customer</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.toggleButton, 
          userType === 'worker' && styles.activeToggleButton
        ]}
        onPress={() => setUserType('worker')}
      >
        <Text style={[
          styles.toggleText,
          userType === 'worker' && styles.activeToggleText
        ]}>🔧 Worker</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserTypeToggle;




