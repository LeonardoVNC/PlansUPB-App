import React from 'react';
import { Button, Icon } from '@ui-kitten/components';
import { usePlanStore } from '../../../../src/store/usePlanStore';
import { useUserStore } from '../../../../src/store/useUserStore';
import ScreenTemplate from '../../../../src/components/ScreenTemplate';
import { useThemeColors } from '../../../../src/hooks/useThemeColors';
import PlanList from './components/PlanList';
import FloatingButton from '../../../../src/components/FloatingButton';

export default function PlansScreen() {
  const { plans, addPlan } = usePlanStore();
  const { user } = useUserStore();
  const { colors } = useThemeColors();

  const handleCreatePlan = async () => {
    if (!user) {
      return;
    }
    await addPlan({
      owner: user.code,
      //Datos mock y tal
      title: 'Nuevo Plan Automático',
      description: 'Creado medio a la rápida (como todo plan que se respeta)',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //TODO poner date hour picker o algo
    });
  };

  return (
    <ScreenTemplate title="Planes" subtitle="Revisa los planes disponibles">
      <PlanList plans={plans} />

      <FloatingButton
        onPress={handleCreatePlan}
        iconName='plus'
      />
    </ScreenTemplate>
  );
}
