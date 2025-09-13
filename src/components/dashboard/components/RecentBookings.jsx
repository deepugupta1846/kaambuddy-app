import React from 'react';
import { View, Text } from 'react-native';
import styles from './RecentBookings.styles';

const RecentBookings = () => {
  const bookings = [
    {
      title: 'Plumbing Repair',
      worker: 'Rajesh Kumar',
      time: 'Today, 2:00 PM',
      status: 'confirmed'
    },
    {
      title: 'House Cleaning',
      worker: 'Priya Sharma',
      time: 'Yesterday, 10:00 AM',
      status: 'completed'
    },
    {
      title: 'Electrical Work',
      worker: 'Amit Patel',
      time: '2 days ago',
      status: 'completed'
    }
  ];

  return (
    <View style={styles.recentBookings}>
      <Text style={styles.sectionTitle}>Recent Bookings</Text>
      <View style={styles.bookingList}>
        {bookings.map((booking, index) => (
          <View key={index} style={styles.bookingItem}>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingTitle}>{booking.title}</Text>
              <Text style={styles.bookingWorker}>{booking.worker}</Text>
              <Text style={styles.bookingTime}>{booking.time}</Text>
            </View>
            <View style={[
              styles.bookingStatus, 
              booking.status === 'completed' ? styles.completedStatus : styles.confirmedStatus
            ]} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecentBookings;




