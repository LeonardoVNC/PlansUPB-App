import React, { useEffect, useMemo, useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text, Icon } from '@ui-kitten/components';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { usePlans } from '@hooks/usePlans';
import { usePolls } from '@hooks/usePolls';
import { useThemeColors } from '@hooks/useThemeColors';
import PlanDateCard from '@screen_components/plans/details/PlanDateCard';
import PlanOwnerCard from '@screen_components/plans/details/PlanOwnerCard';
import PlanStatusCard from '@screen_components/plans/details/PlanStatusCard';
import PlanTitleCard from '@screen_components/plans/details/PlanTitleCard';
import PlanPlaceCard from '@screen_components/plans/details/PlanPlaceCard';
import RSVPCard from '@screen_components/plans/details/RSVPCard';
import PollCard from '@screen_components/votes/PollCard';
import CreatePollModal from '@screen_components/votes/CreatePollModal';
import { useUserStore } from '@store/useUserStore';
import { usePlanStore } from '@store/usePlanStore';
import FloatingButton from '@common_components/FloatingButton';
import CreatePlanModal from '@screen_components/plans/CreatePlanModal';
import Animated, {
    FadeInDown,
    FadeInUp,
    FadeIn,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring
} from 'react-native-reanimated';

function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useUserStore();
    const { colors } = useThemeColors();
    const { actualPlan: plan, setActualPlan, removeActualPlan } = usePlanStore();
    const { getPlanById, deletePlan, updatePlan } = usePlans();
    const { createPoll, updatePoll, fetchPollsByPlan, polls } = usePolls();
    const [loading, setLoading] = useState(true)
    const [isOwner, setIsOwner] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [pollModalVisible, setPollModalVisible] = useState(false)
    const [isEditingPoll, setIsEditingPoll] = useState(false)
    const router = useRouter();

    const fetchActualPlan = async () => {
        if (!plan) {
            setLoading(true);
        }

        const actualPlan = await getPlanById(id)
        if (!actualPlan) return

        setActualPlan(actualPlan)

        await fetchPollsByPlan(id);

        setLoading(false)
    }

    useEffect(() => {
        fetchActualPlan();
    }, [id, removeActualPlan])

    const poll = useMemo(() => {
        if (!plan?.pollId || polls.length === 0) return null;
        return polls.find(p => p.id === plan.pollId);
    }, [polls, plan?.pollId]);

    useEffect(() => {
        const userCode = user?.code
        const planOwnerCode = plan?.ownerCode
        setIsOwner(userCode === planOwnerCode)
    }, [user, plan])

    useEffect(() => {
        setIsAdmin(user?.role === 'Admin')
    }, [user])

    const handleCreatePoll = async (pollData: any) => {
        if (isEditingPoll && poll) {
            await updatePoll(poll.id, {
                question: pollData.question,
                description: pollData.description,
                allowMultiple: pollData.allowMultiple,
                closeCriteria: pollData.closeCriteria,
                closesAt: pollData.closesAt,
                quorumCount: pollData.quorumCount,
                tiebreakMethod: pollData.tiebreakMethod,
                options: pollData.options,
            });
        } else {
            const newPollId = await createPoll({
                ...pollData,
                planId: id,
            });

            if (newPollId) {
                await updatePlan(id, { pollId: newPollId });
            }
        }

        setPollModalVisible(false);
        setIsEditingPoll(false);
        await fetchActualPlan();
    };

    const handleEditPoll = () => {
        if (poll?.isOpen) {
            setIsEditingPoll(true);
            setPollModalVisible(true);
        }
    };

    const handleDeletePlan = () => {
        Alert.alert(
            'Eliminar Plan',
            '¿Estás seguro de que quieres eliminar este plan? Esta acción no se puede deshacer.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        deletePlan(id);
                        router.back();
                    }
                }
            ]
        );
    };

    if (!plan) {
        if (!loading) fetchActualPlan();
        return (
            <ScreenTemplate
                loading={true}
                loadingMessage='Cargando detalles...'
            >
                <></>
            </ScreenTemplate>
        );
    }

    return (
        <ScreenTemplate
            floatingButton={
                isOwner && plan.status === 'draft' || isAdmin ?
                    <FloatingButton onPress={() => { setShowModal(true) }} iconName='edit' /> : <></>
            }
            loading={loading}
        >
            <Animated.View
                entering={FadeIn.duration(400).withInitialValues({ opacity: 0 })}
                style={{ flex: 1 }}
            >
                <Animated.View entering={SlideInRight.duration(400).springify().delay(100)}>
                    <PlanTitleCard plan={plan} />
                </Animated.View>

                {/* Mock temporal, nos falta obtener el user por su id dxdx, igual hay q cambiar a !isOwner */}
                {isOwner && user && (
                    <Animated.View entering={SlideInRight.duration(400).springify().delay(150)}>
                        <PlanOwnerCard owner={user} />
                    </Animated.View>
                )}

                <Animated.View entering={SlideInRight.duration(400).springify().delay(200)}>
                    <PlanDateCard plan={plan} />
                </Animated.View>

                <Animated.View entering={SlideInRight.duration(400).springify().delay(250)}>
                    <PlanStatusCard plan={plan} isOwner={isOwner || isAdmin} />
                </Animated.View>

                {plan.status === 'open' && (
                    <Animated.View entering={SlideInRight.duration(400).springify().delay(350)}>
                        <RSVPCard planId={plan.id} ownerCode={plan.ownerCode} />
                    </Animated.View>
                )}

                {poll && (
                    <Animated.View entering={SlideInRight.duration(400).springify().delay(400)}>
                        <PollCard
                            poll={poll}
                            canEdit={isOwner || isAdmin}
                            onEditPress={handleEditPoll}
                        />
                    </Animated.View>
                )}

                {(isOwner || isAdmin) && !poll && plan.status === 'open' && (
                    <Animated.View entering={FadeIn.duration(400).delay(450)}>
                        <Button
                            onPress={() => setPollModalVisible(true)}
                            status="info"
                            accessoryLeft={(props) => <Icon {...props} name="bar-chart-outline" pack="eva" />}
                            style={{ marginTop: 16, marginBottom: 8 }}
                        >
                            Agregar Encuesta
                        </Button>
                    </Animated.View>
                )}

                <PlanPlaceCard plan={plan} isOwner={isOwner} />

                {(isOwner || isAdmin) && (
                    <Button
                        onPress={handleDeletePlan}
                        status="danger"
                        appearance="outline"
                        accessoryLeft={(props) => <Icon {...props} name="trash-2-outline" pack="eva" />}
                        style={{ marginTop: 8, marginBottom: 16 }}
                    >
                        Eliminar Plan
                    </Button>
                )}
            </Animated.View>

            <CreatePlanModal
                visible={showModal && (isOwner || isAdmin)}
                onClose={() => {
                    setShowModal(false)
                    fetchActualPlan();
                }}
                plan={plan}
            />

            <CreatePollModal
                visible={pollModalVisible}
                onClose={() => {
                    setPollModalVisible(false);
                    setIsEditingPoll(false);
                }}
                onCreatePoll={handleCreatePoll}
                planId={id}
                existingPoll={isEditingPoll ? poll || undefined : undefined}
            />
        </ScreenTemplate>
    );
}

export default PlanDetailScreen;
