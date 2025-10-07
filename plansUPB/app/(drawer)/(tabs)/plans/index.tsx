import React, { useState } from 'react';
import { View } from 'react-native';
import { TabView, Tab } from '@ui-kitten/components';
import PlanList from './components/PlanList';
import { useUserStore } from '../../../../src/store/useUserStore';
import ScreenTemplate from '../../../../src/components/ScreenTemplate';
import FloatingButton from '../../../../src/components/FloatingButton';
import usePlans from '../../../../src/hooks/usePlans';

export default function PlansScreen() {
  const { managedPlans, filteredPlans, createPlan } = usePlans();
  const { user } = useUserStore();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleCreatePlan = async () => {
    if (!user) return;
    await createPlan({
      owner: user.code,
      title: 'Nuevo Plan Automático',
      description: 'Creado medio a la rápida (como todo plan que se respeta)',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  };

  const data = [
    { label: 'Mis Planes', plans: managedPlans, subtitle: `${managedPlans.length} planes administrados` },
    { label: 'Invitaciones', plans: filteredPlans, subtitle: `${filteredPlans.length} invitaciones pendientes` },
  ];

  const activeTab = data[selectedIndex];

  return (
    <ScreenTemplate title="Planes" subtitle={activeTab.subtitle}>
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

      <FloatingButton onPress={handleCreatePlan} iconName="plus" />
    </ScreenTemplate>
  );
}
