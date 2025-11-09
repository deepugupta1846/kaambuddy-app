import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from './SettingsScreen.styles';
import colors from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = ({ visible, onClose }) => {
  const { user, logout } = useAuth();

  if (!visible) return null;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              onClose();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    // TODO: Open privacy policy modal or navigate to privacy policy
    Alert.alert('Privacy Policy', 'Privacy policy will be displayed here');
  };

  const handleTermsOfService = () => {
    // TODO: Open terms of service modal or navigate to terms of service
    Alert.alert('Terms of Service', 'Terms of service will be displayed here');
  };

  const handleHelpSupport = () => {
    // TODO: Open help and support
    Alert.alert('Help & Support', 'Help and support will be displayed here');
  };

  const handleAbout = () => {
    // TODO: Open about page
    Alert.alert('About KaamBuddy', 'KaamBuddy v1.0.0\nYour trusted service marketplace');
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
          <Text style={styles.title}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user?.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userType}>
                  {user?.user_type === 'worker' ? 'Service Provider' : 'Customer'}
                </Text>
                <Text style={styles.userPhone}>{user?.phone || 'No phone'}</Text>
              </View>
            </View>
          </View>


          {/* Preferences Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Language</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Theme</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleHelpSupport}
            >
              <Text style={styles.settingText}>Help & Support</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handlePrivacyPolicy}
            >
              <Text style={styles.settingText}>Privacy Policy</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleTermsOfService}
            >
              <Text style={styles.settingText}>Terms of Service</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleAbout}
            >
              <Text style={styles.settingText}>About</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Account Actions */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Change Password</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Delete Account</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>KaamBuddy v1.0.0</Text>
            <Text style={styles.versionSubtext}>© 2024 KaamBuddy. All rights reserved.</Text>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SettingsScreen;
