import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../src/styles/globals';

export default function VoteScreen() {

    return (
            <View style={globalStyles().app_container}>
            <Text style={globalStyles().app_title}>
                Votaciones?
            </Text>
        </View>
    );
}
