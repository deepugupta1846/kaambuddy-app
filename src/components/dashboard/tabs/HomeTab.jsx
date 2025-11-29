import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import UserTypeToggle from '../components/UserTypeToggle';
import StatsCards from '../components/StatsCards';
import ServiceCategories from '../components/ServiceCategories';
import RecentBookings from '../components/RecentBookings';
import RecentJobs from '../components/RecentJobs';
import styles from './HomeTab.styles';
import { useJobs } from '../../../context/JobContext';
import { useBookings } from '../../../context/BookingContext';
import { useAuth } from '../../../context/AuthContext';

const HomeTab = ({ userType }) => {
  const { user } = useAuth();
  const { listJobs, getUserJobs, jobs, userJobs, isLoading: jobsLoading } = useJobs();
  const { getUserBookings, bookings, isLoading: bookingsLoading } = useBookings();

  console.log('HomeTab: User type:', userType);
  console.log('HomeTab: User data:', user);

  useEffect(() => {
    // Load data based on user type
    if (userType === 'customer') {
      getUserJobs();
      getUserBookings();
    } else {
      listJobs();
      getUserBookings();
    }
  }, [userType]);

  return (
    <ScrollView style={styles.content}>
      {/* <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.name || 'User'}!
        </Text>
        <Text style={styles.subtitleText}>
          {userType === 'customer' 
            ? 'Find skilled workers for your needs' 
            : 'Manage your jobs and earnings'
          }
        </Text>
      </View> */}

      {userType === 'customer' ? (
        <>
          {/* <StatsCards 
            stats={[
              { number: userJobs?.length?.toString() || '0', label: 'My Jobs' },
              { number: bookings?.filter(b => b.status === 'completed').length?.toString() || '0', label: 'Completed Jobs' },
              { number: '₹2,500', label: 'Total Spent' }
            ]}
          /> */}
          <ServiceCategories />
          <RecentBookings bookings={bookings} isLoading={bookingsLoading} />
        </>
      ) : (
        <>
          <StatsCards 
            stats={[
              { number: jobs?.length?.toString() || '0', label: 'Available Jobs' },
              { number: bookings?.filter(b => b.status === 'completed').length?.toString() || '0', label: 'Completed Jobs' },
              { number: '4.8', label: 'Rating' }
            ]}
          />
          <RecentJobs jobs={jobs} isLoading={jobsLoading} />
        </>
      )}
    </ScrollView>
  );
};

export default HomeTab;




