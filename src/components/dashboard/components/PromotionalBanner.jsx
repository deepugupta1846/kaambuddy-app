import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './PromotionalBanner.styles';

const PromotionalBanner = ({ 
  title = "Home painting & waterproofing",
  subtitle = "Pay after 100% satisfaction",
  imageSource,
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {imageSource && (
          <Image 
            source={imageSource} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PromotionalBanner;

