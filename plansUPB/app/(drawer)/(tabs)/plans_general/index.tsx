import React, { useState } from 'react';
import { View } from 'react-native';
import { TabView, Tab } from '@ui-kitten/components';
import FloatingButton from '@common_components/FloatingButton';
import ScreenTemplate from '@common_components/ScreenTemplate';
import CreatePlanModal from '@screen_components/plans/CreatePlanModal';
import PlanList from '@screen_components/plans/PlanList';
import usePlans from '@hooks/usePlans';

export default function GeneralPlansScreen() {
  const { managedPlans, filteredPlans } = usePlans();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScreenTemplate
      omitScroll
      floatingButton={<FloatingButton onPress={() => setModalVisible(true)} iconName="plus" />}
    >
      <TabView
        style={{ flex: 1, marginTop: 8 }}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      >
        <Tab title="Mis Planes">
          <View style={{ flex: 1, marginTop: 8 }}>
            <PlanList plans={managedPlans} />
          </View>
        </Tab>

        <Tab title="Invitaciones">
          <View style={{ flex: 1 }}>
            <PlanList plans={filteredPlans} />
          </View>
        </Tab>
      </TabView>

      <CreatePlanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScreenTemplate>
  );
}
