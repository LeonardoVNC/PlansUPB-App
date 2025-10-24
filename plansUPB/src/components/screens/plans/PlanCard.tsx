import React, { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Card, Divider, Text, Icon } from '@ui-kitten/components';
import Chip from '@common_components/Chip';
import { useThemeColors } from '@hooks/useThemeColors';
import { useUserStore } from '@store/useUserStore';
import { Plan } from '@interfaces/plans.interfaces';
import { cardStatusMap } from '@styles/planStatusMap';
import { getRelativeDate } from '@utils/formatDate';

interface PlanCardProps {
    plan: Plan;
    children?: ReactNode;
}

export default function PlanCard({ plan, children }: PlanCardProps) {
    const router = useRouter();
    const { colors } = useThemeColors();

    //TODO-Quiza haya que sacar este navigate, es raro tener uno estático en componente
    const handlePress = () => {
        router.replace(`plans/${plan.id}`)
    };

    return (
        <View style={{ marginBottom: 16 }}>
            <Card
                style={{ borderRadius: 12, elevation: 2 }}
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

                <Text category="c1" style={{ color: colors.subtitle }}>
                    Fecha: {getRelativeDate(plan.date)}
                </Text>

                {children && (
                    <>
                        <Divider style={{ marginTop: 16, marginBottom: 12, backgroundColor: colors.text }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Icon
                                name="bar-chart-outline"
                                pack="eva"
                                fill={colors.primary}
                                style={{ width: 20, height: 20, marginRight: 8 }}
                            />
                            <Text category="h6" style={{ color: colors.text, fontSize: 16 }}>
                                Encuesta
                            </Text>
                        </View>
                        {children}
                    </>
                )}
            </Card>
        </View>
    );
}
