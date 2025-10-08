import React from 'react';
import { Text, View, Switch, StyleSheet } from 'react-native';
import { globalStyles } from '../../../../src/styles/globals';
import { useThemeStore } from '../../../../src/store/useThemeStore';
import { useThemeColors } from '../../../../src/hooks/useThemeColors';
import { ThemeColors } from '../../../../src/styles/colors';
import ScreenTemplate from '../../../../src/components/ScreenTemplate';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const { theme, colors } = useThemeColors();
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const styles = React.useMemo(() => createStyles(colors), [colors]);

    return (
        <ScreenTemplate title='Mi Perfil' subtitle='Detalles sobre tu perfil'>
            <>
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View>
                                <Ionicons name="person-circle" size={80} color={colors.text} />
                                <View style={styles.cameraIconContainer}>
                                    <Ionicons name="camera" size={20} color={colors.text} />
                                </View>
                            </View>
                        </View>
                        <Text style={styles.userName}>Lupita Kush</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Carrera</Text>
                            <Ionicons name="pencil" size={20} color={colors.text} />
                        </View>
                        <Text style={styles.infoText}>Comunicacion</Text>
                        
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Mi Descripción:</Text>
                            <Ionicons name="pencil" size={20} color={colors.text} />
                        </View>
                        <Text style={styles.infoText}>
                            "Chava" Amigable y guapa.
                        </Text>
                    </View>
                </View>

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
        },
        profileCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
        },
        profileHeader: {
            alignItems: 'center',
            marginBottom: 16,
        },
        avatarContainer: {
            marginBottom: 8,
            position: 'relative',
        },
        cameraIconContainer: {
            position: 'absolute',
            bottom: 0,
            right: -5,
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 4,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
        },
        userName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
        },
        infoContainer: {
            gap: 8,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        infoLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginTop: 8,
        },
        infoText: {
            fontSize: 14,
            color: colors.subtitle,
        }
    });

