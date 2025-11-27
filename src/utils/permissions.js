import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

/**
 * Permission Service
 * Handles requesting permissions for location and notifications
 */
class PermissionService {
  /**
   * Request location permission
   * @returns {Promise<boolean>} true if permission granted, false otherwise
   */
  async requestLocationPermission() {
    try {
      if (Platform.OS === 'android') {
        // Check if permission is already granted
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted) {
          console.log('Location permission already granted');
          return true;
        }

        // Request permission
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'KaamBuddy needs access to your location to show nearby services and providers.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          return true;
        } else {
          console.log('Location permission denied');
          if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            this.showPermissionDeniedAlert('location');
          }
          return false;
        }
      } else {
        // iOS - permissions are handled via Info.plist and will be requested automatically
        // when using Geolocation API
        console.log('iOS location permission will be requested automatically');
        return true;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  /**
   * Request notification permission
   * @returns {Promise<boolean>} true if permission granted, false otherwise
   */
  async requestNotificationPermission() {
    try {
      if (Platform.OS === 'android') {
        // Android 13+ requires runtime permission for notifications
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          if (granted) {
            console.log('Notification permission already granted');
            return true;
          }

          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message: 'KaamBuddy needs to send you notifications about your bookings and updates.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (result === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
            return true;
          } else {
            console.log('Notification permission denied');
            if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
              this.showPermissionDeniedAlert('notification');
            }
            return false;
          }
        } else {
          // Android < 13 - notifications are enabled by default
          console.log('Notification permission not required for Android < 13');
          return true;
        }
      } else {
        // iOS - permissions are handled via native modules
        // This will be implemented when push notification library is added
        console.log('iOS notification permission will be requested via native module');
        return true;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Check if location permission is granted
   * @returns {Promise<boolean>}
   */
  async checkLocationPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted;
      } else {
        // iOS - assume granted if we can access location
        return true;
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  }

  /**
   * Check if notification permission is granted
   * @returns {Promise<boolean>}
   */
  async checkNotificationPermission() {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted;
        } else {
          return true; // Android < 13 doesn't require runtime permission
        }
      } else {
        // iOS - will be implemented with push notification library
        return true;
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  }

  /**
   * Show alert when permission is denied permanently
   * @param {string} permissionType - 'location' or 'notification'
   */
  showPermissionDeniedAlert(permissionType) {
    const permissionName = permissionType === 'location' ? 'Location' : 'Notification';
    Alert.alert(
      `${permissionName} Permission Denied`,
      `Please enable ${permissionName.toLowerCase()} permission in your device settings to use this feature.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'android') {
              Linking.openSettings();
            } else {
              Linking.openURL('app-settings:');
            }
          },
        },
      ]
    );
  }

  /**
   * Request all required permissions
   * @returns {Promise<{location: boolean, notification: boolean}>}
   */
  async requestAllPermissions() {
    const location = await this.requestLocationPermission();
    const notification = await this.requestNotificationPermission();
    return { location, notification };
  }
}

// Export singleton instance
const permissionService = new PermissionService();
export default permissionService;

