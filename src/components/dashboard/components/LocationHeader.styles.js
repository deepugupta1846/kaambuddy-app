import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  areaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 4,
    flex: 1,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

