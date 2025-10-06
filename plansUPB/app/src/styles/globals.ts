import { StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

export const globalStyles = () => {
  const { colors } = useThemeColors();

  return StyleSheet.create({
    app_container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: colors.background,
    },
    app_title: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 12,
      color: colors.text,
    },
    app_subtitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.subtitle,
    },
  });
}