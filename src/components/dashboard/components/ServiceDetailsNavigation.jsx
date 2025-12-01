import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import styles from './ServiceCategoriesPage.styles'

const ServiceDetailsNavigation = ({ visible, service, onClose, onAcceptPress }) => {
 const handleBack = () => {
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!service) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{service.icon} {service.name}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Text style={styles.headerIconText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Text style={styles.headerIconText}>🔗</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.bookingTitle}>{service.title}</Text>
          <Text style={styles.bookingStatus}>Status: {service.status}</Text>
          <Text style={styles.bookingDate}>
            {service.scheduledDate && new Date(service.scheduledDate).toLocaleString()}
          </Text>

          <Text style={[styles.bookingStatus, { marginTop: 12 }]}>
            Category: {service.category}
          </Text>
          <Text style={styles.bookingStatus}>
            Budget: ₹{service.budgetMin} - ₹{service.budgetMax}
          </Text>
          <Text style={styles.bookingStatus}>
            Location: {service.location}
          </Text>

          {service.description && (
            <>
              <Text style={[styles.bookingStatus, { marginTop: 16, fontWeight: 'bold' }]}>
                Description
              </Text>
              <Text style={styles.bookingStatus}>{service.description}</Text>
            </>
          )}
        </ScrollView>

        {/* Bottom action: Accept for open services */}
        {service.status === 'open' && onAcceptPress && (
          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => onAcceptPress(service)}
            >
              <Text style={styles.actionButtonText}>Accept service</Text>
            </TouchableOpacity>
          </View>
        )}

        {service.status === 'inprogress' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButtonSmall, styles.cancelButton]}>
              <Text style={styles.actionButtonSmallText}>Cancel Service</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButtonSmall, styles.paymentButton]}>
              <Text style={styles.actionButtonSmallText}>Make Payment</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default ServiceDetailsNavigation;


