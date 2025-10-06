import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../src/store/useUserStore'; 
import { User } from '../src/interfaces/user.interfaces'; 
import { globalStyles } from '../src/styles/globals'; 

export default function AuthScreen () {
    const router = useRouter();
    const { login, logged } = useUserStore();
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (logged) {
            router.replace('/(drawer)');
        }
    }, [logged, router]);

    const handleLogin = () => {
        //Usuario temporal, cuando implementemos LogIn real hay que reemplazar esta función
        const mockUser: User = {
            code: '8080',
            name: 'Usuario Test Wiwi',
            username: 'patricio89',
            bio: 'Me gusta servir de ejemplo en proyectos chiquitos'
        };
        login(mockUser);
        router.replace('/(drawer)'); 
    };

    if (logged) {
        return null;
    }

    return (
        <View style={globalStyles().app_center_container}>
            <Text style={globalStyles().app_title}>
                Iniciar Sesión
            </Text>

            <TextInput
                style={globalStyles().app_input}
                placeholder="Código UPB"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
            />

            <TextInput
                style={globalStyles().app_input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <TouchableOpacity style={globalStyles().app_button} onPress={handleLogin} disabled={!code || !password}>
                <Text style={globalStyles().app_buttonText}>
                    Login
                </Text>
            </TouchableOpacity>
        </View>
    );
};