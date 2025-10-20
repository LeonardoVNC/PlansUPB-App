import React, { useState } from 'react';
import { Text } from 'react-native';
import FloatingButton from '@common_components/FloatingButton';
import ScreenTemplate from '@common_components/ScreenTemplate';
import CreatePlanModal from '@screen_components/plans/CreatePlanModal';

export default function MyPlansScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScreenTemplate
      omitScroll
      floatingButton={<FloatingButton onPress={() => setModalVisible(true)} iconName="plus" />}
    >
      <Text>Aqui van los planes que hice</Text>

      <CreatePlanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScreenTemplate>
  );
}
