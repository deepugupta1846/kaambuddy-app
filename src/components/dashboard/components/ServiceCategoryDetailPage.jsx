import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import styles from './ServiceCategoryDetailPage.styles';
import { useServices } from '../../../context/ServiceContext';
import { useJobs } from '../../../context/JobContext';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import BookingForm from './BookingForm';
import colors from '../../../theme/colors';

const ServiceCategoryDetailPage = ({ service, category, onBack, onServiceSelect }) => {
  const { user } = useAuth();
  const { createJob, isLoading: isJobLoading } = useJobs();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { loadCategoryServices, categoryServices: allCategoryServices, isLoadingServices } = useServices();
  const [localServices, setLocalServices] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const serviceId = service?.id || service?._id;
  const categoryId = category?.id || category?._id;
  const cacheKey = `${serviceId}-${categoryId}`;
  const isLoading = isLoadingServices[cacheKey] || false;

  useEffect(() => {
    if (serviceId && categoryId) {
      const cacheKey = `${serviceId}-${categoryId}`;
      
      // Check if already cached
      if (allCategoryServices[cacheKey] && allCategoryServices[cacheKey].length > 0) {
        setLocalServices(allCategoryServices[cacheKey]);
        return;
      }

      // Only load if not already loading
      if (!isLoading) {
        loadCategoryServices(serviceId, categoryId).then((svcs) => {
          if (svcs && svcs.length > 0) {
            setLocalServices(svcs);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, categoryId]);

  const services = useMemo(() => {
    if (localServices.length > 0) {
      return localServices;
    }
    if (serviceId && categoryId) {
      const cacheKey = `${serviceId}-${categoryId}`;
      if (allCategoryServices[cacheKey]) {
        return allCategoryServices[cacheKey];
      }
    }
    return [];
  }, [localServices, serviceId, categoryId, allCategoryServices]);

  const handleAddService = (serviceItem) => {
    if (!user) {
      Alert.alert('Error', 'Please login to book a service');
      return;
    }
    setSelectedService(serviceItem);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      await addToCart(bookingData);
      Alert.alert(
        'Success',
        'Service added to cart successfully!',
        [{ text: 'OK', onPress: () => setShowBookingForm(false) }]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add service to cart. Please try again.');
      throw error;
    }
  };

  // If it's a consultation category, show booking option directly
  if (category.id === 'consultation') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{category.name}</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.consultationContainer}>
          <Text style={styles.consultationTitle}>Book a Consultation</Text>
          <Text style={styles.consultationDescription}>
            Get expert advice from our professionals. Book a consultation to discuss your requirements.
          </Text>
          <TouchableOpacity
            style={[styles.bookButton, isJobLoading && styles.bookButtonDisabled]}
            onPress={() => handleAddService({ name: 'Consultation', price: 0 })}
            disabled={isJobLoading}
          >
            {isJobLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.bookButtonText}>Book Consultation</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>{category.name}</Text>
          <Text style={styles.headerTitle}>{category.name}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔗</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Services List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && services.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fdd017" />
          </View>
        ) : services.length > 0 ? (
          services.map((serviceItem) => (
            <View key={serviceItem.id || serviceItem._id} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{serviceItem.name}</Text>
                <View style={styles.serviceRating}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingText}>
                    {serviceItem.rating || '4.5'} ({(serviceItem.reviews || 0) >= 1000 
                      ? `${((serviceItem.reviews || 0) / 1000).toFixed(0)}K` 
                      : serviceItem.reviews || 0} reviews)
                  </Text>
                </View>
                <Text style={styles.servicePrice}>
                  ₹{serviceItem.price || serviceItem.cost || 0} • {serviceItem.duration || serviceItem.estimatedDuration || 30} mins
                </Text>
                {serviceItem.description && (
                  <Text style={styles.serviceDescription}>{serviceItem.description}</Text>
                )}
                <TouchableOpacity onPress={() => onServiceSelect && onServiceSelect(serviceItem)}>
                  <Text style={styles.viewDetails}>View details</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.serviceImageContainer}>
                <View style={styles.serviceImage}>
                  <Text style={styles.serviceImageIcon}>{category.icon || '🔧'}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.addButton, (isJobLoading || isCartLoading) && styles.addButtonDisabled]}
                  onPress={() => handleAddService(serviceItem)}
                  disabled={isJobLoading || isCartLoading}
                >
                  {(isJobLoading || isCartLoading) ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text style={styles.addButtonText}>Add</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services available for this category</Text>
          </View>
        )}
      </ScrollView>

      {/* Booking Form Modal */}
      <BookingForm
        visible={showBookingForm}
        service={selectedService}
        category={category}
        onClose={() => {
          setShowBookingForm(false);
          setSelectedService(null);
        }}
        onSubmit={handleBookingSubmit}
      />
    </SafeAreaView>
  );
};

export default ServiceCategoryDetailPage;

