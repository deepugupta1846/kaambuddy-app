import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});


