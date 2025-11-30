import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './TopBar.styles';
import { useLocation } from '../../context/LocationContext';

const TopBar = ({ activeTab, onSettingsPress, onNotificationPress }) => {
  const { locationName, refreshLocation } = useLocation();

  // Parse location name to extract area and full address
  const locationParts = locationName ? locationName.split(',') : [];
  const areaName = locationParts[0] || 'Select Location';
  const fullAddress = locationName || 'Tap to select location';

  const handleLocationPress = () => {
    refreshLocation();
  };


  // Show location header design for all tabs
  return (
    <View style={styles.topBarContainer}>
      <View style={styles.locationHeader}>
        <TouchableOpacity 
          style={styles.locationHeaderContainer}
          onPress={handleLocationPress}
          activeOpacity={0.7}
        >
          <Icon name="map-marker-alt" size={18} color="#333" solid />
          <View style={styles.locationTextContainer}>
            <Text style={styles.areaName}>{areaName}</Text>
            <View style={styles.addressRow}>
              <Text style={styles.fullAddress} numberOfLines={1}>
                {fullAddress}
              </Text>
              <Icon name="chevron-down" size={12} color="#666" solid />
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.rightIconsContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Icon name="bell" size={20} color="#333" solid />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <Icon name="cog" size={20} color="#333" solid />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TopBar;






