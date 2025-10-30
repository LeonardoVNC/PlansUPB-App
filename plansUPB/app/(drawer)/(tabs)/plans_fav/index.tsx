import React from 'react';
import { View } from 'react-native';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { useSaves } from '@hooks/useSaves';
import PlanList from '@screen_components/plans/PlanList';

export default function FavoritePlansScreen() {
  const { savedPlansList } = useSaves();

  return (
    <ScreenTemplate omitScroll >
      <View style={{ flex: 1, padding: 12 }}>
        <PlanList plans={savedPlansList} />
      </View>
    </ScreenTemplate>
  );
}
