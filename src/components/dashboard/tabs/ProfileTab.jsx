import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Modal } from 'react-native';
import styles from './ProfileTab.styles';
import colors from '../../../theme/colors';
import { useAuth } from '../../../context/AuthContext';
import EditProfileScreen from '../../EditProfileScreen';
import PrivacyPolicyModal from '../../PrivacyPolicyModal';
import TermsOfServiceModal from '../../TermsOfServiceModal';

const ProfileTab = ({ userData }) => {
  const { user, updateProfile, logout } = useAuth();
  const [showKYC, setShowKYC] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(user || userData);

  // Update currentUserData when user from AuthContext changes
  useEffect(() => {
    console.log('ProfileTab: User data changed:', user);
    if (user) {
      setCurrentUserData(user);
    }
  }, [user]);

  // Debug logging
  useEffect(() => {
    console.log('ProfileTab: Current user data:', currentUserData);
    console.log('ProfileTab: Actual user data:', actualUserData);
  }, [currentUserData, actualUserData]);

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
                { color: getKYCStatusColor(actualUserData.kycStatus) }
              ]}>
                {getKYCStatusText(actualUserData.kycStatus)}
              </Text>
            </View>
            
            {actualUserData.kycStatus === 'pending' && (
              <TouchableOpacity 
                style={styles.kycButton}
                onPress={() => setShowKYC(true)}
              >
                <Text style={styles.kycButtonText}>Complete KYC</Text>
              </TouchableOpacity>
            )}
            
            {actualUserData.kycStatus === 'rejected' && (
              <TouchableOpacity 
                style={styles.kycButton}
                onPress={() => setShowKYC(true)}
              >
                <Text style={styles.kycButtonText}>Update KYC</Text>
              </TouchableOpacity>
            )}
            
            {actualUserData.kycStatus === 'completed' && (
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

      {/* KYC Modal would be rendered here */}
      {showKYC && (
        <KYCModal 
          userData={actualUserData}
          onClose={() => setShowKYC(false)}
          onComplete={(kycData) => {
            console.log('KYC completed:', kycData);
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
  const [address, setAddress] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!address.trim() || !aadharNumber.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit KYC to Firebase
      const kycData = {
        address: address.trim(),
        aadharNumber: aadharNumber.trim(),
        userId: userData.id || 'user_' + Date.now(),
      };
      
      const result = await submitKYC(kycData.userId, kycData);
      
      if (result.success) {
        onComplete({
          address: address.trim(),
          aadharNumber: aadharNumber.trim(),
          status: 'pending'
        });
      } else {
        console.error('KYC submission failed:', result.error);
      }
    } catch (error) {
      console.error('KYC submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>KYC Verification</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalBody}>
          <Text style={styles.kycDescription}>
            Please provide your complete address and Aadhar card number for verification.
          </Text>
          
          <View style={styles.kycInputContainer}>
            <Text style={styles.kycInputLabel}>Full Address</Text>
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
          
          <View style={styles.kycNote}>
            <Text style={styles.kycNoteText}>
              📝 Note: Your Aadhar number will be encrypted and used only for verification purposes.
            </Text>
          </View>
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={[styles.kycSubmitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.kycSubmitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit KYC'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileTab;
