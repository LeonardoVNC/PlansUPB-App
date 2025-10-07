import { useEffect, useState } from 'react';
import { Plan } from '../interfaces/plans.interfaces';
import { generateUUID } from '../utils/idGenerator';
import { usePlanStore } from '../store/usePlanStore';
import { useUserStore } from '../store/useUserStore';

export const usePlans = () => {
    const [managedPlans, setManagedPlans] = useState<Plan[]>([])
    const [filteredPlans, setFilteredPlans] = useState<Plan[]>([])
    const { plans, confirmations, addPlan, addConfirmation, updatePlan, updateConfirmation } = usePlanStore();
    const { user } = useUserStore();

    //Denme una DB por favor ;-;
    useEffect(() => {
        const filtered = plans.filter((plan) => { return plan.owner === user?.code })
        setManagedPlans(filtered)
    }, [plans])

    useEffect(() => {
        const filtered: Plan[] = [];
        confirmations.forEach((confirmation) => {
            if (confirmation.userId === user?.code) {
                const plan = getPlanById(confirmation.planId)
                if (plan) {
                    filtered.push(plan)
                }
            }
        })
        setFilteredPlans(filtered)
    }, [confirmations])

    const createPlan = async (plan: Omit<Plan, "id">) => {
        const id = await generateUUID();
        const newPlan: Plan = { id, ...plan }
        addPlan(newPlan);
    }

    const getPlanById = (id: string) => {
        return plans.find((p) => p.id === id);
    }

    return {
        managedPlans,
        filteredPlans,
        createPlan,
    }
}

export default usePlans;