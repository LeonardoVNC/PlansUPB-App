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
import { addConfirmation } from '@services/confirmations.service';
import { notifyPlanInvitation } from '@services/notifications.service';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
    withTiming
} from 'react-native-reanimated';

export default function PlanCard({ plan, index = 0 }: { plan: Plan; index?: number }) {
    const router = useRouter();
    const { colors } = useThemeColors();
    // const { addConfirmation } = usePlans();
    const { savePlan, unsavePlan, isPlanSaved } = useSaves();
    const { user } = useUserStore();
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)
    const [shareModalVisible, setShareModalVisible] = useState(false)

    const saveScale = useSharedValue(1);
    const shareScale = useSharedValue(1);
    const cardScale = useSharedValue(1);

    useEffect(() => {
        setSaved(isPlanSaved(plan.id))
    }, [plan])

    //TODO-Quiza haya que sacar este navigate, es raro tener uno estático en componente
    const handlePress = () => {
        cardScale.value = withSequence(
            withTiming(0.97, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );

        setTimeout(() => {
            router.push(`plans/${plan.id}`);
        }, 150);
    };

    const handleSavePress = async (e: any) => {
        e.stopPropagation();
        if (loading) return

        saveScale.value = withSequence(
            withSpring(0.8, { damping: 10 }),
            withSpring(1.2, { damping: 10 }),
            withSpring(1, { damping: 10 })
        );

        setLoading(true)
        if (saved) {
            await unsavePlan(plan.id)
            setSaved(false)
        } else {
            await savePlan(plan.id)
            setSaved(true)
        }
        setLoading(false)
    }

    const handleSharePress = (e: any) => {
        e.stopPropagation();

        shareScale.value = withSequence(
            withSpring(0.8, { damping: 10 }),
            withSpring(1, { damping: 10 })
        );

        setShareModalVisible(true);
    };

    const saveAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: saveScale.value }]
    }));

    const shareAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: shareScale.value }]
    }));

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cardScale.value }]
    }));

    const handleShare = async (userCodes: string[]) => {
        if (!user) return;

        const promises = userCodes.map((userCode: string) =>
            addConfirmation({
                planId: plan.id,
                userCode: userCode,
                status: 'pending',
            })
        );

        await Promise.all(promises);

        const notificationPromises = userCodes.map((userCode: string) =>
            notifyPlanInvitation(userCode, plan.title, user.name || user.code)
                .catch(error => console.error(`Error al notificar a ${userCode}:`, error))
        );

        await Promise.all(notificationPromises);
        setShareModalVisible(false);
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
            <Animated.View
                entering={FadeInDown.delay(index * 100).springify()}
                style={cardAnimatedStyle}
            >
                <Card
                    style={{ marginBottom: 16, borderRadius: 12, elevation: 2, backgroundColor: '#f1f5f9' }}
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
                                <Animated.View style={shareAnimatedStyle}>
                                    <Ionicons
                                        name="share-outline"
                                        color={colors.primary}
                                        size={22}
                                    />
                                </Animated.View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleSavePress}>
                                <Animated.View style={saveAnimatedStyle}>
                                    <Ionicons
                                        name={saved ? 'bookmark' : 'bookmark-outline'}
                                        color={saved ? colors.subtitle : colors.muted}
                                        size={22}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
            </Animated.View>
        </>
    );
}
