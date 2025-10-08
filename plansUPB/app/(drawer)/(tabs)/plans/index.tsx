import React, { useState } from 'react';
import { View } from 'react-native';
import { TabView, Tab } from '@ui-kitten/components';
import PlanList from './components/PlanList';
import ScreenTemplate from '../../../../src/components/ScreenTemplate';
import FloatingButton from '../../../../src/components/FloatingButton';
import usePlans from '../../../../src/hooks/usePlans';
import CreatePlanModal from './components/CreatePlanModal';

export default function PlansScreen() {
  const { managedPlans, filteredPlans } = usePlans();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const data = [
    { label: 'Mis Planes', plans: managedPlans, subtitle: `${managedPlans.length} planes administrados` },
    { label: 'Invitaciones', plans: filteredPlans, subtitle: `${filteredPlans.length} invitaciones pendientes` },
  ];

  const activeTab = data[selectedIndex];

  return (
    <ScreenTemplate
      title="Planes"
      subtitle={activeTab.subtitle}
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
