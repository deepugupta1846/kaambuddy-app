import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../config/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CART_STORAGE_KEY = 'cart_items';

const getCartStorageKey = (userId) => {
  return userId ? `${CART_STORAGE_KEY}_${userId}` : CART_STORAGE_KEY;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from storage on mount and when user changes
  useEffect(() => {
    if (user && user.id) {
      loadCartFromStorage(user.id);
    } else {
      // Clear cart in memory if no user is logged in
      setCartItems([]);
    }
  }, [user && user.id]);

  const loadCartFromStorage = async (userId) => {
    try {
      const storageKey = getCartStorageKey(userId);
      const storedCart = await AsyncStorage.getItem(storageKey);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };

  const saveCartToStorage = async (items) => {
    try {
      const storageKey = getCartStorageKey(user && user.id);
      await AsyncStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const addToCart = async (bookingData) => {
    try {
      setIsLoading(true);
      
      // Create a cart item with unique ID
      const cartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        service: bookingData.service,
        category: bookingData.category,
        description: bookingData.description,
        scheduledDate: bookingData.scheduledDate,
        // Keep references so backend can log service item booking
        serviceId: bookingData.service?.serviceId || bookingData.category?.serviceId || bookingData.service?.service_id || bookingData.category?.service_id || bookingData.service?.id,
        categoryId: bookingData.category?.id || bookingData.category?._id,
        serviceItemId: bookingData.service?.id || bookingData.service?._id,
        createdAt: new Date().toISOString(),
        status: 'pending', // pending, booked, cancelled
      };

      const updatedCart = [...cartItems, cartItem];
      setCartItems(updatedCart);
      await saveCartToStorage(updatedCart);

      return { success: true, data: cartItem };
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      await saveCartToStorage(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const bookCartItem = async (itemId) => {
    try {
      setIsLoading(true);
      const item = cartItems.find(cartItem => cartItem.id === itemId);
      if (!item) {
        throw new Error('Cart item not found');
      }
      
      // Create job via API
      const price = item.service.price || item.service.cost || 0;
      const jobData = {
        title: `${item.service.name} - ${item.category?.name || ''}`,
        description: item.description,
        category: item.category?.name?.toLowerCase() || item.service.name?.toLowerCase(),
        budgetMin: price,
        budgetMax: price,
        location: user?.address || 'Location to be specified',
        scheduledDate: item.scheduledDate,
        // Extra metadata so backend can create service_item_bookings entry
        serviceId: item.serviceId,
        categoryId: item.categoryId,
        serviceItemId: item.serviceItemId,
      };

      const response = await apiService.createJob(jobData);
      
      if (response.success) {
        // Remove from cart
        await removeFromCart(itemId);
        return response;
      }
      
      throw new Error(response.message || 'Failed to book service');
    } catch (error) {
      console.error('Error booking cart item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const bookAllCartItems = async () => {
    try {
      setIsLoading(true);
      const results = [];
      
      for (const item of cartItems) {
        try {
          const result = await bookCartItem(item.id);
          results.push({ success: true, itemId: item.id, data: result });
        } catch (error) {
          results.push({ success: false, itemId: item.id, error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('Error booking all cart items:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getCartCount = () => cartItems.length;

  const value = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    bookCartItem,
    bookAllCartItems,
    clearCart,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

