import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f4f5f7',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background || '#f4f5f7',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    marginBottom: 10,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  welcomeGreeting: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  welcomeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white || colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  subtitleText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 4,
  },
});


