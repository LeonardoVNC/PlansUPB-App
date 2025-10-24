import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text, Icon } from '@ui-kitten/components';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { usePlans } from '@hooks/usePlans';
import { useThemeColors } from '@hooks/useThemeColors';
import PlanDateCard from '@screen_components/plans/details/PlanDateCard';
import PlanOwnerCard from '@screen_components/plans/details/PlanOwnerCard';
import PlanStatusCard from '@screen_components/plans/details/PlanStatusCard';
import PlanTitleCard from '@screen_components/plans/details/PlanTitleCard';
import PlanPlaceCard from '@screen_components/plans/details/PlanPlaceCard';
import { useUserStore } from '@store/useUserStore';

function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors } = useThemeColors();
    const { getPlanById } = usePlans();
    const { user } = useUserStore();
    const [isOwner, setIsOwner] = useState(false)

    const plan = useMemo(() => {
        return getPlanById(id)
    }, [getPlanById, id]);

    useEffect(() => {
        const userCode = user?.code
        const planOwnerCode = plan?.ownerCode
        setIsOwner(userCode === planOwnerCode)
    }, [user, plan])

    if (!plan) {
        return (
            <ScreenTemplate>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Icon name="alert-triangle-outline" pack="eva" fill={colors.danger} style={{ width: 64, height: 64, marginBottom: 16 }} />
                    <Text category="h6" style={{ color: colors.text, textAlign: 'center', marginBottom: 8 }}>
                        No se pudo cargar el plan con ID: {id}.
                    </Text>
                    <Button onPress={() => router.back()} status="primary" style={{ marginTop: 16 }}>
                        Volver a planes
                    </Button>
                </View>
            </ScreenTemplate>
        );
    }

    return (
        <ScreenTemplate>
            <View>
                <PlanTitleCard plan={plan} />

                {/* <PlanOwnerCard owner={}/> */}

                <PlanDateCard plan={plan} />

                <PlanStatusCard plan={plan} isOwner={isOwner}/>

                <PlanPlaceCard plan={plan} isOwner={isOwner}/>
            </View>
        </ScreenTemplate>
    );
}

export default PlanDetailScreen;
