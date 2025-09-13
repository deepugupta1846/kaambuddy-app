# KaamBuddy API Integration Guide

This guide explains how the frontend React Native app is integrated with the backend Node.js API.

## Overview

The frontend app now uses a comprehensive API service layer that connects to the backend for all data operations. The integration includes:

- **Authentication**: Login, registration, OTP verification
- **User Management**: Profile updates, user data
- **Job Management**: Create, list, update, cancel jobs
- **Booking Management**: Apply for jobs, manage bookings, status updates
- **Notifications**: Fetch, mark as read, manage notifications

## Architecture

### API Service Layer (`src/config/api.js`)

The main API service class handles:
- HTTP requests with authentication headers
- Token management (storage and retrieval)
- Error handling and retry logic
- Request/response interceptors

### Context Providers

The app uses React Context for state management:

1. **AuthContext** (`src/context/AuthContext.jsx`)
   - Manages user authentication state
   - Handles login, logout, profile updates
   - Stores user data and tokens

2. **JobContext** (`src/context/JobContext.jsx`)
   - Manages job-related operations
   - Handles job creation, listing, updates

3. **BookingContext** (`src/context/BookingContext.jsx`)
   - Manages booking operations
   - Handles job applications, booking status changes

4. **NotificationContext** (`src/context/NotificationContext.jsx`)
   - Manages notifications
   - Handles notification fetching and status updates

## Setup Instructions

### 1. Backend Setup

Ensure your backend server is running:

```bash
cd kaambuddy-backend
npm install
npm start
```

The backend should be running on `http://localhost:3000` (or update the API_BASE_URL in `src/config/api.js`).

### 2. Frontend Dependencies

Install required dependencies:

```bash
cd kaambuddy
npm install @react-native-async-storage/async-storage
```

### 3. Environment Configuration

Update the API configuration in `src/config/api.js`:

```javascript
const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://your-production-domain.com/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
```

For Android development, you may need to use `10.0.2.2` instead of `localhost`.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login with phone number |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/resend-otp` | Resend OTP |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout user |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get user profile |
| PUT | `/users/profile` | Update user profile |
| GET | `/users/workers` | List workers |
| GET | `/users/workers/:id` | Get worker profile |
| PUT | `/users/fcm-token` | Update FCM token |
| DELETE | `/users/deactivate` | Deactivate account |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jobs` | Create new job |
| GET | `/jobs` | List all jobs |
| GET | `/jobs/:id` | Get specific job |
| PUT | `/jobs/:id` | Update job |
| DELETE | `/jobs/:id` | Cancel job |
| GET | `/jobs/user/me` | Get user's jobs |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings/jobs/:jobId/apply` | Apply for job |
| GET | `/bookings` | Get user's bookings |
| GET | `/bookings/:id` | Get specific booking |
| PUT | `/bookings/:id/accept` | Accept booking |
| PUT | `/bookings/:id/reject` | Reject booking |
| PUT | `/bookings/:id/start` | Start job |
| PUT | `/bookings/:id/complete` | Complete job |
| DELETE | `/bookings/:id` | Cancel booking |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get notifications |
| GET | `/notifications/unread-count` | Get unread count |
| PUT | `/notifications/:id/read` | Mark as read |
| PUT | `/notifications/read-all` | Mark all as read |
| DELETE | `/notifications/:id` | Delete notification |
| DELETE | `/notifications` | Delete all notifications |

## Usage Examples

