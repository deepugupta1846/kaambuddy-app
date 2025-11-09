import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import styles from './EarningsTab.styles';
import { useAuth } from '../../../context/AuthContext';
import PricingManagementModal from './PricingManagementModal';
import apiService from '../../../config/api';

const EarningsTab = ({ userType }) => {
  const { user } = useAuth();
  const [showPricingManagement, setShowPricingManagement] = useState(false);
  const [myPricing, setMyPricing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log('EarningsTab: User type:', userType);

  // Load worker's pricing data
  useEffect(() => {
    if (userType === 'worker' && user) {
      loadMyPricing();
    }
  }, [userType, user]);

  const loadMyPricing = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getMyPricing();
      if (response.success) {
        setMyPricing(response.data.pricing);
      }
    } catch (error) {
      console.error('Error loading pricing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePricingUpdate = () => {
    setShowPricingManagement(true);
  };

  const handleClosePricing = () => {
    setShowPricingManagement(false);
    // Refresh pricing data when modal closes
    loadMyPricing();
  };

  const formatPrice = (price, currency) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';
    return `${symbol}${price}`;
  };

  const getPricingTypeLabel = (type) => {
    const labels = {
      hourly: 'Per Hour',
      daily: 'Per Day', 
      weekly: 'Per Week',
      monthly: 'Per Month',
      project: 'Per Project',
      custom: 'Custom'
    };
    return labels[type] || type;
  };

  if (userType === 'customer') {
    // Customer view - Payment history
    return (
      <View style={styles.content}>
        <Text style={styles.tabTitle}>Payments & History</Text>
        <Text style={styles.comingSoon}>
          Payment history tracking coming soon!
        </Text>
      </View>
    );
  }

  // Worker view - Earnings and pricing management
  return (
    <View style={styles.content}>
      <Text style={styles.tabTitle}>Earnings & Payments</Text>
      
      {/* Current Pricing Section */}
      <View style={styles.pricingSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Rates</Text>
          <TouchableOpacity 
            style={styles.updateRateButton}
            onPress={handlePricingUpdate}
          >
            <Text style={styles.updateRateButtonText}>Update Rates</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your rates...</Text>
          </View>
        ) : myPricing.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No pricing set yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Set your rates to start receiving bookings
            </Text>
            <TouchableOpacity 
              style={styles.setPricingButton}
              onPress={handlePricingUpdate}
            >
              <Text style={styles.setPricingButtonText}>Set Your Rates</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.pricingList} showsVerticalScrollIndicator={false}>
            {myPricing.map((pricing, index) => (
              <View key={pricing.id} style={styles.pricingCard}>
                <View style={styles.pricingHeader}>
                  <Text style={styles.pricingType}>
                    {getPricingTypeLabel(pricing.pricingType)}
                  </Text>
                  <Text style={styles.pricingAmount}>
                    {formatPrice(pricing.price, pricing.currency)}
                  </Text>
                </View>
                <Text style={styles.pricingCategory}>{pricing.workCategory}</Text>
                {pricing.description && (
                  <Text style={styles.pricingDescription}>{pricing.description}</Text>
                )}
                {pricing.serviceArea && (
                  <Text style={styles.pricingArea}>📍 {pricing.serviceArea}</Text>
                )}
                {pricing.isNegotiable && (
                  <Text style={styles.negotiableText}>💰 Price is negotiable</Text>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Earnings Overview Section */}
      <View style={styles.earningsSection}>
        <Text style={styles.sectionTitle}>Earnings Overview</Text>
        <View style={styles.earningsCards}>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsAmount}>₹0</Text>
            <Text style={styles.earningsLabel}>This Month</Text>
          </View>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsAmount}>₹0</Text>
            <Text style={styles.earningsLabel}>Total Earned</Text>
          </View>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsAmount}>0</Text>
            <Text style={styles.earningsLabel}>Jobs Completed</Text>
          </View>
        </View>
      </View>

      {/* Recent Earnings Section */}
      <View style={styles.recentEarningsSection}>
        <Text style={styles.sectionTitle}>Recent Earnings</Text>
        <View style={styles.emptyEarnings}>
          <Text style={styles.emptyEarningsText}>No earnings yet</Text>
          <Text style={styles.emptyEarningsSubtext}>
            Complete jobs to see your earnings here
          </Text>
        </View>
      </View>

      {/* Pricing Management Modal */}
      <PricingManagementModal
        visible={showPricingManagement}
        onClose={handleClosePricing}
        user={user}
        onPricingUpdate={() => {
          loadMyPricing();
        }}
      />
    </View>
  );
};

export default EarningsTab;






