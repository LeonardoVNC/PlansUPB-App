import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../../../src/styles/globals';
import ScreenTemplate from '../../../../src/components/ScreenTemplate';

export default function PlansScreen() {

  return (
    <ScreenTemplate title='Planes' subtitle='Revisa los planes disponibles'>
      <View style={globalStyles().app_container}>
        <Text>
          Contenido
        </Text>
      </View>
    </ScreenTemplate>
  );
}
