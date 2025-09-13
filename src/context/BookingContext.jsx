import React, { createContext, useContext, useState } from 'react';
import apiService from '../config/api';

const BookingContext = createContext();

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyForJob = async (jobId, applicationData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.applyForJob(jobId, applicationData);
      
      if (response.success) {
        // Add new booking to list
        setBookings(prev => [response.data, ...prev]);
        return response;
      }
      
      throw new Error(response.message || 'Failed to apply for job');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getUserBookings();
      
      if (response.success) {
        setBookings(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch bookings');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getBooking(bookingId);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch booking');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.acceptBooking(bookingId);
      
      if (response.success) {
        // Update booking status in list
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'accepted' } : booking
        ));
        return response;
      }
      
      throw new Error(response.message || 'Failed to accept booking');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.rejectBooking(bookingId);
      
      if (response.success) {
        // Update booking status in list
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'rejected' } : booking
        ));
        return response;
      }
      
      throw new Error(response.message || 'Failed to reject booking');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const startJob = async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.startJob(bookingId);
      
      if (response.success) {
        // Update booking status in list
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'in_progress' } : booking
        ));
        return response;
      }
      
      throw new Error(response.message || 'Failed to start job');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeJob = async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.completeJob(bookingId);
      
      if (response.success) {
        // Update booking status in list
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'completed' } : booking
        ));
        return response;
      }
      
      throw new Error(response.message || 'Failed to complete job');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.cancelBooking(bookingId);
      
      if (response.success) {
        // Remove booking from list
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
        return response;
      }
      
      throw new Error(response.message || 'Failed to cancel booking');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    bookings,
    isLoading,
    error,
    applyForJob,
    getUserBookings,
    getBooking,
    acceptBooking,
    rejectBooking,
    startJob,
    completeJob,
    cancelBooking,
    clearError,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
