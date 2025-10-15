import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { Icon, Text } from '@ui-kitten/components';
import { useThemeColors } from '@hooks/useThemeColors';
import { Plan } from "@interfaces/plans.interfaces";
import PlanCard from './PlanCard';

function PlanList({ plans }: { plans: Plan[] }) {
    const { colors } = useThemeColors();

    const renderPlanCard = ({ item }: { item: any }) => {
        return (
            <PlanCard plan={item} />
        )
    }

    const listEmpty = useMemo(() => {
        return (
            <View style={{ alignItems: 'center', padding: 40, justifyContent: 'center' }}>
                <Icon
                    name="calendar-outline"
                    pack="eva"
                    fill={colors.muted}
                    style={{ width: 64, height: 64, marginBottom: 16 }}
                />
                <Text category="p1" style={{ color: colors.muted, textAlign: 'center' }}>
                    Al parecer todavía no hay planes...
                </Text>
            </View>
        )
    }, [plans])

    return (
        <FlatList
            data={plans}
            renderItem={renderPlanCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={listEmpty}
        />
    );
}

export default PlanList;