import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import permissionService from '../utils/permissions';

// Import Geolocation with error handling
let Geolocation;
try {
  const geolocationModule = require('@react-native-community/geolocation');
  Geolocation = geolocationModule.default || geolocationModule;
} catch (error) {
  console.warn('Geolocation package not found:', error);
  // Create a mock Geolocation object to prevent crashes
  Geolocation = {
    getCurrentPosition: (success, error) => {
      if (error) {
        error({ message: 'Geolocation package not installed' });
      }
    },
  };
}

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Reverse geocode coordinates to get address
   * Using a free reverse geocoding service (Nominatim)
   */
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'KaamBuddy/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        // Format address: prefer locality, then city, then state
        if (address.locality || address.city || address.town || address.village) {
          const city = address.locality || address.city || address.town || address.village;
          const state = address.state || '';
          return state ? `${city}, ${state}` : city;
        } else if (address.state) {
          return address.state;
        } else if (address.country) {
          return address.country;
        }
      }

      // Fallback to coordinates
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback to coordinates
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  }, []);

  /**
   * Get current location using Geolocation API
   */
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = {
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setCurrentLocation(location);
          
          // Reverse geocode to get address
          try {
            const address = await reverseGeocode(latitude, longitude);
            setLocationName(address);
          } catch (err) {
            console.error('Error reverse geocoding:', err);
            setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }

          setIsLoading(false);
          resolve(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(error.message || 'Failed to get current location');
          setIsLoading(false);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }, [reverseGeocode]);

  // Check and request location permission on mount
  useEffect(() => {
    checkPermissionAndGetLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Check permission and get current location
   */
  const checkPermissionAndGetLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if permission is already granted
      const hasLocationPermission = await permissionService.checkLocationPermission();
      
      if (hasLocationPermission) {
        setHasPermission(true);
        await getCurrentLocation();
      } else {
        // Request permission
        const granted = await permissionService.requestLocationPermission();
        if (granted) {
          setHasPermission(true);
          await getCurrentLocation();
        } else {
          setHasPermission(false);
          setError('Location permission denied');
        }
      }
    } catch (err) {
      console.error('Error checking permission:', err);
      setError(err.message || 'Failed to get location permission');
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };


  /**
   * Refresh location
   */
  const refreshLocation = useCallback(async () => {
    if (hasPermission) {
      await getCurrentLocation();
    } else {
      await checkPermissionAndGetLocation();
    }
  }, [hasPermission, getCurrentLocation]);

  /**
   * Request location permission manually
   */
  const requestPermission = useCallback(async () => {
    const granted = await permissionService.requestLocationPermission();
    if (granted) {
      setHasPermission(true);
      await getCurrentLocation();
    } else {
      setHasPermission(false);
      setError('Location permission denied');
    }
    return granted;
  }, [getCurrentLocation]);

  const value = {
    currentLocation,
    locationName,
    isLoading,
    hasPermission,
    error,
    refreshLocation,
    requestPermission,
    getCurrentLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

