import { useCallback, useEffect, useState } from 'react';
import { Plan, PlanConfirmation, PlanSave } from '@interfaces/plans.interfaces';
import { generateUUID } from '@utils/idGenerator';
import { usePlanStore } from '@store/usePlanStore';
import { useUserStore } from '@store/useUserStore';

export const usePlans = () => {
    const [allPlansList, setAllPlansList] = useState<Plan[]>([])
    const [managedPlans, setManagedPlans] = useState<Plan[]>([])
    const [invPlansList, setInvPlansList] = useState<Plan[]>([])
    const [savedPlansList, setSavedPlansList] = useState<Plan[]>([])
    const { plans, confirmations, saves, addPlan, addConfirmation, addSave,
        updatePlan, updateConfirmation, removeSave } = usePlanStore();
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
        savePlan,
        unsavePlan,
        isPlanSaved,
    }
}

export default usePlans;