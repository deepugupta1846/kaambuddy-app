import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import colors from '../theme/colors';
import apiService from '../config/api';

const SignupScreen = ({ onSignup, onSwitchToLogin, onNavigateToOTP }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState('customer'); // 'customer' or 'worker'
  const [workCategory, setWorkCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWorkCategoryModal, setShowWorkCategoryModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  const handleSendOTP = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Validate worker-specific fields
    if (userType === 'worker') {
      if (!workCategory.trim()) {
        Alert.alert('Error', 'Please select your work category');
        return;
      }
      if (!experience.trim()) {
        Alert.alert('Error', 'Please select your experience level');
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Format phone number (add +91 if not present)
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone;
      }
      
      // Send OTP using backend API
      const result = await apiService.login(formattedPhone);
      
      if (result.success) {
        // Prepare signup data
        const signupData = {
          name: fullName.trim(),
          phone: formattedPhone,
          userType: userType,
          workCategory: userType === 'worker' ? workCategory : '',
          experience: userType === 'worker' ? experience : '',
        };
        
        // Navigate to OTP verification screen with signup data
        if (onNavigateToOTP) {
          onNavigateToOTP(signupData);
        }
      } else {
        Alert.alert('Error', result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const workCategories = [
    'Plumber',
    'Electrician', 
    'Cleaner',
    'Painter',
    'Chef',
    'Carpenter',
    'Mechanic',
    'Other'
  ];

  const experienceLevels = [
    '0-1 years',
    '1-3 years', 
    '3-5 years',
    '5+ years'
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Connect with skilled workers or find work opportunities
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={15}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* User Type Tabs - styled like dashboard tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                userType === 'customer' && styles.activeTab
              ]}
              onPress={() => setUserType('customer')}
            >
              <Text style={[styles.tabIcon, userType === 'customer' && styles.activeTabIcon]}>👤</Text>
              <Text style={[styles.tabText, userType === 'customer' && styles.activeTabText]}>Customer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                userType === 'worker' && styles.activeTab
              ]}
              onPress={() => setUserType('worker')}
            >
              <Text style={[styles.tabIcon, userType === 'worker' && styles.activeTabIcon]}>🔧</Text>
              <Text style={[styles.tabText, userType === 'worker' && styles.activeTabText]}>Worker</Text>
            </TouchableOpacity>
          </View>

          {/* Worker-specific fields */}
          {userType === 'worker' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Work Category</Text>
                <TouchableOpacity 
                  style={styles.pickerButton}
                  onPress={() => setShowWorkCategoryModal(true)}
                >
                  <Text style={[
                    styles.pickerButtonText,
                    workCategory ? styles.pickerButtonTextSelected : styles.pickerButtonTextPlaceholder
                  ]}>
                    {workCategory || 'Select work category'}
                  </Text>
                  <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Experience Level</Text>
                <TouchableOpacity 
                  style={styles.pickerButton}
                  onPress={() => setShowExperienceModal(true)}
                >
                  <Text style={[
                    styles.pickerButtonText,
                    experience ? styles.pickerButtonTextSelected : styles.pickerButtonTextPlaceholder
                  ]}>
                    {experience || 'Select experience level'}
                  </Text>
                  <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSwitchToLogin}>
              <Text style={styles.signupLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Work Category Modal */}
      <Modal
        visible={showWorkCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWorkCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.halfScreenModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Work Category</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowWorkCategoryModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {workCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalItem,
                    workCategory === category && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setWorkCategory(category);
                    setShowWorkCategoryModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    workCategory === category && styles.modalItemTextSelected
                  ]}>
                    {category}
                  </Text>
                  {workCategory === category && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Experience Level Modal */}
      <Modal
        visible={showExperienceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExperienceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.halfScreenModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Experience Level</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowExperienceModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {experienceLevels.map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalItem,
                    experience === level && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setExperience(level);
                    setShowExperienceModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    experience === level && styles.modalItemTextSelected
                  ]}>
                    {level}
                  </Text>
                  {experience === level && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  // Tab styles - matching dashboard tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabIcon: {
    fontSize: 20,
    marginRight: 8,
    opacity: 0.6,
  },
  activeTabIcon: {
    opacity: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.buttonSecondary,
    fontWeight: 'bold',
  },
  // Picker button styles
  pickerButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  pickerButtonTextPlaceholder: {
    color: colors.textSecondary,
  },
  pickerButtonTextSelected: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  pickerArrow: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Button styles - matching LoginScreen
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Footer styles - matching LoginScreen
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  halfScreenModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalCloseButton: {
    padding: 5,
  },
  modalCloseText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  modalContent: {
    flex: 1,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalItemSelected: {
    backgroundColor: colors.primary + '20', // Light primary color background
  },
  modalItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  modalItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
