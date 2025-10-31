import React, { useEffect } from 'react';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { usePlanStore } from '@store/usePlanStore';
import PlanList from '@screen_components/plans/PlanList';
import { useSaves } from '@hooks/useSaves';

export default function FavoritePlansScreen() {
  const { savedPlans, loading, setLoading } = usePlanStore();
  const { fetchSaves } = useSaves();

  const fetchSavedPlans = async () => {
    setLoading(true)
    await fetchSaves();
    setLoading(false)
  }

  useEffect(() => {
    fetchSavedPlans()
  }, [])

  return (
    <ScreenTemplate
      omitScroll
      loading={loading}
      loadingMessage='Cargando guardados'
    >
      <PlanList plans={savedPlans} />
    </ScreenTemplate>
  );
}
