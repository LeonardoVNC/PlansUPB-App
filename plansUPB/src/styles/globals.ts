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
    app_center_container: {
      flex: 1,
      backgroundColor: colors.surface,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    app_scroll: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      backgroundColor: colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 12
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
    app_info_text: {
      fontSize: 12,
      color: colors.subtitle,
      textAlign: 'center',
    },

    app_input: {
      width: '100%',
      height: 50,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      fontSize: 16,
    },
    app_button: {
      width: '100%',
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    app_buttonText: {
      color: colors.contrastText,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
}