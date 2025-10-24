import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useUserStore } from '@store/useUserStore';
import { useAuthContext } from '@context/AuthContext';
import { useThemeColors } from '@hooks/useThemeColors';

const CustomDrawerContent = (props: any) => {
    const router = useRouter();
    const { logout: logoutStore } = useUserStore();
    const { logout: logoutAuth } = useAuthContext();
    const { colors } = useThemeColors();

    const handleLogout = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logoutAuth();
                            logoutStore();
                            router.replace('/auth/login');
                        } catch (error) {
                            console.error('Error al cerrar sesión:', error);
                            Alert.alert('Error', 'No se pudo cerrar sesión');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: colors.drawerBackground }}>
            <DrawerItemList {...props} />


            <View style={styles.separator} />

            <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: colors.surface }]}
                onPress={handleLogout}
                activeOpacity={0.7}
            >
                <Text style={[styles.logoutText, { color: 'red' }]}>
                    Cerrar Sesión
                </Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
};

const DrawerLayout = () => {
    const { colors } = useThemeColors();

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                drawerContentStyle: { backgroundColor: colors.drawerBackground },
                drawerActiveTintColor: colors.primary,
                drawerInactiveTintColor: colors.muted,
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    title: 'PlansUPB',
                    drawerLabel: 'Página Principal',
                }}
            />
            <Drawer.Screen
                name="profile"
                options={{
                    title: 'Mi perfil',
                    drawerLabel: 'Mi perfil',
                }}
            />
        </Drawer>
    );
};

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
        marginHorizontal: 16,
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default DrawerLayout;
