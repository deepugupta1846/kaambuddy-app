import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import styles from './ServiceCategoryDetailPage.styles';
import { getCategoryServices } from '../../../data/servicesData';
import { useJobs } from '../../../context/JobContext';
import { useAuth } from '../../../context/AuthContext';
import colors from '../../../theme/colors';

const ServiceCategoryDetailPage = ({ service, category, onBack, onServiceSelect }) => {
  const { user } = useAuth();
  const { createJob, isLoading } = useJobs();
  const services = getCategoryServices(service.id, category.id);

  const handleAddService = async (serviceItem) => {
    if (!user) {
      Alert.alert('Error', 'Please login to book a service');
      return;
    }

    try {
      await createJob({
        title: `${serviceItem.name} - ${category.name}`,
        description: serviceItem.description,
        category: service.name.toLowerCase(),
        budget: serviceItem.price,
        location: user.address || 'Location to be specified',
        customerId: user.id,
      });
      
      Alert.alert(
        'Success',
        `${serviceItem.name} booked successfully! A service provider will contact you soon.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to book service. Please try again.');
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
            style={[styles.bookButton, isLoading && styles.bookButtonDisabled]}
            onPress={() => handleAddService({ name: 'Consultation', price: 0 })}
            disabled={isLoading}
          >
            {isLoading ? (
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
        {services.map((serviceItem) => (
          <View key={serviceItem.id} style={styles.serviceItem}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{serviceItem.name}</Text>
              <View style={styles.serviceRating}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingText}>
                  {serviceItem.rating} ({serviceItem.reviews >= 1000 
                    ? `${(serviceItem.reviews / 1000).toFixed(0)}K` 
                    : serviceItem.reviews} reviews)
                </Text>
              </View>
              <Text style={styles.servicePrice}>
                ₹{serviceItem.price} • {serviceItem.duration} mins
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
                <Text style={styles.serviceImageIcon}>{category.icon}</Text>
              </View>
              <TouchableOpacity
                style={[styles.addButton, isLoading && styles.addButtonDisabled]}
                onPress={() => handleAddService(serviceItem)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.addButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceCategoryDetailPage;

