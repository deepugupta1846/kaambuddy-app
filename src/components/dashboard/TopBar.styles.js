import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
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
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textLight,
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


