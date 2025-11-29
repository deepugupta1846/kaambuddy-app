import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './ServicesTab.styles';
import { useServices } from '../../../context/ServiceContext';
import ServiceNavigation from '../components/ServiceNavigation';
import WorkersList from '../components/WorkersList';

const ServicesTab = ({ userType }) => {
  const { services, isLoading, error, loadServices } = useServices();
  const [showServiceNavigation, setShowServiceNavigation] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showWorkersList, setShowWorkersList] = useState(false);

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
      <View style={styles.content}>
        <Text style={styles.tabTitle}>All Services</Text>
        <View style={[styles.servicesContainer, { justifyContent: 'center', padding: 20 }]}>
          <ActivityIndicator size="large" color="#fdd017" />
        </View>
      </View>
    );
  }

  if (error && services.length === 0) {
    return (
      <View style={styles.content}>
        <Text style={styles.tabTitle}>All Services</Text>
        <View style={[styles.servicesContainer, { justifyContent: 'center', padding: 20 }]}>
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
      <View style={styles.content}>
        <Text style={styles.tabTitle}>All Services</Text>
        
        {services.length === 0 ? (
          <View style={styles.servicesContainer}>
            <Text style={styles.emptyText}>No services available</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.servicesContainer}>
              {services.map((service, index) => (
                <TouchableOpacity 
                  key={service.id || service._id || index} 
                  style={styles.serviceCard}
                  onPress={() => handleServiceClick(service)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.serviceIcon}>{service.icon || '🔧'}</Text>
                  <Text style={styles.serviceName} numberOfLines={2}>
                    {service.name}
                  </Text>
                  {service.description && (
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      {service.description}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowWorkersList(true)}
        activeOpacity={0.8}
      >
        <Icon name="user-tie" size={20} color="#ffffff" solid />
        <Text style={styles.fabText}>Consult Our Experienced Worker</Text>
      </TouchableOpacity>

      {/* Service Navigation Modal */}
      <ServiceNavigation
        visible={showServiceNavigation}
        service={selectedService}
        onClose={handleCloseNavigation}
      />

      {/* Workers List Modal */}
      <WorkersList
        visible={showWorkersList}
        onClose={() => setShowWorkersList(false)}
      />
    </>
  );
};

export default ServicesTab;




