import React from 'react';
import { View, Text } from 'react-native';
import styles from './StatsCards.styles';

const StatsCards = ({ stats }) => {
  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <Text style={styles.statNumber}>{stat.number}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default StatsCards;




