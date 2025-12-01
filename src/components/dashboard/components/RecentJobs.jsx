import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './RecentJobs.styles';
import ServiceDetailsNavigation from './ServiceDetailsNavigation';
const RecentJobs = ({ jobs, onAcceptPress }) => {
  
  const [showServiceBookingNavigation, setshowServiceBookingNavigation] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const onJobPress = useCallback((service) => {
    setSelectedService(service);
    setshowServiceBookingNavigation(true);
  }, []);

  const handleCloseNavigation = useCallback(() => {
    setshowServiceBookingNavigation(false);
    setSelectedService(null);
  }, []);

  return (
    <>
    <View style={styles.recentJobs}>
      <Text style={styles.sectionTitle}>Today's Jobs</Text>
      <View style={styles.jobList}>
        {jobs.map((job, index) => (
          <View key={job.id || index} style={styles.jobItem}>
            <TouchableOpacity
              style={styles.jobInfo}
              activeOpacity={0.7}
              onPress={() => onJobPress(job)}
            >
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCustomer}>{job.customer?.name}</Text>
              <Text style={styles.jobTime}>{job.scheduledDate}</Text>
              <Text style={styles.jobPayment}>{job.budgetMax}</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={[
                styles.jobStatus, 
                job.status === 'completed' ? styles.completedStatus : 
                job.status === 'in_progress' ? styles.inProgressStatus : 
                styles.pendingStatus
              ]} />
              {job.status === 'open' && onAcceptPress && (
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => onAcceptPress(job)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>

    {/* Service Navigation Modal */}
      <ServiceDetailsNavigation
        visible={showServiceBookingNavigation}
        service={selectedService}
        onClose={handleCloseNavigation}
      />
    </>
  );
};

export default RecentJobs;








