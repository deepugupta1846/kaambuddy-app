import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
// Note: For video support, you'll need to install react-native-video
// import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const VideoSplashScreen = ({ onFinish, useVideo = false }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    // Auto-hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.background}>
        {/* Gradient-like background with new theme colors */}
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </View>
      
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {useVideo ? (
          // Video splash screen (requires react-native-video)
          <View style={styles.videoContainer}>
            {/* Uncomment when react-native-video is installed
            <Video
              source={require('../../assets/splash-video.mp4')}
              style={styles.video}
              resizeMode="cover"
              repeat={false}
              onEnd={() => onFinish()}
            />
            */}
            <Text style={styles.fallbackText}>Video Splash Screen</Text>
          </View>
        ) : (
          // Image splash screen
          <View style={styles.imageContainer}>
            <ImageBackground
              source={require('../../assets/splash-image.png')}
              style={styles.splashImage}
              resizeMode="cover"
            >
              <View style={styles.overlay}>
                <View style={styles.logoContainer}>
                  <View style={styles.logo}>
                    <Image 
                      source={require('../../assets/logo.png')} 
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <Text style={styles.appName}>KaamBuddy</Text>
                <Text style={styles.tagline}>Your Work Companion</Text>
              </View>
            </ImageBackground>
          </View>
        )}

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: '#77cc00', // New green theme color
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: '#f4f5f7', // New light gray theme color
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fallbackText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(119, 204, 0, 0.3)', // Semi-transparent green overlay
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
  },
});

export default VideoSplashScreen;
