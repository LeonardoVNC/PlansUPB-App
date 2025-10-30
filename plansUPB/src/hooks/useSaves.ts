import { Plan, PlanSave } from "@interfaces/plans.interfaces"
import { useUserStore } from "@store/useUserStore"
import { useState } from "react"
import * as saveService from '@services/saves.service'
import * as planService from '@services/plans.service'
import { usePlanStore } from "@store/usePlanStore"

export const useSaves = () => {
    const [saves, setSaves] = useState<PlanSave[]>([])
    
    const { setSavedPlans } = usePlanStore();
    const { user } = useUserStore();

    const fetchSaves = async () => {
        if (!user) return

        const saves = await saveService.getSavesByUser(user.code)
        setSaves(saves)

        const plans: Plan[] = [];
        for (const save of saves) {
            const plan = await planService.getPlanById(save.planId)
            if (plan) plans.push(plan)
        }
        setSavedPlans(plans)
    }

    const savePlan = async (planId: string) => {
        if (!user) return

        const save: PlanSave = {
            planId,
            userCode: user.code
        }
        await saveService.savePlan(save)
    }

    const unsavePlan = async (planId: string) => {
        if (!user) return

        await saveService.unsavePlan(planId, user.code)
    }

    const isPlanSaved = (planId: string) => {
        if (!user) return false;
        return saves.some(s => s.planId === planId && s.userCode === user.code);
    }

    return {
        saves,
        fetchSaves,
        savePlan,
        unsavePlan,
        isPlanSaved,
    }
}