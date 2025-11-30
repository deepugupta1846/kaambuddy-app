import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './CartTab.styles';

const CartTab = () => {
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
        <TouchableOpacity style={styles.browseButton}>
          <Text style={styles.browseButtonText}>Browse Services</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CartTab;

