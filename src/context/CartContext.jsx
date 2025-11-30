import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../config/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CART_STORAGE_KEY = 'cart_items';

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

  // Load cart from storage on mount
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const loadCartFromStorage = async () => {
    try {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };

  const saveCartToStorage = async (items) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
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

