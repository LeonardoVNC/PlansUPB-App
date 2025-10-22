import React from 'react';
import { useRouter } from 'expo-router';
import { Card, Divider, Text } from '@ui-kitten/components';
import Chip from '@common_components/Chip';
import { useThemeColors } from '@hooks/useThemeColors';
import { Plan } from '@interfaces/plans.interfaces';
import { getRelativeDate } from '@utils/formatDate';

export default function PlanCard({ plan }: { plan: Plan }) {
    const router = useRouter();
    const { colors } = useThemeColors();

    const statusMap: Map<string, string> = new Map([
        ['draft', 'warning'],
        ['open', 'primary'],
        ['closed', 'success'],
        ['cancelled', 'danger']
    ])

    //TODO-Quiza haya que sacar este navigate, es raro tener uno estático en componente
    const handlePress = () => {
        router.replace(`plans/${plan.id}`)
    };

    return (
        <Card
            style={{ marginBottom: 16, borderRadius: 12, elevation: 2 }}
            onPress={handlePress}
            status={statusMap.get(plan.status)}
        >
            <Text category="h6" style={{ color: colors.text, marginBottom: 8 }}>
                {plan.title}
            </Text>

            <Chip text={plan.category} />

            <Text
                category="p2"
                numberOfLines={3}
                ellipsizeMode="tail"
                style={{ color: colors.subtitle, marginBottom: 8 }}
            >
                {plan.description}
            </Text>

            <Divider style={{ marginBottom: 8, backgroundColor: colors.text }} />

            <Text category="c1" style={{ color: colors.subtitle }}>
                Fecha: {getRelativeDate(plan.date)}
            </Text>
        </Card>
    );
}
