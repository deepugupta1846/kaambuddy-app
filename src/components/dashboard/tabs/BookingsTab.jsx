import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './BookingsTab.styles';
import { useBookings } from '../../../context/BookingContext';
import { useAuth } from '../../../context/AuthContext';

const BookingsTab = ({ userType }) => {
  const { user } = useAuth();
  const { bookings, getUserBookings, isLoading, acceptBooking, rejectBooking, startJob, completeJob } = useBookings();

  useEffect(() => {
    getUserBookings();
  }, []);

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <Text style={styles.bookingTitle}>{item.job?.title || 'Job Title'}</Text>
      <Text style={styles.bookingStatus}>Status: {item.status}</Text>
      <Text style={styles.bookingDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      
      {userType === 'customer' && item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => acceptBooking(item.id)}
          >
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => rejectBooking(item.id)}
          >
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {userType === 'worker' && item.status === 'accepted' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.startButton]}
            onPress={() => startJob(item.id)}
          >
            <Text style={styles.actionButtonText}>Start Job</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {userType === 'worker' && item.status === 'in_progress' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => completeJob(item.id)}
          >
            <Text style={styles.actionButtonText}>Complete Job</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#fdd017" />
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <Text style={styles.tabTitle}>
        {userType === 'customer' ? 'My Bookings' : 'My Jobs'}
      </Text>
      
      {bookings.length === 0 ? (
        <Text style={styles.comingSoon}>
          {userType === 'customer' 
            ? 'No bookings found' 
            : 'No jobs found'
          }
        </Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default BookingsTab;




