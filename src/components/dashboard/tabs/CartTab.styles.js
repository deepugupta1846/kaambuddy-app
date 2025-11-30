import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});

