import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import FloatingButton from '@common_components/FloatingButton';
import ScreenTemplate from '@common_components/ScreenTemplate';
import CreatePlanModal from '@screen_components/plans/CreatePlanModal';
import PlanList from '@screen_components/plans/PlanList';
import { useThemeColors } from '@hooks/useThemeColors';
import { usePlanStore } from '@store/usePlanStore';
import usePlans from '@hooks/usePlans';

export default function GeneralPlansScreen() {
  const { allPlans, loading, setLoading } = usePlanStore();
  const { fetchAllPlans } = usePlans();
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useThemeColors();

  const fetchPlans = async () => {
    setLoading(true)
    await fetchAllPlans();
    setLoading(false)
  }
  
  useEffect(() => {
    fetchPlans()
  }, [])

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
