import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './TopBar.styles';
import { useLocation } from '../../context/LocationContext';

const TopBar = ({ onSettingsPress, onNotificationPress }) => {
  const { locationName, isLoading, hasPermission, refreshLocation } = useLocation();

  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <Text style={styles.topBarTitle}>KaamBuddy</Text>
        {hasPermission && (
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={refreshLocation}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" style={styles.locationLoader} />
            ) : (
              <Text style={styles.locationIcon}>📍</Text>
            )}
            <Text style={styles.locationText} numberOfLines={1}>
              {locationName || 'Getting location...'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.topBarRight}>
        <TouchableOpacity 
          style={styles.topBarButton}
          onPress={onNotificationPress}
        >
          <Text style={styles.topBarButtonText}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.topBarButton}
          onPress={onSettingsPress}
        >
          <Text style={styles.topBarButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;






