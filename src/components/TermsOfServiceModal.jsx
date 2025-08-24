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

const TermsOfServiceModal = ({ visible, onClose }) => {
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
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing and using the KaamBuddy application, you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Description of Service</Text>
            <Text style={styles.sectionText}>
              KaamBuddy is a platform that connects customers with skilled workers for various 
              services. Our platform facilitates:
            </Text>
            <Text style={styles.bulletPoint}>• User registration and profile management</Text>
            <Text style={styles.bulletPoint}>• Service booking and scheduling</Text>
            <Text style={styles.bulletPoint}>• Payment processing and management</Text>
            <Text style={styles.bulletPoint}>• Communication between customers and workers</Text>
            <Text style={styles.bulletPoint}>• Rating and review systems</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.sectionText}>
              To use our services, you must create an account. You agree to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide accurate and complete information</Text>
            <Text style={styles.bulletPoint}>• Maintain the security of your account credentials</Text>
            <Text style={styles.bulletPoint}>• Notify us immediately of any unauthorized use</Text>
            <Text style={styles.bulletPoint}>• Be responsible for all activities under your account</Text>
            <Text style={styles.bulletPoint}>• Complete KYC verification if required</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
            <Text style={styles.sectionText}>
              As a user of KaamBuddy, you agree to:
            </Text>
            <Text style={styles.bulletPoint}>• Use the platform only for lawful purposes</Text>
            <Text style={styles.bulletPoint}>• Provide accurate and truthful information</Text>
            <Text style={styles.bulletPoint}>• Respect other users' rights and privacy</Text>
            <Text style={styles.bulletPoint}>• Not engage in fraudulent or deceptive practices</Text>
            <Text style={styles.bulletPoint}>• Comply with all applicable laws and regulations</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Service Providers (Workers)</Text>
            <Text style={styles.sectionText}>
              If you register as a service provider, you additionally agree to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide services with reasonable care and skill</Text>
            <Text style={styles.bulletPoint}>• Complete KYC verification requirements</Text>
            <Text style={styles.bulletPoint}>• Maintain appropriate licenses and certifications</Text>
            <Text style={styles.bulletPoint}>• Respond to service requests promptly</Text>
            <Text style={styles.bulletPoint}>• Maintain professional conduct and appearance</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Payment Terms</Text>
            <Text style={styles.sectionText}>
              Payment processing is handled through secure third-party providers. You agree to:
            </Text>
            <Text style={styles.bulletPoint}>• Pay all fees and charges in a timely manner</Text>
            <Text style={styles.bulletPoint}>• Provide accurate payment information</Text>
            <Text style={styles.bulletPoint}>• Accept our refund and cancellation policies</Text>
            <Text style={styles.bulletPoint}>• Pay applicable taxes and service fees</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Prohibited Activities</Text>
            <Text style={styles.sectionText}>
              You may not use our platform to:
            </Text>
            <Text style={styles.bulletPoint}>• Violate any laws or regulations</Text>
            <Text style={styles.bulletPoint}>• Harass, abuse, or harm other users</Text>
            <Text style={styles.bulletPoint}>• Post false or misleading information</Text>
            <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
            <Text style={styles.bulletPoint}>• Interfere with the proper functioning of the platform</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Intellectual Property</Text>
            <Text style={styles.sectionText}>
              The KaamBuddy platform, including its content, features, and functionality, is owned by 
              us and is protected by copyright, trademark, and other intellectual property laws. 
              You may not copy, modify, or distribute our content without permission.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              To the maximum extent permitted by law, KaamBuddy shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to 
              loss of profits, data, or use, arising out of or relating to your use of our services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Termination</Text>
            <Text style={styles.sectionText}>
              We may terminate or suspend your account at any time for violations of these terms. 
              You may also terminate your account at any time by contacting us. Upon termination, 
              your right to use the platform will cease immediately.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes through the app or email. Continued use of the platform after 
              changes constitutes acceptance of the new terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Contact Information</Text>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms of Service, please contact us at:
            </Text>
            <Text style={styles.contactInfo}>Email: legal@kaambuddy.com</Text>
            <Text style={styles.contactInfo}>Phone: +91-XXXXXXXXXX</Text>
          </View>

          <View style={styles.section}>
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

export default TermsOfServiceModal;
