import { StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

export const globalStyles = () => {
  const { colors } = useThemeColors();

  return StyleSheet.create({
    safeArea: { 
      flex: 1, 
      backgroundColor: colors.background,
    },
    app_container: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 12,
    },
    app_title: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 12,
      color: colors.text,
    },
    app_subtitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.subtitle,
    },
  });
}