import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from '../tabs/BookingsTab.styles';
import { useBookings } from '../../../context/BookingContext';

const JobDetailsScreen = ({ job, onBack, userType }) => {
  const { applyForJob } = useBookings();

  if (!job) {
    return (
      <View style={styles.content}>
        <Text style={styles.comingSoon}>Job not found</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onBack}
        >
          <Text style={styles.actionButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAccept = async () => {
    try {
      const proposedPrice = Number(job.budgetMax) || Number(job.budgetMin) || 0;
      await applyForJob(job.id, {
        proposedPrice,
        message: 'I would like to accept this job.',
        scheduledDate: job.scheduledDate,
      });
      Alert.alert('Success', 'You have applied for this job.');
      onBack && onBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to accept job.');
    }
  };

  return (
    <View style={styles.content}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.actionButtonText, { color: '#333' }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tabTitle}>Job Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.bookingTitle}>{job.title}</Text>
        <Text style={styles.bookingStatus}>Status: {job.status}</Text>
        <Text style={styles.bookingDate}>
          {job.scheduledDate && new Date(job.scheduledDate).toLocaleString()}
        </Text>

        <Text style={[styles.bookingStatus, { marginTop: 12 }]}>
          Category: {job.category}
        </Text>
        <Text style={styles.bookingStatus}>
          Budget: ₹{job.budgetMin} - ₹{job.budgetMax}
        </Text>
        <Text style={styles.bookingStatus}>
          Location: {job.location}
        </Text>

        {job.description && (
          <>
            <Text style={[styles.bookingStatus, { marginTop: 16, fontWeight: 'bold' }]}>
              Description
            </Text>
            <Text style={styles.bookingStatus}>{job.description}</Text>
          </>
        )}
      </ScrollView>

      {/* Bottom Accept button for workers when job is open */}
      {userType === 'worker' && job.status === 'open' && (
        <View style={{ marginTop: 16 }}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Text style={styles.actionButtonText}>Accept Job</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default JobDetailsScreen;


