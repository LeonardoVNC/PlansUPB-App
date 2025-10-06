import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../../src/styles/globals';
import ScreenTemplate from '../../../src/components/ScreenTemplate';

export default function HomeScreen() {

    return (
        <ScreenTemplate title='Bienvenido a PlansUPB' subtitle='Nombre en progreso'>
            <View style={globalStyles().app_container}>
                <Text>
                    Contenido
                </Text>
            </View>
        </ScreenTemplate>
    );
}
