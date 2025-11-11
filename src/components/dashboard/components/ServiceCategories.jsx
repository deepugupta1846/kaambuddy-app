import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './ServiceCategories.styles';
import { getMainServices } from '../../../data/servicesData';
import ServiceNavigation from './ServiceNavigation';

const ServiceCategories = () => {
  const [showServiceNavigation, setShowServiceNavigation] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const services = getMainServices();

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowServiceNavigation(true);
  };

  const handleCloseNavigation = () => {
    setShowServiceNavigation(false);
    setSelectedService(null);
  };

  return (
    <>
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Find Services</Text>
        <View style={styles.actionGrid}>
          {services.map((service, index) => (
            <TouchableOpacity 
              key={service.id || index} 
              style={styles.actionCard}
              onPress={() => handleServiceClick(service)}
            >
              <Text style={styles.actionIcon}>{service.icon}</Text>
              <Text style={styles.actionText}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Service Navigation Modal */}
      <ServiceNavigation
        visible={showServiceNavigation}
        service={selectedService}
        onClose={handleCloseNavigation}
      />
    </>
  );
};

export default ServiceCategories;








