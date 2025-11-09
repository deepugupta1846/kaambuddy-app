import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from './PricingManagementModal.styles';
import colors from '../../../theme/colors';
import apiService from '../../../config/api';

const PricingManagementModal = ({ visible, onClose, user, onPricingUpdate }) => {
  const [pricingData, setPricingData] = useState([]);
  const [pricingInfo, setPricingInfo] = useState({
    pricingTypes: [],
    workCategories: [],
    currencies: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [formData, setFormData] = useState({
    workCategory: user?.workCategory || '',
    pricingType: 'hourly',
    price: '',
    currency: 'INR',
    minimumDuration: '',
    maximumDuration: '',
    description: '',
    isNegotiable: false,
    customUnit: '',
    serviceArea: '',
    additionalCharges: []
  });

  useEffect(() => {
    if (visible && user) {
      loadPricingData();
      loadPricingInfo();
    }
  }, [visible, user]);

  const loadPricingData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getMyPricing();
      if (response.success) {
        setPricingData(response.data.pricing);
      }
    } catch (error) {
      console.error('Error loading pricing data:', error);
      Alert.alert('Error', 'Failed to load pricing data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPricingInfo = async () => {
    try {
      const response = await apiService.getPricingInfo();
      if (response.success) {
        setPricingInfo(response.data);
      }
    } catch (error) {
      console.error('Error loading pricing info:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (!formData.workCategory || !formData.price) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      if (formData.pricingType === 'custom' && !formData.customUnit) {
        Alert.alert('Error', 'Custom unit is required for custom pricing type');
        return;
      }

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        minimumDuration: formData.minimumDuration ? parseInt(formData.minimumDuration) : null,
        maximumDuration: formData.maximumDuration ? parseInt(formData.maximumDuration) : null,
        additionalCharges: formData.additionalCharges
      };

      const response = await apiService.setWorkerPricing(submitData);
      
      if (response.success) {
        Alert.alert('Success', 'Pricing updated successfully');
        setShowAddForm(false);
        setEditingPricing(null);
        resetForm();
        loadPricingData();
        if (onPricingUpdate) {
          onPricingUpdate();
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to update pricing');
      }
    } catch (error) {
      console.error('Error submitting pricing:', error);
      Alert.alert('Error', 'Failed to update pricing');
    }
  };

  const handleEdit = (pricing) => {
    setEditingPricing(pricing);
    setFormData({
      workCategory: pricing.workCategory,
      pricingType: pricing.pricingType,
      price: pricing.price.toString(),
      currency: pricing.currency,
      minimumDuration: pricing.minimumDuration?.toString() || '',
      maximumDuration: pricing.maximumDuration?.toString() || '',
      description: pricing.description || '',
      isNegotiable: pricing.isNegotiable,
      customUnit: pricing.customUnit || '',
      serviceArea: pricing.serviceArea || '',
      additionalCharges: pricing.additionalCharges || []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (pricingId) => {
    Alert.alert(
      'Delete Pricing',
      'Are you sure you want to delete this pricing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.deleteWorkerPricing(pricingId);
              if (response.success) {
                Alert.alert('Success', 'Pricing deleted successfully');
                loadPricingData();
                if (onPricingUpdate) {
                  onPricingUpdate();
                }
              } else {
                Alert.alert('Error', response.message || 'Failed to delete pricing');
              }
            } catch (error) {
              console.error('Error deleting pricing:', error);
              Alert.alert('Error', 'Failed to delete pricing');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      workCategory: user?.workCategory || '',
      pricingType: 'hourly',
      price: '',
      currency: 'INR',
      minimumDuration: '',
      maximumDuration: '',
      description: '',
      isNegotiable: false,
      customUnit: '',
      serviceArea: '',
      additionalCharges: []
    });
  };

  const addAdditionalCharge = () => {
    setFormData({
      ...formData,
      additionalCharges: [...formData.additionalCharges, { name: '', amount: '' }]
    });
  };

  const updateAdditionalCharge = (index, field, value) => {
    const updatedCharges = [...formData.additionalCharges];
    updatedCharges[index][field] = value;
    setFormData({ ...formData, additionalCharges: updatedCharges });
  };

  const removeAdditionalCharge = (index) => {
    const updatedCharges = formData.additionalCharges.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalCharges: updatedCharges });
  };

  const getPricingTypeLabel = (type) => {
    const pricingType = pricingInfo.pricingTypes.find(pt => pt.value === type);
    return pricingType ? pricingType.label : type;
  };

  const getCurrencySymbol = (currency) => {
    const currencyData = pricingInfo.currencies.find(c => c.value === currency);
    return currencyData ? currencyData.symbol : currency;
  };

  const formatPrice = (price, currency) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${price}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Pricing Management</Text>
          <TouchableOpacity 
            onPress={() => {
              resetForm();
              setEditingPricing(null);
              setShowAddForm(true);
            }} 
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {showAddForm ? (
            // Add/Edit Form
            <View style={styles.form}>
              <Text style={styles.formTitle}>
                {editingPricing ? 'Edit Pricing' : 'Add New Pricing'}
              </Text>

              {/* Work Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Work Category *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.workCategory}
                  onChangeText={(text) => setFormData({ ...formData, workCategory: text })}
                  placeholder="e.g., Plumber, Electrician"
                />
              </View>

              {/* Pricing Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pricing Type *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
                  {pricingInfo.pricingTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        formData.pricingType === type.value && styles.typeOptionSelected
                      ]}
                      onPress={() => setFormData({ ...formData, pricingType: type.value })}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        formData.pricingType === type.value && styles.typeOptionTextSelected
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Price */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  placeholder="Enter price"
                  keyboardType="numeric"
                />
              </View>

              {/* Currency */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Currency</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencySelector}>
                  {pricingInfo.currencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.value}
                      style={[
                        styles.currencyOption,
                        formData.currency === currency.value && styles.currencyOptionSelected
                      ]}
                      onPress={() => setFormData({ ...formData, currency: currency.value })}
                    >
                      <Text style={[
                        styles.currencyOptionText,
                        formData.currency === currency.value && styles.currencyOptionTextSelected
                      ]}>
                        {currency.symbol} {currency.value}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Duration Range */}
              <View style={styles.durationRow}>
                <View style={styles.durationInput}>
                  <Text style={styles.label}>Min Duration</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.minimumDuration}
                    onChangeText={(text) => setFormData({ ...formData, minimumDuration: text })}
                    placeholder="Min"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.durationInput}>
                  <Text style={styles.label}>Max Duration</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.maximumDuration}
                    onChangeText={(text) => setFormData({ ...formData, maximumDuration: text })}
                    placeholder="Max"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Custom Unit */}
              {formData.pricingType === 'custom' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Custom Unit *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.customUnit}
                    onChangeText={(text) => setFormData({ ...formData, customUnit: text })}
                    placeholder="e.g., per square foot, per item"
                  />
                </View>
              )}

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Describe your service..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Service Area */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service Area</Text>
                <TextInput
                  style={styles.input}
                  value={formData.serviceArea}
                  onChangeText={(text) => setFormData({ ...formData, serviceArea: text })}
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                />
              </View>

              {/* Negotiable */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setFormData({ ...formData, isNegotiable: !formData.isNegotiable })}
              >
                <View style={[styles.checkbox, formData.isNegotiable && styles.checkboxChecked]}>
                  {formData.isNegotiable && <Text style={styles.checkboxText}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Price is negotiable</Text>
              </TouchableOpacity>

              {/* Additional Charges */}
              <View style={styles.inputGroup}>
                <View style={styles.additionalChargesHeader}>
                  <Text style={styles.label}>Additional Charges</Text>
                  <TouchableOpacity onPress={addAdditionalCharge} style={styles.addChargeButton}>
                    <Text style={styles.addChargeButtonText}>+ Add</Text>
                  </TouchableOpacity>
                </View>
                {formData.additionalCharges.map((charge, index) => (
                  <View key={index} style={styles.chargeRow}>
                    <TextInput
                      style={[styles.input, styles.chargeInput]}
                      value={charge.name}
                      onChangeText={(text) => updateAdditionalCharge(index, 'name', text)}
                      placeholder="Charge name"
                    />
                    <TextInput
                      style={[styles.input, styles.chargeInput]}
                      value={charge.amount}
                      onChangeText={(text) => updateAdditionalCharge(index, 'amount', text)}
                      placeholder="Amount"
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      onPress={() => removeAdditionalCharge(index)}
                      style={styles.removeChargeButton}
                    >
                      <Text style={styles.removeChargeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Form Actions */}
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddForm(false);
                    setEditingPricing(null);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                  <Text style={styles.saveButtonText}>
                    {editingPricing ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Pricing List
            <View style={styles.pricingList}>
              <Text style={styles.listTitle}>Your Pricing</Text>
              {isLoading ? (
                <Text style={styles.loadingText}>Loading pricing data...</Text>
              ) : pricingData.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No pricing set yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Add your first pricing to start receiving bookings
                  </Text>
                </View>
              ) : (
                pricingData.map((pricing) => (
                  <View key={pricing.id} style={styles.pricingCard}>
                    <View style={styles.pricingHeader}>
                      <View style={styles.pricingInfo}>
                        <Text style={styles.pricingType}>
                          {getPricingTypeLabel(pricing.pricingType)}
                        </Text>
                        <Text style={styles.pricingCategory}>{pricing.workCategory}</Text>
                      </View>
                      <Text style={styles.pricingAmount}>
                        {formatPrice(pricing.price, pricing.currency)}
                      </Text>
                    </View>
                    
                    {pricing.description && (
                      <Text style={styles.pricingDescription}>{pricing.description}</Text>
                    )}
                    
                    {pricing.minimumDuration && pricing.maximumDuration && (
                      <Text style={styles.pricingDuration}>
                        Duration: {pricing.minimumDuration} - {pricing.maximumDuration} {pricing.pricingType}
                      </Text>
                    )}
                    
                    {pricing.serviceArea && (
                      <Text style={styles.pricingArea}>Area: {pricing.serviceArea}</Text>
                    )}
                    
                    {pricing.isNegotiable && (
                      <Text style={styles.negotiableText}>Price is negotiable</Text>
                    )}
                    
                    <View style={styles.pricingActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEdit(pricing)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(pricing.id)}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PricingManagementModal;


