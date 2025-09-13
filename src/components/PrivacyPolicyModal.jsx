import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import colors from '../theme/colors';

const PrivacyPolicyModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information you provide directly to us, such as when you create an account, 
              update your profile, or contact us for support. This may include:
            </Text>
            <Text style={styles.bulletPoint}>• Personal information (name, email, phone number)</Text>
            <Text style={styles.bulletPoint}>• Profile information (work category, experience)</Text>
            <Text style={styles.bulletPoint}>• Authentication data (login method, verification details)</Text>
            <Text style={styles.bulletPoint}>• KYC information (address, identification documents)</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use the information we collect to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
            <Text style={styles.bulletPoint}>• Connect customers with skilled workers</Text>
            <Text style={styles.bulletPoint}>• Verify user identities and ensure platform safety</Text>
            <Text style={styles.bulletPoint}>• Send important updates and notifications</Text>
            <Text style={styles.bulletPoint}>• Improve our services and user experience</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Information Sharing</Text>
            <Text style={styles.sectionText}>
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information only in the following circumstances:
            </Text>
            <Text style={styles.bulletPoint}>• With your explicit consent</Text>
            <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
            <Text style={styles.bulletPoint}>• To protect our rights and safety</Text>
            <Text style={styles.bulletPoint}>• With service providers who assist in our operations</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.sectionText}>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. This includes:
            </Text>
            <Text style={styles.bulletPoint}>• Encryption of sensitive data</Text>
            <Text style={styles.bulletPoint}>• Secure authentication methods</Text>
            <Text style={styles.bulletPoint}>• Regular security assessments</Text>
            <Text style={styles.bulletPoint}>• Access controls and monitoring</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.sectionText}>
              You have the right to:
            </Text>
            <Text style={styles.bulletPoint}>• Access and update your personal information</Text>
            <Text style={styles.bulletPoint}>• Request deletion of your account and data</Text>
            <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>
            <Text style={styles.bulletPoint}>• Request information about data processing</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Data Retention</Text>
            <Text style={styles.sectionText}>
              We retain your personal information for as long as necessary to provide our services 
              and comply with legal obligations. When you delete your account, we will delete or 
              anonymize your personal information within a reasonable timeframe.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about this Privacy Policy or our data practices, please 
              contact us at:
            </Text>
            <Text style={styles.contactInfo}>Email: privacy@kaambuddy.com</Text>
            <Text style={styles.contactInfo}>Phone: +91-XXXXXXXXXX</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Updates to This Policy</Text>
            <Text style={styles.sectionText}>
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the "Last Updated" 
              date.
            </Text>
            <Text style={styles.lastUpdated}>Last Updated: December 2024</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 34, // Same width as close button for centering
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginLeft: 10,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 5,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default PrivacyPolicyModal;


