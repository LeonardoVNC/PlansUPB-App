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
      backgroundColor: colors.background,
      paddingTop: 4,
      paddingHorizontal: 8,
    },
    app_center_container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 4,
      paddingHorizontal: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    app_scroll: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      backgroundColor: colors.background,
      paddingTop: 2,
      paddingHorizontal: 8,
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

    app_label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    app_input_wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: colors.surface,
      gap: 8,
    },
    app_input: {
      flex: 1,
      height: 45,
      fontSize: 16,
      color: colors.text,
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
    app_button_disabled: {
      opacity: 0.6,
    },
    app_buttonText: {
      color: colors.contrastText,
      fontSize: 18,
      fontWeight: 'bold',
    },
    app_feedback: {
      fontSize: 14,
      textAlign: 'center',
      marginVertical: 8,
    },
    app_feedback_error: {
      color: '#dc2626',
    },
    app_feedback_success: {
      color: '#16a34a',
    },
    app_link: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
      textAlign: 'center',
    },
    app_footer_row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    app_footer_text: {
      fontSize: 14,
      color: colors.subtitle,
    },
    app_card: {
      marginBottom: 16, 
      padding: 16, 
      borderRadius: 12,
      backgroundColor: colors.surface
    }
  });
}