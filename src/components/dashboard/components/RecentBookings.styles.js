import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  recentBookings: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  bookingList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  bookingWorker: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  bookingTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bookingStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completedStatus: {
    backgroundColor: colors.success,
  },
  confirmedStatus: {
    backgroundColor: colors.info,
  },
});


