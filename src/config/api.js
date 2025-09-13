import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://your-production-domain.com/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
};

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  // Get auth token from storage
  async getAuthToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Set auth token in storage
  async setAuthToken(token) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  // Remove auth token from storage
  async removeAuthToken() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Get user data from storage
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Set user data in storage
  async setUserData(userData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  }

  // Remove user data from storage
  async removeUserData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  }

  // Generic request method with retry logic
  async request(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getAuthToken();

    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    console.log('API Request Body:', options.body);

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method: 'GET',
      headers: defaultHeaders,
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different response status codes
      if (response.status === 401) {
        // Unauthorized - clear tokens and redirect to login
        await this.logout();
        throw new Error('Authentication failed. Please login again.');
      }

      if (response.status === 403) {
        throw new Error('Access denied. You do not have permission to perform this action.');
      }

      if (response.status === 404) {
        throw new Error('Resource not found.');
      }

      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      const data = await response.json();
      
      console.log('API Response Status:', response.status);
      console.log('API Response Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Request Error (${endpoint}):`, error);

      // Retry logic for network errors
      if (retryCount < this.retryAttempts && 
          (error.name === 'AbortError' || error.message.includes('Network'))) {
        console.log(`Retrying request (${retryCount + 1}/${this.retryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.request(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  }

  // Logout method
  async logout() {
    try {
      await this.removeAuthToken();
      await this.removeUserData();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Auth API methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async login(phoneNumber) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { phone: phoneNumber },
    });
  }

  async verifyOTP(phoneNumber, otp) {
    console.log('API: Verifying OTP for phone:', phoneNumber);
    const response = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: { phone: phoneNumber, otp },
    });
    console.log('API: OTP verification response:', response);
    return response;
  }

  async resendOTP(phoneNumber) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: { phone: phoneNumber },
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logoutUser() {
    const result = await this.request('/auth/logout', {
      method: 'POST',
    });
    await this.logout();
    return result;
  }

  // User API methods
  async getUserProfile(userId) {
    return this.request(`/users/${userId}`);
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: profileData,
    });
  }

  async listWorkers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/users/workers?${queryParams}`);
  }

  async getWorkerProfile(workerId) {
    return this.request(`/users/workers/${workerId}`);
  }

  async updateFCMToken(token) {
    return this.request('/users/fcm-token', {
      method: 'PUT',
      body: { fcmToken: token },
    });
  }

  async deactivateAccount() {
    const result = await this.request('/users/deactivate', {
      method: 'DELETE',
    });
    await this.logout();
    return result;
  }

  // Jobs API methods
  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: jobData,
    });
  }

  async listJobs(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/jobs?${queryParams}`);
  }

  async getJob(jobId) {
    return this.request(`/jobs/${jobId}`);
  }

  async updateJob(jobId, jobData) {
    return this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: jobData,
    });
  }

  async cancelJob(jobId) {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async getUserJobs() {
    return this.request('/jobs/user/me');
  }

  // Bookings API methods
  async applyForJob(jobId, applicationData) {
    return this.request(`/bookings/jobs/${jobId}/apply`, {
      method: 'POST',
      body: applicationData,
    });
  }

  async getUserBookings() {
    return this.request('/bookings');
  }

  async getBooking(bookingId) {
    return this.request(`/bookings/${bookingId}`);
  }

  async acceptBooking(bookingId) {
    return this.request(`/bookings/${bookingId}/accept`, {
      method: 'PUT',
    });
  }

  async rejectBooking(bookingId) {
    return this.request(`/bookings/${bookingId}/reject`, {
      method: 'PUT',
    });
  }

  async startJob(bookingId) {
    return this.request(`/bookings/${bookingId}/start`, {
      method: 'PUT',
    });
  }

  async completeJob(bookingId) {
    return this.request(`/bookings/${bookingId}/complete`, {
      method: 'PUT',
    });
  }

  async cancelBooking(bookingId) {
    return this.request(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  // Notifications API methods
  async getNotifications() {
    return this.request('/notifications');
  }

  async getUnreadCount() {
    return this.request('/notifications/unread-count');
  }

  async markAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  async deleteAllNotifications() {
    return this.request('/notifications', {
      method: 'DELETE',
    });
  }

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      const data = await response.json();
      console.log('Health check response:', data);
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export storage keys for external use
export { STORAGE_KEYS };
