import React from 'react';
import { View, Text } from 'react-native';
import styles from './BookingsTab.styles';

const BookingsTab = ({ userType }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.tabTitle}>
        {userType === 'customer' ? 'My Bookings' : 'My Jobs'}
      </Text>
      <Text style={styles.comingSoon}>
        {userType === 'customer' 
          ? 'Booking management coming soon!' 
          : 'Job management coming soon!'
        }
      </Text>
    </View>
  );
};

export default BookingsTab;


