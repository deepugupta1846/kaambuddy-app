import React, { useEffect } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import UserTypeToggle from '../components/UserTypeToggle';
import StatsCards from '../components/StatsCards';
import ServiceCategories from '../components/ServiceCategories';
import RecentBookings from '../components/RecentBookings';
import RecentJobs from '../components/RecentJobs';
import ImageCarousel from '../components/ImageCarousel';
import WorkerCarousel from '../components/WorkerCarousel';
import SearchBar from '../components/SearchBar';
import PromotionalBanner from '../components/PromotionalBanner';
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

  const handleSearch = (searchText) => {
    // Handle search
    console.log('Search:', searchText);
  };

  const handleBannerPress = () => {
    // Handle promotional banner press
    Alert.alert('Promotion', 'Painting & Waterproofing service');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <SearchBar 
          placeholder="Search for 'AC service'"
          onSearch={handleSearch}
        />

        {userType === 'customer' ? (
          <>
            {/* Service Categories */}
            <ServiceCategories />

            {/* Promotional Banner */}
            <PromotionalBanner 
              title="Home painting & waterproofing"
              subtitle="Pay after 100% satisfaction"
              onPress={handleBannerPress}
            />

            {/* Worker Carousel */}
            <WorkerCarousel />

            {/* Recent Bookings */}
            <RecentBookings bookings={bookings} isLoading={bookingsLoading} />
          </>
        ) : (
          <>
            {/* Welcome Section for Workers */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeName}>Hello, {user?.name || 'User'}! 👋</Text>
              <Text style={styles.subtitleText}>
                Manage your jobs and grow your earnings
              </Text>
            </View>

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
    </View>
  );
};

export default HomeTab;




