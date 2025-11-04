import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '@ui-kitten/components';
import ScreenTemplate from '@common_components/ScreenTemplate';
import PlanCard from '@screen_components/plans/PlanCard';
import InvitationCard from '@screen_components/plans/InvitationCard';
import { useThemeColors } from '@hooks/useThemeColors';
import { useUserStore } from '@store/useUserStore';
import { usePlanStore } from '@store/usePlanStore';
import { useConfirmations } from '@hooks/useConfirmations';

export default function InvPlansScreen() {
  const { colors } = useThemeColors();
  const { user } = useUserStore();
  const { loading, setLoading } = usePlanStore();
  const { 
    fetchInvitedPlans, 
    pendingInvitations, 
    acceptedInvitations,
    respondToInvitation 
  } = useConfirmations();

  const fetchPlans = async () => {
    setLoading(true);
    await fetchInvitedPlans();
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAcceptInvitation = async (planId: string) => {
    await respondToInvitation(planId, true);
  };

  const handleDeclineInvitation = async (planId: string) => {
    await respondToInvitation(planId, false);
  };

  // Combinar pendientes y aceptados en un solo array para FlatList
  const allItems = useMemo(() => {
    const items: any[] = [];
    
    if (pendingInvitations.length > 0) {
      items.push({ type: 'header', key: 'pending-header', title: 'Invitaciones Pendientes', count: pendingInvitations.length });
      pendingInvitations.forEach((plan, index) => {
        items.push({ type: 'pending', key: `pending-${plan.id}-${index}`, plan });
      });
    }
    
    if (acceptedInvitations.length > 0) {
      items.push({ type: 'header', key: 'accepted-header', title: 'Planes Aceptados', count: acceptedInvitations.length });
      acceptedInvitations.forEach((plan, index) => {
        items.push({ type: 'accepted', key: `accepted-${plan.id}-${index}`, plan });
      });
    }

    if (items.length === 0) {
      items.push({ type: 'empty', key: 'empty' });
    }
    
    return items;
  }, [pendingInvitations, acceptedInvitations]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'header') {
      return (
        <Text category="h6" style={{ color: colors.text, marginBottom: 12, marginTop: item.key === 'pending-header' ? 0 : 16 }}>
          {item.title} ({item.count})
        </Text>
      );
    }

    if (item.type === 'pending') {
      return (
        <InvitationCard
          plan={item.plan}
          onAccept={() => handleAcceptInvitation(item.plan.id)}
          onDecline={() => handleDeclineInvitation(item.plan.id)}
        />
      );
    }

    if (item.type === 'accepted') {
      return <PlanCard plan={item.plan} />;
    }

    if (item.type === 'empty') {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, minHeight: 400 }}>
          <Text category="h6" style={{ color: colors.subtitle, textAlign: 'center' }}>
            No tienes invitaciones
          </Text>
          <Text category="p2" style={{ color: colors.subtitle, textAlign: 'center', marginTop: 8 }}>
            Cuando alguien te invite a un plan, aparecerá aquí
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenTemplate 
      omitScroll
      loading={loading}
      loadingMessage='Cargando invitaciones'
    >
      <FlatList
        data={allItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ padding: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenTemplate>
  );
}