### Authentication

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { login, verifyOTP, user, isAuthenticated, logout } = useAuth();

  const handleLogin = async () => {
    try {
      const result = await login('+919876543210');
      if (result.success) {
        // OTP sent successfully
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const result = await verifyOTP('+919876543210', '1234');
      if (result.success) {
        // Login successful
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };
};
```

### Job Management

```javascript
import { useJobs } from '../context/JobContext';

const MyComponent = () => {
  const { createJob, listJobs, jobs, isLoading } = useJobs();

  const handleCreateJob = async () => {
    try {
      const jobData = {
        title: 'Plumbing Work',
        description: 'Need a plumber for bathroom repair',
        category: 'Plumbing',
        budget: 1500,
        location: 'Mumbai'
      };
      
      const result = await createJob(jobData);
      if (result.success) {
        // Job created successfully
      }
    } catch (error) {
      console.error('Job creation failed:', error);
    }
  };

  useEffect(() => {
    listJobs();
  }, []);
};
```

### Booking Management

```javascript
import { useBookings } from '../context/BookingContext';

const MyComponent = () => {
  const { applyForJob, getUserBookings, acceptBooking, bookings } = useBookings();

  const handleApplyForJob = async (jobId) => {
    try {
      const applicationData = {
        message: 'I can help with this job',
        proposedRate: 1200
      };
      
      const result = await applyForJob(jobId, applicationData);
      if (result.success) {
        // Application submitted successfully
      }
    } catch (error) {
      console.error('Application failed:', error);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const result = await acceptBooking(bookingId);
      if (result.success) {
        // Booking accepted successfully
      }
    } catch (error) {
      console.error('Accept booking failed:', error);
    }
  };
};
```

### Notifications

```javascript
import { useNotifications } from '../context/NotificationContext';

const MyComponent = () => {
  const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      // Notification marked as read
    } catch (error) {
      console.error('Mark as read failed:', error);
    }
  };
};
```

## Error Handling

The API service includes comprehensive error handling:

- **Network errors**: Automatic retry with exponential backoff
- **Authentication errors**: Automatic logout and redirect to login
- **Server errors**: User-friendly error messages
- **Validation errors**: Field-specific error messages

### Error Response Format

```javascript
{
  success: false,
  message: "Error message",
  errors: {
    field: "Field-specific error"
  }
}
```

## Token Management

The app automatically manages authentication tokens:

- **Storage**: Tokens are stored securely using AsyncStorage
- **Refresh**: Automatic token refresh when needed
- **Cleanup**: Tokens are cleared on logout or expiration

## Testing

### Backend Health Check

Test if the backend is running:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "KaamBuddy API is running",
  "version": "1.0.0",
  "environment": "development"
}
```

### API Testing

You can test individual endpoints using tools like Postman or curl:

```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Test job creation (with auth token)
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Test Job", "description": "Test description", "budget": 1000}'
```

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure backend server is running
2. **CORS errors**: Check CORS configuration in backend
3. **Authentication errors**: Verify token storage and refresh logic
4. **Network timeouts**: Check API timeout configuration

### Debug Mode

Enable debug logging by setting `__DEV__` to true or adding console logs:

```javascript
// In api.js
console.log('API Request:', { url, method, headers, body });
console.log('API Response:', response);
```

### Network Configuration

For Android development:
- Use `10.0.2.2` instead of `localhost`
- Ensure proper network permissions in `AndroidManifest.xml`

For iOS development:
- Use `localhost` or your machine's IP address
- Check network security settings

## Security Considerations

1. **Token Storage**: Tokens are stored securely using AsyncStorage
2. **HTTPS**: Use HTTPS in production
3. **Input Validation**: All inputs are validated on both frontend and backend
4. **Rate Limiting**: Backend implements rate limiting
5. **Error Handling**: Sensitive information is not exposed in error messages

## Performance Optimization

1. **Caching**: Implement caching for frequently accessed data
2. **Pagination**: Use pagination for large datasets
3. **Lazy Loading**: Load data only when needed
4. **Optimistic Updates**: Update UI immediately, sync with server later

## Future Enhancements

1. **Real-time Updates**: Implement WebSocket connections
2. **Offline Support**: Add offline data synchronization
3. **Push Notifications**: Integrate push notification service
4. **File Upload**: Add support for file uploads
5. **Payment Integration**: Integrate payment gateway APIs

## Support

For issues or questions:
1. Check the backend logs for server-side errors
2. Use browser developer tools for network debugging
3. Review the API documentation for endpoint details
4. Check the error handling in the context providers
