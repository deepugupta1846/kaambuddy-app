import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './ServiceCategories.styles';

const ServiceCategories = () => {
  const services = [
    { icon: '🔧', name: 'Plumber' },
    { icon: '⚡', name: 'Electrician' },
    { icon: '🧹', name: 'Cleaner' },
    { icon: '🎨', name: 'Painter' },
    { icon: '👨‍🍳', name: 'Chef' },
    { icon: '🔍', name: 'More Services' },
  ];

  return (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Find Services</Text>
      <View style={styles.actionGrid}>
        {services.map((service, index) => (
          <TouchableOpacity key={index} style={styles.actionCard}>
            <Text style={styles.actionIcon}>{service.icon}</Text>
            <Text style={styles.actionText}>{service.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ServiceCategories;








