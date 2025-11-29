import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 220;
const AUTO_SLIDE_INTERVAL = 3000; // 3 seconds

// Import worker images
const workerImages = [
  require('../../../assets/workerimages/1.jpg'),
  require('../../../assets/workerimages/2.jpg'),
  require('../../../assets/workerimages/3.jpg'),
  require('../../../assets/workerimages/4.jpg'),
];

const ImageCarousel = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Change image
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % workerImages.length;
          // Fade in
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
          return nextIndex;
        });
      });
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
        <Image
          source={workerImages[currentIndex]}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Gradient overlay for better text readability */}
        <View style={styles.gradient} />
      </Animated.View>
      
      {/* Indicator dots */}
      <View style={styles.indicatorContainer}>
        {workerImages.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    marginBottom: 20,
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: '#fdd017',
  },
});

export default ImageCarousel;

