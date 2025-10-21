import React, { useState } from 'react';
import FloatingButton from '@common_components/FloatingButton';
import ScreenTemplate from '@common_components/ScreenTemplate';
import CreatePlanModal from '@screen_components/plans/CreatePlanModal';
import { Text } from 'react-native';

export default function InvPlansScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScreenTemplate
      omitScroll
      floatingButton={<FloatingButton onPress={() => setModalVisible(true)} iconName="plus" />}
    >
      <Text>Aqui van los planes a los q me invitaron</Text>
      <CreatePlanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScreenTemplate>
  );
}
