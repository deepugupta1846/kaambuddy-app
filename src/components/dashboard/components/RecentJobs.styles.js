import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  recentJobs: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  jobList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  jobCustomer: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  jobTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  jobPayment: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  jobStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completedStatus: {
    backgroundColor: colors.success,
  },
  pendingStatus: {
    backgroundColor: colors.warning,
  },
  inProgressStatus: {
    backgroundColor: colors.primary,
  },
});


