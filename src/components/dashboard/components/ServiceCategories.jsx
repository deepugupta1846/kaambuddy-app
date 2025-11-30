import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './ServiceCategories.styles';
import ServiceNavigation from './ServiceNavigation';
import { useServices } from '../../../context/ServiceContext';

const ServiceCategories = () => {
  const { services, isLoading, error, loadServices } = useServices();
  const [showServiceNavigation, setShowServiceNavigation] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleServiceClick = useCallback((service) => {
    setSelectedService(service);
    setShowServiceNavigation(true);
  }, []);

  const handleCloseNavigation = useCallback(() => {
    setShowServiceNavigation(false);
    setSelectedService(null);
  }, []);

  if (isLoading && services.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.actionGrid, { justifyContent: 'center', padding: 20 }]}>
          <ActivityIndicator size="large" color="#fdd017" />
        </View>
      </View>
    );
  }

  if (error && services.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.actionGrid, { justifyContent: 'center', padding: 20 }]}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => loadServices()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.actionGrid}>
          {services.length > 0 ? (
            services.map((service, index) => (
              <TouchableOpacity 
                key={service.id || service._id || index} 
                style={styles.actionCard}
                onPress={() => handleServiceClick(service)}
                activeOpacity={0.7}
              >
                {service.onSale && (
                  <View style={styles.saleBadge}>
                    <Text style={styles.saleBadgeText}>Sale</Text>
                  </View>
                )}
                <Text style={styles.actionIcon}>{service.icon || '🔧'}</Text>
                <Text style={styles.actionText} numberOfLines={2}>
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No services available</Text>
          )}
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








