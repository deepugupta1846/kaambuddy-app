import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import styles from './ServicesTab.styles';
import { useJobs } from '../../../context/JobContext';
import { useAuth } from '../../../context/AuthContext';

const ServicesTab = ({ userType }) => {
  const { user } = useAuth();
  const { jobs, userJobs, listJobs, getUserJobs, createJob, isLoading } = useJobs();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
  });

  useEffect(() => {
    if (userType === 'customer') {
      getUserJobs();
    } else {
      listJobs();
    }
  }, [userType]);

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.description || !newJob.budget) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createJob({
        ...newJob,
        budget: parseFloat(newJob.budget),
        customerId: user.id,
      });
      setShowCreateModal(false);
      setNewJob({ title: '', description: '', category: '', budget: '', location: '' });
      Alert.alert('Success', 'Job created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderJobItem = ({ item }) => (
    <View style={styles.jobItem}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <Text style={styles.jobBudget}>Budget: ₹{item.budget}</Text>
      <Text style={styles.jobStatus}>Status: {item.status}</Text>
      <Text style={styles.jobDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
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
        {userType === 'customer' ? 'My Jobs' : 'Available Jobs'}
      </Text>
      
      {userType === 'customer' && (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>Create New Job</Text>
        </TouchableOpacity>
      )}
      
      {(userType === 'customer' ? userJobs : jobs).length === 0 ? (
        <Text style={styles.comingSoon}>
          {userType === 'customer' 
            ? 'No jobs created yet' 
            : 'No jobs available'
          }
        </Text>
      ) : (
        <FlatList
          data={userType === 'customer' ? userJobs : jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Job Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Job</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Job Title"
              value={newJob.title}
              onChangeText={(text) => setNewJob({ ...newJob, title: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newJob.description}
              onChangeText={(text) => setNewJob({ ...newJob, description: text })}
              multiline
              numberOfLines={3}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newJob.category}
              onChangeText={(text) => setNewJob({ ...newJob, category: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Budget (₹)"
              value={newJob.budget}
              onChangeText={(text) => setNewJob({ ...newJob, budget: text })}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={newJob.location}
              onChangeText={(text) => setNewJob({ ...newJob, location: text })}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleCreateJob}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ServicesTab;




