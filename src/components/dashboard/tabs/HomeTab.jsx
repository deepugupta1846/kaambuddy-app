import React, { useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import UserTypeToggle from '../components/UserTypeToggle';
import StatsCards from '../components/StatsCards';
import ServiceCategories from '../components/ServiceCategories';
import RecentBookings from '../components/RecentBookings';
import RecentJobs from '../components/RecentJobs';
import ImageCarousel from '../components/ImageCarousel';
import WorkerCarousel from '../components/WorkerCarousel';
import styles from './HomeTab.styles';
import { useJobs } from '../../../context/JobContext';
import { useBookings } from '../../../context/BookingContext';
import { useAuth } from '../../../context/AuthContext';

const HomeTab = ({ userType }) => {
  const { user } = useAuth();
  const { listJobs, getUserJobs, jobs, userJobs, isLoading: jobsLoading } = useJobs();
  const { getUserBookings, bookings, isLoading: bookingsLoading } = useBookings();

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
    <ScrollView 
      style={styles.content}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Image Carousel */}
      <ImageCarousel />

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.welcomeGreeting}>Hello,</Text>
            <Text style={styles.welcomeName}>{user?.name || 'User'}! 👋</Text>
          </View>
          <View style={styles.iconBadge}>
            <Icon name="bell" size={20} color="#fdd017" solid />
          </View>
        </View>
        <Text style={styles.subtitleText}>
          {userType === 'customer' 
            ? 'Find skilled workers for all your needs' 
            : 'Manage your jobs and grow your earnings'
          }
        </Text>
      </View>

      {userType === 'customer' ? (
        <>
          <ServiceCategories />
          {/* Worker Carousel */}
          <WorkerCarousel />

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




