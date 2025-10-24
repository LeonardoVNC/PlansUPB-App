import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Card, Divider, Text } from '@ui-kitten/components';
import Chip from '@common_components/Chip';
import { useThemeColors } from '@hooks/useThemeColors';
import { Plan } from '@interfaces/plans.interfaces';
import { cardStatusMap } from '@styles/planStatusMap';
import { getRelativeDate } from '@utils/formatDate';
import usePlans from '@hooks/usePlans';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function PlanCard({ plan }: { plan: Plan }) {
    const router = useRouter();
    const { colors } = useThemeColors();
    const { savePlan, unsavePlan, isPlanSaved } = usePlans();
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setSaved(isPlanSaved(plan.id))
    }, [])

    //TODO-Quiza haya que sacar este navigate, es raro tener uno estático en componente
    const handlePress = () => {
        router.replace(`plans/${plan.id}`)
    };

    const handleSavePress = () => {
        if (loading) return

        setLoading(true)
        if (saved) {
            unsavePlan(plan.id)
            setSaved(false)
        } else {
            savePlan(plan.id)
            setSaved(true)
        }
        setLoading(false)
    }

    return (
        <Card
            style={{ marginBottom: 16, borderRadius: 12, elevation: 2 }}
            onPress={handlePress}
            status={cardStatusMap.get(plan.status)}
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text category="c1" style={{ color: colors.subtitle }}>
                    Fecha: {getRelativeDate(plan.date)}
                </Text>

                <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    color={saved ? colors.subtitle : colors.muted}
                    size={22}
                    onPress={handleSavePress}
                />
            </View>
        </Card>
    );
}
