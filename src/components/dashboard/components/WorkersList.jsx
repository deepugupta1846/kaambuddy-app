import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './WorkersList.styles';
import apiService from '../../../config/api';

const WorkersList = ({ visible, onClose }) => {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      loadWorkers();
    }
  }, [visible]);

  const loadWorkers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading workers...');
      const response = await apiService.listWorkers({ 
        limit: 100,
        page: 1 
      });
      
      console.log('Workers API Response:', response);
      
      if (response && response.success) {
        if (response.data && response.data.workers) {
          setWorkers(response.data.workers);
          console.log(`Loaded ${response.data.workers.length} workers`);
        } else {
          throw new Error('Invalid response format: workers data not found');
        }
      } else {
        throw new Error(response?.message || 'Failed to load workers');
      }
    } catch (err) {
      console.error('Failed to load workers:', err);
      let errorMessage = 'Failed to load workers. Please try again.';
      
      if (err.message && err.message.includes('Network request failed')) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setWorkers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderWorkerItem = ({ item }) => (
    <View style={styles.workerCard}>
      <View style={styles.workerHeader}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.workerImage} />
        ) : (
          <View style={styles.workerImagePlaceholder}>
            <Icon name="user" size={30} color="#999" solid />
          </View>
        )}
        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{item.name || 'Worker'}</Text>
          {item.workCategory && (
            <Text style={styles.workerCategory}>{item.workCategory}</Text>
          )}
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={14} color="#fdd017" solid />
              <Text style={styles.ratingText}>
                {item?.rating} ({item.totalReviews || 0} reviews)
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.workerDetails}>
        {item.experience && (
          <View style={styles.detailRow}>
            <Icon name="briefcase" size={14} color="#666" solid />
            <Text style={styles.detailText}>{item.experience} years experience</Text>
          </View>
        )}
        {item.totalJobs !== undefined && (
          <View style={styles.detailRow}>
            <Icon name="check-circle" size={14} color="#666" solid />
            <Text style={styles.detailText}>{item.totalJobs} jobs completed</Text>
          </View>
        )}
        {item.address && (
          <View style={styles.detailRow}>
            <Icon name="map-marker-alt" size={14} color="#666" solid />
            <Text style={styles.detailText} numberOfLines={1}>{item.address}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Our Experienced Workers</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="times" size={24} color="#333" solid />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fdd017" />
            <Text style={styles.loadingText}>Loading workers...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="exclamation-circle" size={48} color="#dc3545" solid />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadWorkers}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : workers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="users" size={64} color="#ccc" solid />
            <Text style={styles.emptyText}>No workers available</Text>
          </View>
        ) : (
          <FlatList
            data={workers}
            renderItem={renderWorkerItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Modal>
  );
};

export default WorkersList;

