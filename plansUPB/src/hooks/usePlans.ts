import { Plan } from '@interfaces/plans.interfaces';
import * as planService from '@services/plans.service'
import { useUserStore } from '@store/useUserStore';
import { usePlanStore } from '@store/usePlanStore';

export const usePlans = () => {
    const { allPlans, setAllPlans, setManagedPlans } = usePlanStore();
    const { user } = useUserStore();

    const fetchAllPlans = async () => {
        const plans = await planService.getAllPlans();
        if (!plans) return

        setAllPlans(plans)
    }

    const fetchManagedPlans = async () => {
        setManagedPlans(filteredManagedPlans(allPlans))
    }

    const filteredManagedPlans = (allPlans: Plan[]) => {
        const filtered = allPlans.filter((plan) => { return plan.ownerCode === user?.code })
        console.log("filtered on usePlans", filtered)
        return filtered
    }

    const createPlan = async (plan: Omit<Plan, "id">) => {
        await planService.createPlan(plan);
        await fetchAllPlans();
    }

    const getPlanById = async (id: string) => {
        const plan = await planService.getPlanById(id)
        if (!plan) return

        checkExpiredPlan(plan)
        return plan
    }

    const updatePlan = async (planId: string, plan: Partial<Plan>) => {
        await planService.updatePlan(planId, plan);
        await fetchAllPlans();
    }

    const deletePlan = async (planId: string) => {
        await planService.deletePlan(planId);
        await fetchAllPlans();
    }

    const changePlanStatus = async (planId: string, status: string) => {
        await planService.updatePlan(planId, { status })
        await fetchAllPlans();
    }

    const checkExpiredPlan = (plan: Plan) => {
        const planDate = new Date(plan.date);
        const now = new Date();
        const oneHourAfterPlan = new Date(planDate.getTime() + 60 * 60 * 1000);

        if (plan.status === 'open' && now > oneHourAfterPlan) {
            changePlanStatus(plan.id, 'cancelled')
        }
    };

    return {
        fetchAllPlans,
        fetchManagedPlans,
        createPlan,
        getPlanById,
        updatePlan,
        deletePlan,
        changePlanStatus,
        checkExpiredPlan,
    }
}

export default usePlans;