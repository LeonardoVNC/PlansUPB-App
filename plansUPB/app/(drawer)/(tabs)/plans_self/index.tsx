import React, { useEffect, useState } from 'react';
import FloatingButton from '@common_components/FloatingButton';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { usePlanStore } from '@store/usePlanStore';
import CreatePlanModal from '@screen_components/plans/CreatePlanModal';
import PlanList from '@screen_components/plans/PlanList';
import usePlans from '@hooks/usePlans';
import { useSaves } from '@hooks/useSaves';

export default function MyPlansScreen() {
  const { managedPlans, loading, setLoading } = usePlanStore();
  const { fetchManagedPlans } = usePlans();
  const { fetchSaves } = useSaves();
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPlans = async () => {
    setLoading(true)
    await fetchManagedPlans();
    await fetchSaves();
    setLoading(false)
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  return (
    <ScreenTemplate
      omitScroll
      floatingButton={<FloatingButton onPress={() => setModalVisible(true)} iconName="plus" />}
      loading={loading}
      loadingMessage='Cargando tus planes'
    >
      <PlanList plans={managedPlans} />

      <CreatePlanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScreenTemplate>
  );
}
