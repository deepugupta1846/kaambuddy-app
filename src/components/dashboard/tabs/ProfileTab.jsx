import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './ProfileTab.styles';
import colors from '../../../theme/colors';
import { useAuth } from '../../../context/AuthContext';
import EditProfileScreen from '../../EditProfileScreen';
import PrivacyPolicyModal from '../../PrivacyPolicyModal';
import TermsOfServiceModal from '../../TermsOfServiceModal';
import apiService from '../../../config/api';

const ProfileTab = ({ userData }) => {
  const { user, updateProfile, logout } = useAuth();
  const [showKYC, setShowKYC] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(user || userData);
  const [kycStatus, setKycStatus] = useState(null);

  // Update currentUserData when user from AuthContext changes
  useEffect(() => {
    console.log('ProfileTab: User data changed:', user);
    if (user) {
      setCurrentUserData(user);
    }
  }, [user]);

  // Check KYC status for workers
  useEffect(() => {
    const checkKYCStatus = async () => {
      if (user?.userType === 'worker') {
        try {
          const response = await apiService.getKYCStatus();
          if (response.success) {
            setKycStatus(response.data.kyc);
          }
        } catch (error) {
          console.error('Failed to fetch KYC status:', error);
        }
      }
    };

    checkKYCStatus();
  }, [user]);

  // Debug logging
  useEffect(() => {
    console.log('ProfileTab: Current user data:', currentUserData);
    console.log('ProfileTab: Actual user data:', actualUserData);
    console.log('ProfileTab: KYC status:', kycStatus);
  }, [currentUserData, actualUserData, kycStatus]);

  // Use actual user data from AuthContext, fallback to mock data if needed
  const actualUserData = currentUserData || {
    name: 'User',
    phone: '+91 00000 00000',
    email: 'user@example.com',
    userType: 'customer',
    workCategory: '',
    experience: '',
    kycStatus: 'pending',
    profileImage: null,
    loginMethod: 'phone'
  };

  const getKYCStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'pending': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getKYCStatusText = (status) => {
    switch (status) {
      case 'completed': return '✅ Verified';
      case 'rejected': return '❌ Rejected';
      case 'pending': return '⏳ Pending';
      default: return '❓ Not Started';
    }
  };

  return (
    <ScrollView style={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {actualUserData.profileImage ? (
            <Image source={{ uri: actualUserData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>
                {actualUserData.name && actualUserData.name.length > 0 
                  ? actualUserData.name.charAt(0).toUpperCase() 
                  : 'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.profileName}>{actualUserData.name || 'User'}</Text>
        <Text style={styles.profilePhone}>{actualUserData.phone || 'Not provided'}</Text>
        <Text style={styles.profileType}>
          {actualUserData.userType === 'customer' ? '👤 Customer' : '🔧 Worker'}
        </Text>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{actualUserData.name || 'Not provided'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone Number</Text>
          <Text style={styles.infoValue}>{actualUserData.phone || 'Not provided'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email Address</Text>
          <Text style={styles.infoValue}>
            {actualUserData.email || 'Not provided'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Type</Text>
          <Text style={styles.infoValue}>
            {actualUserData.userType === 'customer' ? 'Customer' : 'Worker'}
          </Text>
        </View>

        {actualUserData.userType === 'worker' && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Work Category</Text>
              <Text style={styles.infoValue}>{actualUserData.workCategory || 'Not specified'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{actualUserData.experience || 'Not specified'}</Text>
            </View>
          </>
        )}
      </View>

      {actualUserData.userType === 'worker' && (
        <View style={styles.kycSection}>
          <Text style={styles.sectionTitle}>KYC Verification</Text>
          <View style={styles.kycStatusContainer}>
            <View style={styles.kycStatusRow}>
              <Text style={styles.kycStatusLabel}>Verification Status:</Text>
              <Text style={[
                styles.kycStatusText,
                { color: getKYCStatusColor(kycStatus?.status || 'not_started') }
              ]}>
                {getKYCStatusText(kycStatus?.status || 'not_started')}
              </Text>
            </View>
            
            {(!kycStatus || kycStatus.status === 'not_started') && (
              <TouchableOpacity 
                style={styles.kycButton}
                onPress={() => setShowKYC(true)}
              >
                <Text style={styles.kycButtonText}>Complete KYC</Text>
              </TouchableOpacity>
            )}
            
            {kycStatus?.status === 'pending' && (
              <View style={styles.kycCompleted}>
                <Text style={styles.kycCompletedText}>⏳ KYC verification pending</Text>
                <Text style={styles.kycCompletedSubtext}>Your documents are under review</Text>
              </View>
            )}
            
            {kycStatus?.status === 'rejected' && (
              <View>
                <TouchableOpacity 
                  style={styles.kycButton}
                  onPress={() => setShowKYC(true)}
                >
                  <Text style={styles.kycButtonText}>Update KYC</Text>
                </TouchableOpacity>
                {kycStatus.rejectionReason && (
                  <Text style={styles.kycRejectionText}>
                    Reason: {kycStatus.rejectionReason}
                  </Text>
                )}
              </View>
            )}
            
            {kycStatus?.status === 'approved' && (
              <View style={styles.kycCompleted}>
                <Text style={styles.kycCompletedText}>✅ KYC verification completed</Text>
                <Text style={styles.kycCompletedSubtext}>Your account is fully verified</Text>
              </View>
            )}
          </View>
        </View>
      )}


      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setShowEditProfile(true)}
        >
          <Text style={styles.settingText}>Edit Profile</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Change Password</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setShowPrivacyPolicy(true)}
        >
          <Text style={styles.settingText}>Privacy Policy</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setShowTermsOfService(true)}
        >
          <Text style={styles.settingText}>Terms of Service</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* KYC Modal */}
      {showKYC && (
        <KYCModal 
          userData={actualUserData}
          onClose={() => setShowKYC(false)}
          onComplete={async (kycData) => {
            console.log('KYC completed:', kycData);
            // Refresh KYC status from backend
            try {
              const response = await apiService.getKYCStatus();
              if (response.success) {
                setKycStatus(response.data.kyc);
              }
            } catch (error) {
              console.error('Failed to refresh KYC status:', error);
            }
            setShowKYC(false);
          }}
        />
      )}

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <EditProfileScreen
          userData={actualUserData}
          onSave={(updatedData) => {
            setCurrentUserData(updatedData);
            setShowEditProfile(false);
          }}
          onCancel={() => setShowEditProfile(false)}
        />
      </Modal>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        visible={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />

      {/* Terms of Service Modal */}
      <TermsOfServiceModal
        visible={showTermsOfService}
        onClose={() => setShowTermsOfService(false)}
      />

    </ScrollView>
  );
};

// KYC Modal Component
const KYCModal = ({ userData, onClose, onComplete }) => {
  const [fullName, setFullName] = useState(userData?.name || '');
  const [aadharNumber, setAadharNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!fullName.trim() || !aadharNumber.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit KYC to backend API
      const kycData = {
        fullName: fullName.trim(),
        aadharNumber: aadharNumber.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim()
        // TODO: Add image upload functionality for aadhar images and selfie
        // Image fields will be added when upload functionality is implemented
      };
      
      const result = await apiService.submitKYC(kycData);
      
      if (result.success) {
        onComplete({
          status: 'pending',
          submittedAt: new Date()
        });
      } else {
        console.error('KYC submission failed:', result.message);
        // Show specific error message to user
        Alert.alert('KYC Submission Failed', result.message || 'Please check your information and try again.');
      }
    } catch (error) {
      console.error('KYC submission failed:', error);
      // Show error message to user
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit KYC. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.fullPageModalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.fullPageModalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.fullPageCloseButton}>
            <Text style={styles.fullPageCloseButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.fullPageModalTitle}>KYC Verification</Text>
          <View style={styles.fullPageHeaderSpacer} />
        </View>
        
        <ScrollView style={styles.fullPageModalBody} showsVerticalScrollIndicator={false}>
          <Text style={styles.kycDescription}>
            Please provide your complete KYC details for verification. This is required for worker verification.
          </Text>
          
          <View style={styles.kycInputContainer}>
            <Text style={styles.kycInputLabel}>Full Name</Text>
            <TextInput
              style={styles.kycInput}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.kycInputContainer}>
            <Text style={styles.kycInputLabel}>Aadhar Card Number</Text>
            <TextInput
              style={styles.kycInput}
              placeholder="Enter 12-digit Aadhar number"
              value={aadharNumber}
              onChangeText={setAadharNumber}
              keyboardType="numeric"
              maxLength={12}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.kycInputContainer}>
            <Text style={styles.kycInputLabel}>Complete Address</Text>
            <TextInput
              style={styles.kycInput}
              placeholder="Enter your complete address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.kycInputContainer}>
            <Text style={styles.kycInputLabel}>City</Text>
            <TextInput
              style={styles.kycInput}
              placeholder="Enter your city"
              value={city}
              onChangeText={setCity}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.kycInputContainer}>
            <Text style={styles.kycInputLabel}>State</Text>
            <TextInput
              style={styles.kycInput}
              placeholder="Enter your state"
              value={state}
              onChangeText={setState}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.kycInputContainer}>
            <Text style={styles.kycInputLabel}>Pincode</Text>
            <TextInput
              style={styles.kycInput}
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.kycNote}>
            <Text style={styles.kycNoteText}>
              📝 Note: Your Aadhar number will be encrypted and used only for verification purposes. Image upload functionality will be added in the next update.
            </Text>
          </View>
        </ScrollView>
        
        <View style={styles.fullPageModalFooter}>
          <TouchableOpacity 
            style={[styles.fullPageSubmitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.fullPageSubmitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit KYC'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileTab;
