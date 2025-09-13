import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './TopBar.styles';

const TopBar = () => {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <Text style={styles.topBarTitle}>KaamBuddy</Text>
      </View>
      <View style={styles.topBarRight}>
        <TouchableOpacity style={styles.topBarButton}>
          <Text style={styles.topBarButtonText}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBarButton}>
          <Text style={styles.topBarButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;




