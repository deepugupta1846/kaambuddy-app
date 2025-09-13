import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../config/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getNotifications();
      
      if (response.success) {
        setNotifications(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch notifications');
    } catch (error) {
      setError(error.message);
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await apiService.getUnreadCount();
      
      if (response.success) {
        setUnreadCount(response.data.count);
        return response.data.count;
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setError(null);
      const response = await apiService.markAsRead(notificationId);
      
      if (response.success) {
        // Update notification in list
        setNotifications(prev => prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        ));
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        return response;
      }
      
      throw new Error(response.message || 'Failed to mark notification as read');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      setError(null);
      const response = await apiService.markAllAsRead();
      
      if (response.success) {
        // Mark all notifications as read
        setNotifications(prev => prev.map(notification => ({
          ...notification,
          isRead: true
        })));
        
        // Reset unread count
        setUnreadCount(0);
        return response;
      }
      
      throw new Error(response.message || 'Failed to mark all notifications as read');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setError(null);
      const response = await apiService.deleteNotification(notificationId);
      
      if (response.success) {
        // Remove notification from list
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
        
        // Update unread count if notification was unread
        const deletedNotification = notifications.find(n => n.id === notificationId);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        return response;
      }
      
      throw new Error(response.message || 'Failed to delete notification');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteAllNotifications = async () => {
    try {
      setError(null);
      const response = await apiService.deleteAllNotifications();
      
      if (response.success) {
        // Clear all notifications
        setNotifications([]);
        setUnreadCount(0);
        return response;
      }
      
      throw new Error(response.message || 'Failed to delete all notifications');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification,
    clearError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
