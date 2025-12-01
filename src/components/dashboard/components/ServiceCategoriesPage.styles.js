import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 3; // 3 columns with padding

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'flex-end',
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerIconText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

   bookingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  bookingStatus: {
    fontSize: 16,
    color: '#444444',
    marginBottom: 8,
    paddingHorizontal: 16,
    lineHeight: 22,
  },

  bookingDate: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 16,
    paddingHorizontal: 16,
  },

  /* ---------------- ACTION BUTTON ---------------- */
  actionButton: {
    width: '90%',
    marginHorizontal: '5%',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  acceptButton: {
    backgroundColor: '#2F80ED',
  },

  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginHorizontal: '5%',
    marginTop: 20,
    marginBottom: 20,
  },

  actionButtonSmall: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  actionButtonSmallText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  cancelButton: {
    backgroundColor: '#E53935', // red
  },

  paymentButton: {
    backgroundColor: '#2F80ED', // blue
  },
});

