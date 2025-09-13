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

  // Mock user data - in real app this would come from props or context
  const mockUserData = currentUserData || {
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john.doe@example.com',
    userType: 'worker',
    workCategory: 'Plumber',
    experience: '3-5 years',
    kycStatus: 'pending', // 'pending', 'completed', 'rejected'
    profileImage: null,
    loginMethod: 'phone' // 'phone' or 'google', 'facebook', 'apple'
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
          {mockUserData.profileImage ? (
            <Image source={{ uri: mockUserData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>
                {mockUserData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.profileName}>{mockUserData.name}</Text>
        <Text style={styles.profilePhone}>{mockUserData.phone}</Text>
        <Text style={styles.profileType}>
          {mockUserData.userType === 'customer' ? '👤 Customer' : '🔧 Worker'}
        </Text>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{mockUserData.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone Number</Text>
          <Text style={styles.infoValue}>{mockUserData.phone}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email Address</Text>
          <Text style={styles.infoValue}>
            {mockUserData.email || 'Not provided'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Type</Text>
          <Text style={styles.infoValue}>
            {mockUserData.userType === 'customer' ? 'Customer' : 'Worker'}
          </Text>
        </View>

        {mockUserData.userType === 'worker' && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Work Category</Text>
              <Text style={styles.infoValue}>{mockUserData.workCategory}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{mockUserData.experience}</Text>
            </View>
          </>
        )}
      </View>

      {mockUserData.userType === 'worker' && (
        <View style={styles.kycSection}>
          <Text style={styles.sectionTitle}>KYC Verification</Text>
          <View style={styles.kycStatusContainer}>
            <View style={styles.kycStatusRow}>
              <Text style={styles.kycStatusLabel}>Verification Status:</Text>
              <Text style={[
                styles.kycStatusText,
                { color: getKYCStatusColor(mockUserData.kycStatus) }
              ]}>
                {getKYCStatusText(mockUserData.kycStatus)}
              </Text>
            </View>
            
            {mockUserData.kycStatus === 'pending' && (
              <TouchableOpacity 
                style={styles.kycButton}
                onPress={() => setShowKYC(true)}
              >
                <Text style={styles.kycButtonText}>Complete KYC</Text>
              </TouchableOpacity>
            )}
            
            {mockUserData.kycStatus === 'rejected' && (
              <TouchableOpacity 
                style={styles.kycButton}
                onPress={() => setShowKYC(true)}
              >
                <Text style={styles.kycButtonText}>Update KYC</Text>
              </TouchableOpacity>
            )}
            
            {mockUserData.kycStatus === 'completed' && (
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
          userData={mockUserData}
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
          userData={mockUserData}
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
