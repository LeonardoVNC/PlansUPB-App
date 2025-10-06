import React from 'react';
import { Text, View, Switch, StyleSheet } from 'react-native';
import { globalStyles } from '../../../src/styles/globals';
import { useThemeStore } from '../../../src/store/useThemeStore';
import { useThemeColors } from '../../../src/hooks/useThemeColors';
import { ThemeColors } from '../../../src/styles/colors';
import ScreenTemplate from '../../../src/components/ScreenTemplate';

export default function ProfileScreen() {
    const { theme, colors } = useThemeColors();
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const styles = React.useMemo(() => createStyles(colors), [colors]);

    return (
        <ScreenTemplate title='Mi Perfil' subtitle='Detalles sobre tu perfil'>
            <>
                <Text style={globalStyles().app_subtitle}>
                    Mis preferencias
                </Text>
                <View style={styles.preferenceRow}>
                    <Text style={styles.preferenceLabel}>
                        Modo oscuro
                    </Text>
                    <Switch
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
                        thumbColor={theme === 'dark' ? colors.switchThumb : '#f4f4f5'}
                    />
                </View>
            </>
        </ScreenTemplate>
    );
}

const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        preferenceRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderRadius: 16,
            backgroundColor: colors.surface,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            marginBottom: 12,
        },
        preferenceLabel: {
            fontSize: 18,
            color: colors.text,
            fontWeight: '500',
        }
    });

