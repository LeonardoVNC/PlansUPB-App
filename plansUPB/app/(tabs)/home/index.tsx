import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../src/styles/globals';

export default function HomeScreen() {

    return (
        <View style={globalStyles.app_container}>
            <Text style={globalStyles.app_title}>
                Bienvenido a PlansUPB
            </Text>
            <Text style={globalStyles.app_subtitle}>
                Nombre en progreso
            </Text>
        </View>
    );
}
