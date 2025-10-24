import React, { useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '@ui-kitten/components';
import ScreenTemplate from '@common_components/ScreenTemplate';
import usePlans from '@hooks/usePlans';
import PlanCard from '@screen_components/plans/PlanCard';
import InvitationCard from '@screen_components/plans/InvitationCard';
import { useThemeColors } from '@hooks/useThemeColors';
import { useUserStore } from '@store/useUserStore';
import { usePlanStore } from '@store/usePlanStore';
import { Plan } from '@interfaces/plans.interfaces';

export default function InvPlansScreen() {
  const { colors } = useThemeColors();
  const { user } = useUserStore();
  const { invPlansList, respondToInvitation } = usePlans();
  const { confirmations, plans } = usePlanStore();

  // Filtrar invitaciones pendientes
  const pendingInvitations = useMemo(() => {
    if (!user) return [];
    return confirmations
      .filter(c => 
        c.userCode === user.code && 
        c.status === 'pending'
      )
      .map(c => plans.find(p => p.id === c.planId))
      .filter(p => p !== undefined);
  }, [confirmations, plans, user]);

  // Planes con invitaciones aceptadas
  const acceptedPlans = useMemo(() => {
    if (!user) return [];
    return confirmations
      .filter(c => 
        c.userCode === user.code && 
        c.status === 'accepted'
      )
      .map(c => plans.find(p => p.id === c.planId))
      .filter(p => p !== undefined);
  }, [confirmations, plans, user]);

  const handleAcceptInvitation = (planId: string) => {
    respondToInvitation(planId, true);
  };

  const handleDeclineInvitation = (planId: string) => {
    respondToInvitation(planId, false);
  };

  // Combinar pendientes y aceptados en un solo array para FlatList
  const allItems = useMemo(() => {
    const items: any[] = [];
    
    if (pendingInvitations.length > 0) {
      items.push({ type: 'header', key: 'pending-header', title: 'Invitaciones Pendientes', count: pendingInvitations.length });
      pendingInvitations.forEach(plan => {
        items.push({ type: 'pending', key: `pending-${plan.id}`, plan });
      });
    }
    
    if (acceptedPlans.length > 0) {
      items.push({ type: 'header', key: 'accepted-header', title: 'Planes Aceptados', count: acceptedPlans.length });
      acceptedPlans.forEach(plan => {
        items.push({ type: 'accepted', key: `accepted-${plan.id}`, plan });
      });
    }

    if (items.length === 0) {
      items.push({ type: 'empty', key: 'empty' });
    }
    
    return items;
  }, [pendingInvitations, acceptedPlans]);

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
    <ScreenTemplate omitScroll>
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

