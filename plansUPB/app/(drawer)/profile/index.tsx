import React, { useState } from 'react';
import { Text, View, Switch, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { useThemeColors } from '@hooks/useThemeColors';
import { useThemeStore } from '@store/useThemeStore';
import { useUserStore } from '@store/useUserStore';
import { globalStyles } from '@styles/globals';
import { ThemeColors } from '@styles/colors';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary, validateCloudinaryConfig } from '@services/cloudinary.service';
import { updateUserPhoto, updateUserByUid } from '@services/userService';
import { useTabStore, TabName } from '@store/useTabStore';

const getTabLabel = (tab: TabName): string => {
  const labels: Record<TabName, string> = {
    home: 'Discusiones',
    plans_general: 'Planes',
    plans_self: 'Mis Planes',
    plans_invs: 'Invitaciones',
    plans_fav: 'Guardados',
    maps: 'Mapa',
  };
  return labels[tab] || tab;
};

export default function ProfileScreen() {
    const { theme, colors } = useThemeColors();
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const { user: userProfile, login } = useUserStore();
    const appStyles = globalStyles();
    const styles = React.useMemo(() => createStyles(colors), [colors]);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(userProfile ?? null);
    const { order, hidden, setOrder, setHidden, resetOrder, resetHidden } = useTabStore();

    const handleChangePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    'Permisos necesarios',
                    'Necesitamos acceso a tu galería para cambiar tu foto de perfil'
                );
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled || !result.assets[0]) {
                return;
            }

            setUploadingPhoto(true);

            if (!validateCloudinaryConfig()) {
                Alert.alert(
                    'Configuración incompleta',
                    'Cloudinary no está configurado correctamente. Por favor, configura las variables de entorno.'
                );
                setUploadingPhoto(false);
                return;
            }

            const photoUrl = await uploadImageToCloudinary(result.assets[0].uri, 'profiles');

            if (userProfile?.uid) {
                await updateUserPhoto(userProfile.uid, photoUrl);
                
                login({
                    ...userProfile,
                    photoUrl
                });

                Alert.alert('¡Éxito!', 'Tu foto de perfil se actualizó correctamente');
            }
        } catch (error) {
            console.error('Error changing photo:', error);
            Alert.alert('Error', 'No se pudo actualizar la foto de perfil');
        } finally {
            setUploadingPhoto(false);
        }
    };

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
                            {uploadingPhoto ? (
                                <View style={[styles.avatarImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.border }]}>
                                    <ActivityIndicator size="large" color={colors.primary} />
                                </View>
                            ) : (
                                <>
                                    {userProfile.photoUrl ? (
                                        <Image 
                                            source={{ uri: userProfile.photoUrl }} 
                                            style={styles.avatarImage}
                                        />
                                    ) : (
                                        <Ionicons name="person-circle" size={80} color={colors.text} />
                                    )}
                                    <TouchableOpacity 
                                        style={styles.cameraIconContainer}
                                        onPress={handleChangePhoto}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="camera" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                        {editing ? (
                            <>
                                <TextInput
                                    style={styles.editableName}
                                    value={formData?.name ?? ''}
                                    onChangeText={(t) => setFormData((p: any) => ({ ...p, name: t }))}
                                    placeholder="Nombre"
                                />
                                <TextInput
                                    style={styles.editableUsername}
                                    value={formData?.username ?? ''}
                                    onChangeText={(t) => setFormData((p: any) => ({ ...p, username: t.replace(/^@/, '') }))}
                                    placeholder="Usuario"
                                    autoCapitalize="none"
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.userName}>{userProfile.name}</Text>
                                <Text style={styles.userUsername}>@{userProfile.username}</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Código UPB</Text>
                        </View>
                        <Text style={styles.infoText}>{userProfile.code}</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                        </View>
                        {editing ? (
                            <TextInput
                                style={styles.editInput}
                                value={formData?.email ?? ''}
                                onChangeText={(t) => setFormData((p: any) => ({ ...p, email: t }))}
                                placeholder="correo@ejemplo.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        ) : (
                            <Text style={styles.infoText}>{userProfile.email}</Text>
                        )}

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Carrera</Text>
                        </View>
                        {editing ? (
                            <TextInput
                                style={styles.editInput}
                                value={formData?.career ?? ''}
                                onChangeText={(t) => setFormData((p: any) => ({ ...p, career: t }))}
                                placeholder="Tu carrera"
                            />
                        ) : (
                            <Text style={styles.infoText}>{userProfile.career}</Text>
                        )}

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Escuela</Text>
                        </View>
                        {editing ? (
                            <TextInput
                                style={styles.editInput}
                                value={formData?.school ?? ''}
                                onChangeText={(t) => setFormData((p: any) => ({ ...p, school: t }))}
                                placeholder="Tu escuela"
                            />
                        ) : (
                            <Text style={styles.infoText}>{userProfile.school}</Text>
                        )}

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Facultad</Text>
                        </View>
                        {editing ? (
                            <TextInput
                                style={styles.editInput}
                                value={formData?.faculty ?? ''}
                                onChangeText={(t) => setFormData((p: any) => ({ ...p, faculty: t }))}
                                placeholder="Tu facultad"
                            />
                        ) : (
                            <Text style={styles.infoText}>{userProfile.faculty}</Text>
                        )}

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Biografía</Text>
                        </View>
                        {editing ? (
                            <TextInput
                                style={styles.textArea}
                                value={formData?.bio ?? ''}
                                onChangeText={(t) => setFormData((p: any) => ({ ...p, bio: t }))}
                                placeholder="Cuéntanos algo de ti"
                                multiline
                                numberOfLines={3}
                            />
                        ) : (
                            <Text style={styles.infoText}>{userProfile.bio || '—'}</Text>
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

                <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
                    <TouchableOpacity
                        onPress={async () => {
                            if (!editing) {
                                setFormData(userProfile);
                                setEditing(true);
                                return;
                            }
                            try {
                                if (!formData?.uid) return;
                                await updateUserByUid(formData.uid, {
                                    name: formData.name,
                                    username: formData.username,
                                    bio: formData.bio,
                                    email: formData.email,
                                    career: formData.career,
                                    school: formData.school,
                                    faculty: formData.faculty,
                                });
                                login({ ...userProfile, ...formData });
                                setEditing(false);
                                Alert.alert('Listo', 'Perfil actualizado');
                            } catch (e) {
                                Alert.alert('Error', 'No se pudo guardar el perfil');
                            }
                        }}
                        style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}
                    >
                        <Text style={{ color: colors.text, fontWeight: '600' }}>{editing ? 'Guardar' : 'Editar'}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={appStyles.app_subtitle}>
                    Orden y visibilidad de Tabs
                </Text>
                {order.map((tab, index) => (
                    <View key={tab} style={[styles.preferenceRow, { paddingVertical: 12 }]}>
                        <Text style={styles.preferenceLabel}>{getTabLabel(tab)}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (index === 0) return;
                                    const next = [...order];
                                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                                    setOrder(next as TabName[]);
                                }}
                                style={{ marginRight: 8 }}
                                hitSlop={8}
                            >
                                <Ionicons name="chevron-up" size={20} color={colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (index === order.length - 1) return;
                                    const next = [...order];
                                    [next[index + 1], next[index]] = [next[index], next[index + 1]];
                                    setOrder(next as TabName[]);
                                }}
                                style={{ marginRight: 12 }}
                                hitSlop={8}
                            >
                                <Ionicons name="chevron-down" size={20} color={colors.text} />
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: colors.subtitle, fontSize: 12 }}>Visible</Text>
                                <Switch
                                    value={!hidden?.[tab]}
                                    onValueChange={(val) => {
                                        const nextHidden = !val;
                                        const visibleCount = order.reduce((acc, t) => (hidden?.[t] ? acc : acc + 1), 0);
                                        if (nextHidden && visibleCount <= 1) {
                                            Alert.alert('No permitido', 'Debe quedar al menos una tab visible.');
                                            return;
                                        }
                                        setHidden(tab, nextHidden);
                                    }}
                                    trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
                                    thumbColor={!hidden?.[tab] ? colors.switchThumb : '#f4f4f5'}
                                />
                            </View>
                        </View>
                    </View>
                ))}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity onPress={resetOrder} style={[styles.preferenceRow, { flex: 1, paddingVertical: 12 }]}>
                        <Text style={[styles.preferenceLabel, { textAlign: 'center' }]}>Restablecer orden</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={resetHidden} style={[styles.preferenceRow, { flex: 1, paddingVertical: 12 }]}>
                        <Text style={[styles.preferenceLabel, { textAlign: 'center' }]}>Restablecer visibilidad</Text>
                    </TouchableOpacity>
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
            backgroundColor: colors.primary,
            borderRadius: 16,
            padding: 8,
            borderWidth: 2,
            borderColor: colors.surface,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        userName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
        },
        editableName: {
            fontSize: 20,
            fontWeight: '600',
            color: colors.text,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginTop: 6,
            width: '100%',
            textAlign: 'center',
        },
        userUsername: {
            fontSize: 14,
            color: colors.subtitle,
            marginTop: 4,
        },
        editableUsername: {
            fontSize: 14,
            color: colors.text,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginTop: 6,
            width: '60%',
            alignSelf: 'center',
            textAlign: 'center',
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
        editInput: {
            fontSize: 14,
            color: colors.text,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 8,
        },
        textArea: {
            fontSize: 14,
            color: colors.text,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 10,
            minHeight: 72,
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

