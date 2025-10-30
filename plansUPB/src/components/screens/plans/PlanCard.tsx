import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Card, Divider, Text } from '@ui-kitten/components';
import Chip from '@common_components/Chip';
import { useThemeColors } from '@hooks/useThemeColors';
import { Plan } from '@interfaces/plans.interfaces';
import { cardStatusMap } from '@styles/planStatusMap';
import { getRelativeDate } from '@utils/formatDate';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import SharePlanModal from './SharePlanModal';
import { useUserStore } from '@store/useUserStore';
import { useSaves } from '@hooks/useSaves';

export default function PlanCard({ plan }: { plan: Plan }) {
    const router = useRouter();
    const { colors } = useThemeColors();
    // const { addConfirmation } = usePlans();
    const { savePlan, unsavePlan,isPlanSaved} = useSaves();
    const { user } = useUserStore();
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)
    const [shareModalVisible, setShareModalVisible] = useState(false)

    useEffect(() => {
        setSaved(isPlanSaved(plan.id))
    }, [])

    //TODO-Quiza haya que sacar este navigate, es raro tener uno estático en componente
    const handlePress = () => {
        router.replace(`plans/${plan.id}`)
    };

    const handleSavePress = (e: any) => {
        e.stopPropagation();
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

    const handleSharePress = (e: any) => {
        e.stopPropagation();
        setShareModalVisible(true);
    };

    const handleShare = (userCodes: string[]) => {
        if (!user) return;

        // userCodes.forEach((userCode: string) => {
        //     addConfirmation({
        //         planId: plan.id,
        //         userCode: userCode,
        //         status: 'pending',
        //         confirmed: undefined,
        //     });
        // });
    };

    return (
        <>
            <SharePlanModal
                visible={shareModalVisible}
                onClose={() => setShareModalVisible(false)}
                onShare={handleShare}
                planId={plan.id}
                planTitle={plan.title}
            />
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

                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <TouchableOpacity onPress={handleSharePress}>
                        <Ionicons
                            name="share-outline"
                            color={colors.primary}
                            size={22}
                        />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={handleSavePress}>
                        <Ionicons
                            name={saved ? 'bookmark' : 'bookmark-outline'}
                            color={saved ? colors.subtitle : colors.muted}
                            size={22}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
        </>
    );
}
