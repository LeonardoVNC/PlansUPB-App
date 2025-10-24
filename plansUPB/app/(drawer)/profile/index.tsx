import React, { useEffect, useState } from 'react';
import { Text, View, Switch, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { useThemeColors } from '@hooks/useThemeColors';
import { useThemeStore } from '@store/useThemeStore';
import { useAuthContext } from '@context/AuthContext';
import { getUserByUid } from '@services/userService';
import type { UserProfile } from '@interfaces/user.interfaces';
import { globalStyles } from '@styles/globals';
import { ThemeColors } from '@styles/colors';

export default function ProfileScreen() {
    const { theme, colors } = useThemeColors();
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const { user: authUser } = useAuthContext();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const appStyles = globalStyles();
    const styles = React.useMemo(() => createStyles(colors), [colors]);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (authUser?.uid) {
                try {
                    const profile = await getUserByUid(authUser.uid);
                    setUserProfile(profile);
                } catch (error) {
                    console.error('Error cargando perfil:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        loadUserProfile();
    }, [authUser]);

    if (loading) {
        return (
            <ScreenTemplate>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>
                        Cargando perfil...
                    </Text>
                </View>
            </ScreenTemplate>
        );
    }

    if (!userProfile) {
        return (
            <ScreenTemplate>
                <View style={styles.loadingContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={colors.subtitle} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>
                        No se pudo cargar el perfil
                    </Text>
                </View>
            </ScreenTemplate>
        );
    }

    return (
        <ScreenTemplate>
            <>
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            {userProfile.photoUrl ? (
                                <Image 
                                    source={{ uri: userProfile.photoUrl }} 
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <Ionicons name="person-circle" size={80} color={colors.text} />
                            )}
                            <View style={styles.cameraIconContainer}>
                                <Ionicons name="camera" size={20} color={colors.text} />
                            </View>
                        </View>
                        <Text style={styles.userName}>{userProfile.name}</Text>
                        <Text style={styles.userUsername}>@{userProfile.username}</Text>
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Código UPB</Text>
                        </View>
                        <Text style={styles.infoText}>{userProfile.code}</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                        </View>
                        <Text style={styles.infoText}>{userProfile.email}</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Carrera</Text>
                        </View>
                        <Text style={styles.infoText}>{userProfile.career}</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Escuela</Text>
                        </View>
                        <Text style={styles.infoText}>{userProfile.school}</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Facultad</Text>
                        </View>
                        <Text style={styles.infoText}>{userProfile.faculty}</Text>

                        {userProfile.bio && (
                            <>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Biografía</Text>
                                </View>
                                <Text style={styles.infoText}>{userProfile.bio}</Text>
                            </>
                        )}

                        <View style={styles.statusBadge}>
                            <View style={[
                                styles.statusDot, 
                                { backgroundColor: userProfile.isActive ? '#22c55e' : '#ef4444' }
                            ]} />
                            <Text style={styles.statusText}>
                                {userProfile.isActive ? 'Activo' : 'Inactivo'}
                            </Text>
                            <View style={styles.roleBadge}>
                                <Text style={styles.roleText}>{userProfile.role}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Text style={appStyles.app_subtitle}>
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
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
        },
        loadingText: {
            fontSize: 16,
            fontWeight: '500',
        },
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
        avatarImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
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
        userUsername: {
            fontSize: 14,
            color: colors.subtitle,
            marginTop: 4,
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
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.border,
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        statusText: {
            fontSize: 14,
            color: colors.text,
            fontWeight: '500',
        },
        roleBadge: {
            backgroundColor: colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
        },
        roleText: {
            fontSize: 12,
            color: '#ffffff',
            fontWeight: '600',
        },
    });

