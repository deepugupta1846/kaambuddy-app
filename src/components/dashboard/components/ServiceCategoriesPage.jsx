import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import styles from './ServiceCategoriesPage.styles';
import { useServices } from '../../../context/ServiceContext';

const ServiceCategoriesPage = ({ service, onCategorySelect, onClose }) => {
  const { loadServiceCategories, categories: allCategories, isLoadingCategories } = useServices();
  const [localCategories, setLocalCategories] = useState([]);

  const serviceId = service?.id || service?._id;
  const isLoading = isLoadingCategories[serviceId] || false;

  useEffect(() => {
    if (serviceId) {
      // Check if already cached
      if (allCategories[serviceId] && allCategories[serviceId].length > 0) {
        setLocalCategories(allCategories[serviceId]);
        return;
      }

      // Only load if not already loading
      if (!isLoading) {
        loadServiceCategories(serviceId).then((cats) => {
          if (cats && cats.length > 0) {
            setLocalCategories(cats);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  const categories = useMemo(() => {
    if (localCategories.length > 0) {
      return localCategories;
    }
    if (serviceId && allCategories[serviceId]) {
      return allCategories[serviceId];
    }
    return [];
  }, [localCategories, serviceId, allCategories]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{service.icon} {service.name}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔗</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && categories.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fdd017" />
          </View>
        ) : categories.length > 0 ? (
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id || category._id}
                style={styles.categoryCard}
                onPress={() => onCategorySelect(category)}
              >
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>{category.icon || '🔧'}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceCategoriesPage;

