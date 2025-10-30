import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import FloatingButton from '@common_components/FloatingButton';
import ScreenTemplate from '@common_components/ScreenTemplate';
import CreatePlanModal from '@screen_components/plans/CreatePlanModal';
import PlanList from '@screen_components/plans/PlanList';
import { useThemeColors } from '@hooks/useThemeColors';
import { usePlanStore } from '@store/usePlanStore';

export default function GeneralPlansScreen() {
  const { allPlans, loading } = usePlanStore();
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useThemeColors();

  return (
    <ScreenTemplate
      omitScroll
      floatingButton={<FloatingButton onPress={() => setModalVisible(true)} iconName="plus" />}
    >
      <View style={{ flex: 1, padding: 12 }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <PlanList plans={allPlans} />
        )}
      </View>

      <CreatePlanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScreenTemplate>
  );
}
