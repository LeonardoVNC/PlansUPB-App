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
        updatePlan, updateConfirmation, addPoll, getPollByPlanId } = usePlanStore();
    const { user } = useUserStore();

    useEffect(() => {
        plans.forEach((plan) => checkExpiredPlan(plan))
    }, [])

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
        if (plan.status === 'open' && new Date(plan.date) < new Date()) {
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
    }
}

export default usePlans;