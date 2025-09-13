import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const SignupSuccessScreen = ({ userData, onGoToDashboard }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.successIcon}>✅</Text>
        </View>
        
        <Text style={styles.title}>Welcome to KaamBuddy!</Text>
        <Text style={styles.subtitle}>
          Your account has been created successfully
        </Text>

        <View style={styles.userInfoCard}>
          <Text style={styles.userInfoTitle}>Account Details:</Text>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Name:</Text>
            <Text style={styles.userInfoValue}>{userData.name || 'Not provided'}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Phone:</Text>
            <Text style={styles.userInfoValue}>{userData.phone || 'Not provided'}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Account Type:</Text>
            <Text style={styles.userInfoValue}>
              {userData.userType === 'customer' ? '👤 Customer' : '🔧 Worker'}
            </Text>
          </View>
          {userData.userType === 'worker' && (
            <>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Work Category:</Text>
                <Text style={styles.userInfoValue}>{userData.workCategory || 'Not specified'}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Experience:</Text>
                <Text style={styles.userInfoValue}>{userData.experience || 'Not specified'}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>
            Account Created Successfully!
          </Text>
          <Text style={styles.messageText}>
            Your account has been created and verified. Please login with your phone number to access your dashboard and start using KaamBuddy.
          </Text>
        </View>

        <TouchableOpacity style={styles.dashboardButton} onPress={onGoToDashboard}>
          <Text style={styles.dashboardButtonText}>Login to Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 30,
  },
  successIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  userInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userInfoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  messageContainer: {
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  dashboardButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  dashboardButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupSuccessScreen;


