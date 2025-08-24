import React from 'react';
import { View, Text } from 'react-native';
import styles from './RecentJobs.styles';

const RecentJobs = () => {
  const jobs = [
    {
      title: 'Kitchen Sink Repair',
      customer: 'Mrs. Gupta',
      time: '2:00 PM - 4:00 PM',
      payment: '₹500',
      status: 'pending'
    },
    {
      title: 'Bathroom Cleaning',
      customer: 'Mr. Singh',
      time: '10:00 AM - 11:30 AM',
      payment: '₹400',
      status: 'completed'
    },
    {
      title: 'Wall Painting',
      customer: 'Ms. Reddy',
      time: '9:00 AM - 12:00 PM',
      payment: '₹800',
      status: 'inProgress'
    }
  ];

  return (
    <View style={styles.recentJobs}>
      <Text style={styles.sectionTitle}>Today's Jobs</Text>
      <View style={styles.jobList}>
        {jobs.map((job, index) => (
          <View key={index} style={styles.jobItem}>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCustomer}>{job.customer}</Text>
              <Text style={styles.jobTime}>{job.time}</Text>
              <Text style={styles.jobPayment}>{job.payment}</Text>
            </View>
            <View style={[
              styles.jobStatus, 
              job.status === 'completed' ? styles.completedStatus : 
              job.status === 'inProgress' ? styles.inProgressStatus : 
              styles.pendingStatus
            ]} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecentJobs;


