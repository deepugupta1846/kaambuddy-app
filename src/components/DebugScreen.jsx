import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiService from '../config/api';
import colors from '../theme/colors';

const DebugScreen = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [healthStatus, setHealthStatus] = useState('Not checked');

  const checkBackendHealth = async () => {
    try {
      setHealthStatus('Checking...');
      const result = await apiService.healthCheck();
      setHealthStatus('Backend is running');
      Alert.alert('Success', 'Backend is accessible!');
    } catch (error) {
      setHealthStatus('Backend is not accessible');
      Alert.alert('Error', 'Backend is not accessible. Please check if the server is running.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Debug Information
      </Text>
      
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Authentication State:
        </Text>
        <Text>isLoading: {isLoading ? 'true' : 'false'}</Text>
        <Text>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</Text>
        <Text>user: {user ? 'exists' : 'null'}</Text>
        <Text>Backend Status: {healthStatus}</Text>
      </View>

      {user && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            User Data:
          </Text>
          <Text>ID: {user.id || 'N/A'}</Text>
          <Text>Name: {user.name || 'N/A'}</Text>
          <Text>Phone: {user.phone || 'N/A'}</Text>
          <Text>Email: {user.email || 'N/A'}</Text>
          <Text>User Type: {user.userType || 'N/A'}</Text>
          <Text>Work Category: {user.workCategory || 'N/A'}</Text>
          <Text>Experience: {user.experience || 'N/A'}</Text>
          <Text>Is Verified: {user.isVerified ? 'true' : 'false'}</Text>
        </View>
      )}

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Instructions:
        </Text>
        <Text>1. Check if backend server is running on port 3000</Text>
        <Text>2. Try logging in with a phone number</Text>
        <Text>3. Check console logs for API requests/responses</Text>
        <Text>4. Verify OTP from console logs</Text>
      </View>

      <TouchableOpacity 
        style={{ 
          backgroundColor: colors.primary, 
          padding: 15, 
          borderRadius: 8, 
          alignItems: 'center',
          marginBottom: 10
        }}
        onPress={() => console.log('Current auth state:', { user, isAuthenticated, isLoading })}
      >
        <Text style={{ color: colors.white, fontWeight: 'bold' }}>
          Log Auth State to Console
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ 
          backgroundColor: colors.success, 
          padding: 15, 
          borderRadius: 8, 
          alignItems: 'center' 
        }}
        onPress={checkBackendHealth}
      >
        <Text style={{ color: colors.white, fontWeight: 'bold' }}>
          Check Backend Health
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DebugScreen;
