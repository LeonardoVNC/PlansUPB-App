import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../../../src/styles/globals';
import ScreenTemplate from '../../../../src/components/ScreenTemplate';

export default function VoteScreen() {

    return (
        <ScreenTemplate title='Mis votos' subtitle='Revisa los votos que realizaste'>
            <View style={globalStyles().app_container}>
                <Text>
                    Contenido x2
                </Text>
            </View>
        </ScreenTemplate>
    );
}
