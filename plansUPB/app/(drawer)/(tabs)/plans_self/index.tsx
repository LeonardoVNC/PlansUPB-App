import React, { useState } from 'react';
import { View } from 'react-native';
import FloatingButton from '@common_components/FloatingButton';
import ScreenTemplate from '@common_components/ScreenTemplate';
import usePlans from '@hooks/usePlans';
import CreatePlanModal from '@screen_components/plans/CreatePlanModal';
import PlanList from '@screen_components/plans/PlanList';

export default function MyPlansScreen() {
  const { managedPlans } = usePlans();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScreenTemplate
      omitScroll
      floatingButton={<FloatingButton onPress={() => setModalVisible(true)} iconName="plus" />}
    >
      <View style={{ flex: 1, padding: 12}}>
        <PlanList plans={managedPlans} />
      </View>

      <CreatePlanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScreenTemplate>
  );
}
