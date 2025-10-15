import React, { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Text, Icon } from '@ui-kitten/components';
import ScreenTemplate from '../../../../../src/components/ScreenTemplate';
import { useThemeColors } from '../../../../../src/hooks/useThemeColors';
import { usePlans } from '../../../../../src/hooks/usePlans';
import { formatFullDateHour } from '../../../../../src/utils/formatDate';
import PlanTitleCard from './components/PlanTitleCard';
import PlanOwnerCard from './components/PlanOwnerCard';
import PlanDateCard from './components/PlanDateCard';
import PlanStatusCard from './components/PlanStatusCard';

function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors } = useThemeColors();
    const { getPlanById } = usePlans();

    const plan = useMemo(() => {
        return getPlanById(id)
    }, [getPlanById, id]);

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
                <PlanTitleCard plan={plan}/>
                
                {/* <PlanOwnerCard owner={}/> */}

                <PlanDateCard plan={plan}/>

                <PlanStatusCard plan={plan}/>
            </View>
        </ScreenTemplate>
    );
}

export default PlanDetailScreen;
