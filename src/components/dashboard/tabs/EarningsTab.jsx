import React from 'react';
import { View, Text } from 'react-native';
import styles from './EarningsTab.styles';

const EarningsTab = () => {
  return (
    <View style={styles.content}>
      <Text style={styles.tabTitle}>Earnings & Payments</Text>
      <Text style={styles.comingSoon}>Payment tracking coming soon!</Text>
    </View>
  );
};

export default EarningsTab;


