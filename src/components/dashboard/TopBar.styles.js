import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  topBarContainer: {
    // paddingTop: 50, // Add extra padding for status bar
    backgroundColor: colors.surface,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50, // Add extra padding for status bar
    paddingBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topBarLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.textLight,
  },
  profileImagePlaceholderSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.textLight,
  },
  profileImageTextSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  titleContainer: {
    flex: 1,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: 4,
  },
  // Location header styles (for home tab)
  locationHeaderContainer: {
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
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  // Default top bar location styles (for other tabs)
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationLoader: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.textLight,
    opacity: 0.9,
    maxWidth: 200,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarButton: {
    marginLeft: 15,
    padding: 5,
  },
  topBarButtonText: {
    fontSize: 20,
  },
});









