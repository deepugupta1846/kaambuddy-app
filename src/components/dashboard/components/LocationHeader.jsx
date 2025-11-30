import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useLocation } from '../../../context/LocationContext';
import styles from './LocationHeader.styles';

const LocationHeader = ({ onLocationPress, onCartPress }) => {
  const { locationName } = useLocation();
  
  // Parse location name to extract area and full address
  const locationParts = locationName ? locationName.split(',') : [];
  const areaName = locationParts[0] || 'Select Location';
  const fullAddress = locationName || 'Tap to select location';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.locationContainer}
        onPress={onLocationPress}
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
      
      <TouchableOpacity 
        style={styles.cartButton}
        onPress={onCartPress}
        activeOpacity={0.7}
      >
        <Icon name="shopping-cart" size={20} color="#333" solid />
      </TouchableOpacity>
    </View>
  );
};

export default LocationHeader;

