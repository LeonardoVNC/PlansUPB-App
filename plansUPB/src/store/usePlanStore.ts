import { create } from 'zustand';
import { Plan } from '../interfaces/plans.interfaces';

interface PlanState {
    actualPlan: Plan | null;
    setActualPlan: (plan: Plan) => void;
    removeActualPlan: () => void;

    allPlans: Plan[];
    setAllPlans: (plans: Plan[]) => void;
    managedPlans: Plan[];
    setManagedPlans: (plans: Plan[]) => void;
    savedPlans: Plan[];
    setSavedPlans: (plans: Plan[]) => void;

    loading: boolean;
    setLoading: (value: boolean) => void;
}

export const usePlanStore = create<PlanState>()(
    (set) => ({
        actualPlan: null,
        setActualPlan: (plan) => set({ actualPlan: plan }),
        removeActualPlan: () => set({ actualPlan: null }),

        allPlans: [],
        setAllPlans: (plans) => set({ allPlans: plans }),

        managedPlans: [],
        setManagedPlans: (plans) => set({ managedPlans: plans }),

        savedPlans: [],
        setSavedPlans: (plans) => set({ savedPlans: plans }),

        loading: false,
        setLoading: (value) => set({ loading: value }),
    })
);
