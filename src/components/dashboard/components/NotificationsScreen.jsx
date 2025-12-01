import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNotifications } from '../../../context/NotificationContext';
import styles from '../tabs/BookingsTab.styles';

const NotificationsScreen = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.bookingItem,
        !item.isRead && { borderLeftWidth: 4, borderLeftColor: '#fdd017' },
      ]}
      onPress={() => {
        if (!item.isRead) {
          markAsRead(item.id);
        }
      }}
    >
      <Text style={styles.bookingTitle}>{item.title}</Text>
      <Text style={styles.bookingStatus}>{item.message}</Text>
      <Text style={styles.bookingDate}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#fdd017" />
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <Text style={styles.tabTitle}>
        Notifications {unreadCount > 0 ? `(${unreadCount} new)` : ''}
      </Text>
      {notifications.length === 0 ? (
        <Text style={styles.comingSoon}>No notifications yet</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default NotificationsScreen;


