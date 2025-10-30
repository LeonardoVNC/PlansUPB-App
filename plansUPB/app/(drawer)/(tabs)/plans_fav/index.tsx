import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { usePlanStore } from '@store/usePlanStore';
import PlanList from '@screen_components/plans/PlanList';
import { useThemeColors } from '@hooks/useThemeColors';
import { useSaves } from '@hooks/useSaves';

export default function FavoritePlansScreen() {
  const { savedPlans, loading, setLoading } = usePlanStore();
  const { fetchSaves } = useSaves();
  const { colors } = useThemeColors();

  const fetchSavedPlans = async () => {
    setLoading(true)
    await fetchSaves();
    setLoading(false)
  }

  useEffect(() => {
    fetchSavedPlans()
  }, [])

  return (
    <ScreenTemplate omitScroll >
      <View style={{ flex: 1, padding: 12 }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <PlanList plans={savedPlans} />
        )}
      </View>
    </ScreenTemplate>
  );
}
