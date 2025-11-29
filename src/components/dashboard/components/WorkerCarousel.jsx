import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import apiService from '../../../config/api';
import colors from '../../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 180;
const AUTO_SLIDE_INTERVAL = 4000; // 4 seconds

const WorkerCarousel = () => {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    loadWorkers();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (workers.length > 0) {
      startAutoSlide();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [workers.length]);

  const loadWorkers = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.listWorkers({
        limit: 10,
        page: 1,
      });

      if (response && response.success && response.data && response.data.workers) {
        // Filter to only show workers with good ratings (optional)
        const experiencedWorkers = response.data.workers.filter(
          (worker) => worker.rating >= 4.0 || worker.experience >= 2
        );
        setWorkers(experiencedWorkers.length > 0 ? experiencedWorkers : response.data.workers);
      }
    } catch (error) {
      console.error('Failed to load workers for carousel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startAutoSlide = () => {
    if (workers.length <= 1) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      // Fade out and slide left
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change to next worker
        const nextIndex = (currentIndexRef.current + 1) % workers.length;
        setCurrentIndex(nextIndex);
        
        // Reset position for fade in from right
        slideAnim.setValue(30);
        
        // Fade in and slide to center
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, AUTO_SLIDE_INTERVAL);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (workers.length === 0) {
    return null;
  }

  const currentWorker = workers[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Experienced Workers</Text>
        <Text style={styles.subtitle}>Top rated professionals</Text>
      </View>

      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.card}>
          {/* Worker Image */}
          <View style={styles.imageContainer}>
            {currentWorker.profileImage ? (
              <Image
                source={{ uri: currentWorker.profileImage }}
                style={styles.workerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="user" size={40} color="#999" solid />
              </View>
            )}
            {/* Verified Badge */}
            <View style={styles.verifiedBadge}>
              <Icon name="check-circle" size={16} color="#fff" solid />
            </View>
          </View>

          {/* Worker Info */}
          <View style={styles.workerInfo}>
            <Text style={styles.workerName} numberOfLines={1}>
              {currentWorker.name || 'Worker'}
            </Text>
            {currentWorker.workCategory && (
              <Text style={styles.workerCategory} numberOfLines={1}>
                {currentWorker.workCategory}
              </Text>
            )}

            {/* Rating and Reviews */}
            {currentWorker.rating && (
              <View style={styles.ratingContainer}>
                <Icon name="star" size={14} color="#fdd017" solid />
                <Text style={styles.ratingText}>
                  {currentWorker.rating || currentWorker.rating}
                </Text>
                {currentWorker.totalReviews > 0 && (
                  <Text style={styles.reviewsText}>
                    ({currentWorker.totalReviews} reviews)
                  </Text>
                )}
              </View>
            )}

            {/* Experience and Jobs */}
            <View style={styles.statsContainer}>
              {currentWorker.experience && (
                <View style={styles.statItem}>
                  <Icon name="briefcase" size={12} color="#666" solid />
                  <Text style={styles.statText}>
                    {currentWorker.experience} yrs exp
                  </Text>
                </View>
              )}
              {currentWorker.totalJobs !== undefined && (
                <View style={styles.statItem}>
                  <Icon name="check-circle" size={12} color="#666" solid />
                  <Text style={styles.statText}>
                    {currentWorker.totalJobs} jobs
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Indicator dots */}
      {workers.length > 1 && (
        <View style={styles.indicatorContainer}>
          {workers.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    height: CARD_HEIGHT + 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardContainer: {
    width: CARD_WIDTH,
    alignSelf: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.surface || '#ffffff',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  workerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary || '#fdd017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  workerInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  workerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  workerCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  reviewsText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: colors.primary || '#fdd017',
  },
});

export default WorkerCarousel;

