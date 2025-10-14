import React from 'react';
import { View, Text } from 'react-native';
import styles from './EarningsTab.styles';

const EarningsTab = ({ userType }) => {
  console.log('EarningsTab: User type:', userType);
  
  return (
    <View style={styles.content}>
      <Text style={styles.tabTitle}>
        {userType === 'customer' ? 'Payments & History' : 'Earnings & Payments'}
      </Text>
      <Text style={styles.comingSoon}>
        {userType === 'customer' 
          ? 'Payment history tracking coming soon!' 
          : 'Earnings tracking coming soon!'
        }
      </Text>
    </View>
  );
};

export default EarningsTab;






