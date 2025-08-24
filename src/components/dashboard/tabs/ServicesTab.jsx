import React from 'react';
import { View, Text } from 'react-native';
import styles from './ServicesTab.styles';

const ServicesTab = ({ userType }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.tabTitle}>
        {userType === 'customer' ? 'Available Services' : 'My Services'}
      </Text>
      <Text style={styles.comingSoon}>
        {userType === 'customer' 
          ? 'Service catalog coming soon!' 
          : 'Service management coming soon!'
        }
      </Text>
    </View>
  );
};

export default ServicesTab;


