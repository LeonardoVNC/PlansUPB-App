import { create } from 'zustand';
import { Plan } from '../interfaces/plans.interfaces';

interface PlanState {
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
        allPlans: [],
        setAllPlans: (plans) => set({ allPlans: plans }),

        managedPlans: [],
        setManagedPlans: (plans) => set({ allPlans: plans }),

        savedPlans: [],
        setSavedPlans: (plans) => set({ allPlans: plans }),

        loading: false,
        setLoading: (value) => set({ loading: value }),
    })
);
