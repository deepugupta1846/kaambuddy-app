import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import styles from './CartTab.styles';
import colors from '../../../theme/colors';

const CartTab = ({ onNavigateToServices }) => {
  const { cartItems, removeFromCart, bookCartItem, bookAllCartItems, isLoading } = useCart();
  const { user } = useAuth();
  const [bookingItemId, setBookingItemId] = useState(null);

  const handleBookItem = async (itemId) => {
    try {
      setBookingItemId(itemId);
      await bookCartItem(itemId);
      Alert.alert(
        'Success',
        'Service booked successfully! Workers will be notified.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to book service. Please try again.');
    } finally {
      setBookingItemId(null);
    }
  };

  const handleBookAll = async () => {
    Alert.alert(
      'Book All Services',
      `Are you sure you want to book all ${cartItems.length} service(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book All',
          onPress: async () => {
            try {
              const results = await bookAllCartItems();
              const successCount = results.filter(r => r.success).length;
              const failCount = results.filter(r => !r.success).length;
              
              if (failCount === 0) {
                Alert.alert('Success', `All ${successCount} service(s) booked successfully!`);
              } else {
                Alert.alert(
                  'Partial Success',
                  `${successCount} service(s) booked successfully. ${failCount} failed.`
                );
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to book services. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(itemId),
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (cartItems.length === 0) {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyContainer}>
          <Icon name="shopping-cart" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add services to your cart to get started
          </Text>
          {onNavigateToServices && (
            <TouchableOpacity style={styles.browseButton} onPress={onNavigateToServices}>
              <Text style={styles.browseButtonText}>Browse Services</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart ({cartItems.length})</Text>
        {cartItems.length > 1 && (
          <TouchableOpacity
            style={styles.bookAllButton}
            onPress={handleBookAll}
            disabled={isLoading}
          >
            <Text style={styles.bookAllButtonText}>Book All</Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.map((item) => (
        <View key={item.id} style={styles.cartItem}>
          <View style={styles.cartItemHeader}>
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemTitle}>{item.service.name}</Text>
              {item.category && (
                <Text style={styles.cartItemCategory}>{item.category.name}</Text>
              )}
              {item.service.price && (
                <Text style={styles.cartItemPrice}>₹{item.service.price}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Icon name="times" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {item.description && (
            <View style={styles.cartItemDescription}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          )}

          <View style={styles.cartItemSchedule}>
            <Icon name="calendar-alt" size={16} color={colors.primary} />
            <Text style={styles.scheduleText}>{formatDate(item.scheduledDate)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.bookButton, (isLoading && bookingItemId === item.id) && styles.bookButtonDisabled]}
            onPress={() => handleBookItem(item.id)}
            disabled={isLoading && bookingItemId === item.id}
          >
            {isLoading && bookingItemId === item.id ? (
              <ActivityIndicator size="small" color={colors.textLight} />
            ) : (
              <Text style={styles.bookButtonText}>Book Now</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default CartTab;

