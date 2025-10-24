import { useCallback, useEffect, useState } from 'react';
import { Plan, PlanConfirmation, PlanSave } from '@interfaces/plans.interfaces';
import { Poll } from '@interfaces/vote.interfaces';
import { generateUUID } from '@utils/idGenerator';
import { usePlanStore } from '@store/usePlanStore';
import { useUserStore } from '@store/useUserStore';

export const usePlans = () => {
    const [allPlansList, setAllPlansList] = useState<Plan[]>([])
    const [managedPlans, setManagedPlans] = useState<Plan[]>([])
    const [invPlansList, setInvPlansList] = useState<Plan[]>([])
    const [savedPlansList, setSavedPlansList] = useState<Plan[]>([])
    const { plans, confirmations, saves, addPlan, addConfirmation, addSave,
        updatePlan, updateConfirmation, addPoll, getPollByPlanId, removeSave, 
        removePlan, removeConfirmation } = usePlanStore();
    const { user } = useUserStore();

    useEffect(() => {
        plans.forEach((plan) => checkExpiredPlan(plan))
    }, [plans])

    //Denme una DB por favor ;-;
    useEffect(() => {
        if (!user) return;

        setAllPlansList(plans)
        setManagedPlans(filteredManagedPlans(plans))
        setInvPlansList(filteredInvPlans(confirmations))
        setSavedPlansList(filteredSavedPlans(saves))
    }, [plans, confirmations, saves, user])

    const filteredManagedPlans = useCallback((allPlans: Plan[]) => {
        const filtered = allPlans.filter((plan) => { return plan.ownerCode === user?.code })
        return filtered
    }, [plans, user])

    const filteredInvPlans = useCallback((confirmations: PlanConfirmation[]) => {
        const filtered: Plan[] = [];
        confirmations.forEach((confirmation) => {
            if (confirmation.userCode === user?.code) {
                const plan = getPlanById(confirmation.planId)
                if (plan) {
                    filtered.push(plan)
                }
            }
        })
        return filtered
    }, [confirmations, user])

    const filteredSavedPlans = useCallback((saves: PlanSave[]) => {
        const filtered: Plan[] = [];
        saves.forEach((save) => {
            if (save.userCode === user?.code) {
                const plan = getPlanById(save.planId)
                if (plan) {
                    filtered.push(plan)
                }
            }
        })
        return filtered
    }, [saves, user])

    const checkExpiredPlan = (plan: Plan) => {
        const planDate = new Date(plan.date);
        const now = new Date();
        const oneHourAfterPlan = new Date(planDate.getTime() + 60 * 60 * 1000);
        
        if (plan.status === 'open' && now > oneHourAfterPlan) {
            changePlanStatus(plan.id, 'cancelled')
        }
    };

    const createPlan = async (plan: Omit<Plan, "id">) => {
        const id = await generateUUID();
        const newPlan: Plan = { id, ...plan }
        addPlan(newPlan);
    }

    const getPlanById = (id: string) => {
        return plans.find((p) => p.id === id);
    }

    const changePlanStatus = (planId: string, status: string) => {
        updatePlan(planId, { status })
    }

    const addPollToPlan = (poll: Poll) => {
        addPoll(poll);
    }

    const getPollForPlan = (planId: string) => {
        return getPollByPlanId(planId);
    }

    const savePlan = (planId: string) => {
        if (!user) return

        const save: PlanSave = {
            planId,
            userCode: user.code
        }
        addSave(save)
    }

    const unsavePlan = (planId: string) => {
        if (!user) return

        removeSave(planId, user.code)
    }

    const isPlanSaved = (planId: string) => {
        if (!user) return false;
        return saves.some(s => s.planId === planId && s.userCode === user.code);
    }

    const deletePlan = (planId: string) => {
        removePlan(planId);
    }

    const respondToInvitation = (planId: string, accept: boolean) => {
        if (!user) return;

        if (accept) {
            updateConfirmation(planId, user.code, { 
                status: 'accepted', 
                confirmed: true,
                respondedAt: new Date()
            });
        } else {
            removeConfirmation(planId, user.code);
        }
    }

    const setRSVP = (planId: string, willAttend: boolean) => {
        if (!user) return;

        updateConfirmation(planId, user.code, { 
            confirmed: willAttend,
            respondedAt: new Date()
        });

        if (willAttend) {
            const existingConfirmation = confirmations.find(
                c => c.planId === planId && c.userCode === user.code
            );
            if (!existingConfirmation) {
                addConfirmation({
                    planId,
                    userCode: user.code,
                    confirmed: true,
                    status: 'accepted',
                    respondedAt: new Date()
                });
            }
        }
    }

    const getUserRSVP = (planId: string): boolean | undefined => {
        if (!user) return undefined;
        const confirmation = confirmations.find(
            c => c.planId === planId && c.userCode === user.code
        );
        return confirmation?.confirmed;
    }

    const getAttendanceStats = (planId: string) => {
        const plan = getPlanById(planId);
        if (!plan) return { attending: 0, notAttending: 0, percentage: 0, total: 0 };

        const planConfirmations = confirmations.filter(c => c.planId === planId);
        
        const attending = planConfirmations.filter(c => c.confirmed === true).length + 1;
        const notAttending = planConfirmations.filter(c => c.confirmed === false).length;
        const total = attending + notAttending;
        const percentage = total > 0 ? Math.round((attending / total) * 100) : 100;

        return { attending, notAttending, percentage, total };
    }

    return {
        allPlansList,
        managedPlans,
        invPlansList,
        savedPlansList,
        createPlan,
        getPlanById,
        updatePlan,
        checkExpiredPlan,
        changePlanStatus,
        addPollToPlan,
        getPollForPlan,
        savePlan,
        unsavePlan,
        isPlanSaved,
        addConfirmation,
        deletePlan,
        respondToInvitation,
        setRSVP,
        getUserRSVP,
        getAttendanceStats,
    }
}

export default usePlans;