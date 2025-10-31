import React, { useEffect, useMemo, useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
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
import RSVPCard from '@screen_components/plans/details/RSVPCard';
import PollCard from '@screen_components/votes/PollCard';
import CreatePollModal from '@screen_components/votes/CreatePollModal';
import { useUserStore } from '@store/useUserStore';
import { usePlanStore } from '@store/usePlanStore';
import FloatingButton from '@common_components/FloatingButton';
import CreatePlanModal from '@screen_components/plans/CreatePlanModal';

function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useUserStore();
    const { colors } = useThemeColors();
    const { actualPlan: plan, setActualPlan, removeActualPlan } = usePlanStore();
    const { getPlanById, deletePlan } = usePlans(); //Falta getPollForPlan, addPollToPlan,
    // const { updatePoll } = usePlanStore();
    const [loading, setLoading] = useState(true)
    const [isOwner, setIsOwner] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [pollModalVisible, setPollModalVisible] = useState(false)
    const [isEditingPoll, setIsEditingPoll] = useState(false)
    const router = useRouter();

    const fetchActualPlan = async () => {
        setLoading(true)
        const actualPlan = await getPlanById(id)
        if (!actualPlan) return

        setActualPlan(actualPlan)
        setLoading(false)
    }

    useEffect(() => {
        fetchActualPlan();
    }, [id])

    // const poll = useMemo(() => {
    //     if (!plan?.pollId) return null;
    //     return getPollForPlan(id);
    // }, [getPollForPlan, id, plan?.pollId]);

    useEffect(() => {
        const userCode = user?.code
        const planOwnerCode = plan?.ownerCode
        setIsOwner(userCode === planOwnerCode)
    }, [user, plan])

    useEffect(() => {
        setIsAdmin(user?.role === 'Admin')
    }, [user])

    // const handleCreatePoll = (pollData: any) => {
    //     if (isEditingPoll && poll) {
    //         updatePoll(poll.id, {
    //             question: pollData.question,
    //             description: pollData.description,
    //             allowMultiple: pollData.allowMultiple,
    //             closeCriteria: pollData.closeCriteria,
    //             closesAt: pollData.closesAt,
    //             quorumCount: pollData.quorumCount,
    //             tiebreakMethod: pollData.tiebreakMethod,
    //             options: pollData.options,
    //         });
    //     } else {
    //         addPollToPlan(pollData);
    //     }
    //     setPollModalVisible(false);
    //     setIsEditingPoll(false);
    // };

    // const handleEditPoll = () => {
    //     if (poll?.isOpen) {
    //         setIsEditingPoll(true);
    //         setPollModalVisible(true);
    //     }
    // };

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

    if (loading) {
        return (
            <ScreenTemplate>
                <ActivityIndicator size="large" color={colors.primary} />
            </ScreenTemplate>
        )
    }

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
        <ScreenTemplate
            floatingButton={
                isOwner && plan.status === 'draft' || isAdmin ?
                    <FloatingButton onPress={() => { setShowModal(true) }} iconName='edit' /> : <></>
            }
        >
            <View>
                <PlanTitleCard plan={plan} />

                {/* Mock temporal, nos falta obtener el user por su id dxdx, igual hay q cambiar a !isOwner */}
                {isOwner && user && (
                    <PlanOwnerCard owner={user} />
                )}

                <PlanDateCard plan={plan} />

                <PlanStatusCard plan={plan} isOwner={isOwner || isAdmin} />

                <PlanPlaceCard plan={plan} isOwner={isOwner} />

                {plan.status === 'open' && (
                    <RSVPCard planId={plan.id} ownerCode={plan.ownerCode} />
                )}

                {/* {poll && (
                    <PollCard
                        poll={poll}
                        canEdit={isOwner || isAdmin}
                        onEditPress={handleEditPoll}
                    />
                )}

                {(isOwner || isAdmin) && !poll && plan.status === 'open' && (
                    <Button
                        onPress={() => setPollModalVisible(true)}
                        status="info"
                        accessoryLeft={(props) => <Icon {...props} name="bar-chart-outline" pack="eva" />}
                        style={{ marginTop: 16, marginBottom: 8 }}
                    >
                        Agregar Encuesta
                    </Button>
                )} */}

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
            </View>

            <CreatePlanModal
                visible={showModal && (isOwner || isAdmin)}
                onClose={() => {
                    setShowModal(false)
                    fetchActualPlan();
                }}
                plan={plan}
            />

            {/* <CreatePollModal
                visible={pollModalVisible}
                onClose={() => {
                    setPollModalVisible(false);
                    setIsEditingPoll(false);
                }}
                onCreatePoll={handleCreatePoll}
                planId={id}
                existingPoll={isEditingPoll ? poll || undefined : undefined}
            /> */}
        </ScreenTemplate>
    );
}

export default PlanDetailScreen;
