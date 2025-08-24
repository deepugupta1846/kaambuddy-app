import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import UserTypeToggle from '../components/UserTypeToggle';
import StatsCards from '../components/StatsCards';
import ServiceCategories from '../components/ServiceCategories';
import RecentBookings from '../components/RecentBookings';
import RecentJobs from '../components/RecentJobs';
import styles from './HomeTab.styles';

const HomeTab = ({ userType, setUserType }) => {
  return (
    <ScrollView style={styles.content}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.subtitleText}>
          {userType === 'customer' 
            ? 'Find skilled workers for your needs' 
            : 'Manage your bookings and earnings'
          }
        </Text>
      </View>
      
      <UserTypeToggle userType={userType} setUserType={setUserType} />

      {userType === 'customer' ? (
        <>
          <StatsCards 
            stats={[
              { number: '5', label: 'Active Bookings' },
              { number: '12', label: 'Completed Jobs' },
              { number: '₹2,500', label: 'Total Spent' }
            ]}
          />
          <ServiceCategories />
          <RecentBookings />
        </>
      ) : (
        <>
          <StatsCards 
            stats={[
              { number: '8', label: "Today's Jobs" },
              { number: '₹1,200', label: "Today's Earnings" },
              { number: '4.8', label: 'Rating' }
            ]}
          />
          <RecentJobs />
        </>
      )}
    </ScrollView>
  );
};

export default HomeTab;


