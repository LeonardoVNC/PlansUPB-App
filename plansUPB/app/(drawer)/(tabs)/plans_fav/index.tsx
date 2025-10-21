import React from 'react';
import { View } from 'react-native';
import ScreenTemplate from '@common_components/ScreenTemplate';
import usePlans from '@hooks/usePlans';
import PlanList from '@screen_components/plans/PlanList';

export default function FavoritePlansScreen() {
  const { savedPlansList } = usePlans();

  return (
    <ScreenTemplate omitScroll >
      <View style={{ flex: 1, padding: 12 }}>
        <PlanList plans={savedPlansList} />
      </View>
    </ScreenTemplate>
  );
}
