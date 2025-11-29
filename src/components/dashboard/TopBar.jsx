import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './TopBar.styles';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ onSettingsPress, onNotificationPress }) => {
  const { locationName, isLoading, hasPermission, refreshLocation } = useLocation();
  const { user } = useAuth();
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <Text style={styles.topBarTitle}>{user?.name || 'User'}</Text>
        {hasPermission && (
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={refreshLocation}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" style={styles.locationLoader} />
            ) : (
              <Icon name="map-marker-alt" size={12} color="#ffffff" solid style={styles.locationIcon} />
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
          <Icon name="bell" size={20} color="#ffffff" solid />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.topBarButton}
          onPress={onSettingsPress}
        >
          <Icon name="cog" size={20} color="#ffffff" solid />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;






