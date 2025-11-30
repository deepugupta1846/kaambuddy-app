import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 120,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 8,
  },
});

