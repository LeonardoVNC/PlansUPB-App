import React from 'react';
import { useRouter } from 'expo-router';
import { Card, Divider, Text } from '@ui-kitten/components';
import { Plan } from '../../../../../src/interfaces/plans.interfaces';
import { useThemeColors } from '../../../../../src/hooks/useThemeColors';
import { formatFullDateHour } from '../../../../../src/utils/formatDate';

export default function PlanCard({ plan }: { plan: Plan }) {
    const router = useRouter();
    const { colors } = useThemeColors();

    //TODO-Quiza haya que sacar este navigate, es raro tener uno estático en componente
    const handlePress = () => {
        router.push(`plans/${plan.id}`)
    };

    return (
        <Card
            style={{ marginBottom: 16, borderRadius: 12 }}
            onPress={handlePress}
            status={plan.done ? 'success' : 'primary'}
        >
            <Text category="h6" style={{ color: colors.text, marginBottom: 8 }}>
                {plan.title}
            </Text>

            <Divider style={{ marginBottom: 8, backgroundColor: colors.text }} />

            <Text category="p2" style={{ color: colors.subtitle, marginBottom: 16 }}>
                {plan.description}
            </Text>

            <Text category="c1" style={{ color: colors.subtitle }}>
                {formatFullDateHour(plan.date)}
            </Text>
        </Card>
    );
}
