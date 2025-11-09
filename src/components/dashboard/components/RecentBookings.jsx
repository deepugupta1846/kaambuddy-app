import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from './RecentBookings.styles';

const RecentBookings = ({ bookings = [], isLoading }) => {

  return (
    <View style={styles.recentBookings}>
      <Text style={styles.sectionTitle}>Recent Bookings</Text>

      {/* ✅ Loading Indicator */}
      {isLoading && (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator size="small" />
        </View>
      )}

      {/* ✅ No Bookings Found */}
      {!isLoading && bookings.length === 0 && (
        <Text style={styles.noBookingsText}>No recent bookings found</Text>
      )}

      {/* ✅ Render Bookings List */}
      {!isLoading && bookings.length > 0 && (
        <View style={styles.bookingList}>
          {bookings.map((booking, index) => (
            <View key={index} style={styles.bookingItem}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>{booking.title}</Text>
                <Text style={styles.bookingWorker}>{booking.worker}</Text>
                <Text style={styles.bookingTime}>{booking.time}</Text>
              </View>

              <View
                style={[
                  styles.bookingStatus,
                  booking.status === 'completed'
                    ? styles.completedStatus
                    : styles.confirmedStatus
                ]}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default RecentBookings;
