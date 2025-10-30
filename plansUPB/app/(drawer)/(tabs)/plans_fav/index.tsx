import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { usePlanStore } from '@store/usePlanStore';
import PlanList from '@screen_components/plans/PlanList';
import { useThemeColors } from '@hooks/useThemeColors';

export default function FavoritePlansScreen() {
  const { savedPlans, loading } = usePlanStore();
  const { colors } = useThemeColors();

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
