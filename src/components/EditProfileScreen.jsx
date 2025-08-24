import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../theme/colors';
import { updateUserDocument } from '../config/firebase';

const EditProfileScreen = ({ userData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    workCategory: userData?.workCategory || '',
    experience: userData?.experience || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if user logged in via SSO (Google, etc.)
  const isSSOUser = userData?.loginMethod === 'google' || userData?.loginMethod === 'facebook' || userData?.loginMethod === 'apple';

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate email (only if not SSO user and email is provided)
    if (!isSSOUser && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate work category for workers
    if (userData?.userType === 'worker' && !formData.workCategory.trim()) {
      newErrors.workCategory = 'Work category is required';
    }

    // Validate experience for workers
    if (userData?.userType === 'worker' && !formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        workCategory: formData.workCategory.trim(),
        experience: formData.experience.trim(),
      };

      // Only include email if not SSO user
      if (!isSSOUser && formData.email.trim()) {
        updatedData.email = formData.email.trim();
      }

      // Update user document in Firebase
      const result = await updateUserDocument(userData.id, updatedData);

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully!');
        onSave({ ...userData, ...updatedData });
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Email Address {isSSOUser ? '(Linked to SSO)' : ''}
            </Text>
            <TextInput
              style={[
                styles.input, 
                errors.email && styles.inputError,
                isSSOUser && styles.disabledInput
              ]}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder={isSSOUser ? "Email managed by SSO provider" : "Enter your email address"}
              placeholderTextColor={colors.textSecondary}
              editable={!isSSOUser}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {isSSOUser && (
              <Text style={styles.ssoNote}>
                🔒 Email is managed by your SSO provider and cannot be changed
              </Text>
            )}
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          {userData?.userType === 'worker' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Work Category *</Text>
                <TextInput
                  style={[styles.input, errors.workCategory && styles.inputError]}
                  value={formData.workCategory}
                  onChangeText={(text) => handleInputChange('workCategory', text)}
                  placeholder="e.g., Plumber, Electrician, Carpenter"
                  placeholderTextColor={colors.textSecondary}
                />
                {errors.workCategory ? <Text style={styles.errorText}>{errors.workCategory}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Experience *</Text>
                <TextInput
                  style={[styles.input, errors.experience && styles.inputError]}
                  value={formData.experience}
                  onChangeText={(text) => handleInputChange('experience', text)}
                  placeholder="e.g., 3-5 years, 5+ years"
                  placeholderTextColor={colors.textSecondary}
                />
                {errors.experience ? <Text style={styles.errorText}>{errors.experience}</Text> : null}
              </View>
            </>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Account Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Type:</Text>
              <Text style={styles.infoValue}>
                {userData?.userType === 'customer' ? 'Customer' : 'Worker'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Login Method:</Text>
              <Text style={styles.infoValue}>
                {isSSOUser ? 'SSO Provider' : 'Phone + OTP'}
              </Text>
            </View>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    paddingTop: Platform.OS === 'ios' ? 50 : 15, // Add safe area for modal
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  disabledInput: {
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  ssoNote: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
