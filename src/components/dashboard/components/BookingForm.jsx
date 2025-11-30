import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
// Note: Install @react-native-community/datetimepicker for date/time picker
// npm install @react-native-community/datetimepicker
// For now, using a simple text input approach
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './BookingForm.styles';
import colors from '../../../theme/colors';

const BookingForm = ({ visible, service, category, onClose, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple date/time input handler
  const handleDateTimeChange = () => {
    if (dateInput && timeInput) {
      const [year, month, day] = dateInput.split('-').map(Number);
      const [hours, minutes] = timeInput.split(':').map(Number);
      const newDate = new Date(year, month - 1, day, hours, minutes);
      if (!isNaN(newDate.getTime())) {
        setScheduledDate(newDate);
      }
    }
  };

  // Set default date/time inputs
  React.useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setDateInput(dateStr);
    setTimeInput(timeStr);
    handleDateTimeChange();
  }, []);

  React.useEffect(() => {
    handleDateTimeChange();
  }, [dateInput, timeInput]);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    if (scheduledDate < new Date()) {
      Alert.alert('Error', 'Please select a future date and time');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        service,
        category,
        description: description.trim(),
        scheduledDate: scheduledDate.toISOString(),
      });
      // Reset form
      setDescription('');
      setScheduledDate(new Date());
      onClose();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add to cart');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!service) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Book Service</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="times" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Service Info */}
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              {category && (
                <Text style={styles.categoryName}>{category.name}</Text>
              )}
              {service.price && (
                <Text style={styles.servicePrice}>₹{service.price}</Text>
              )}
            </View>

            {/* Description Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe your requirements..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Schedule Date */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Schedule Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
                value={dateInput}
                onChangeText={setDateInput}
                keyboardType="numeric"
              />
            </View>

            {/* Schedule Time */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Schedule Time *</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM (24-hour format)"
                placeholderTextColor={colors.textSecondary}
                value={timeInput}
                onChangeText={setTimeInput}
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Adding...' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BookingForm;

