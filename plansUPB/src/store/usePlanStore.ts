import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plan, PlanConfirmation } from '../interfaces/plans.interfaces';
import { mockPlans, mockConfirmations } from '../data/plans.mock';
import { useUserStore } from './useUserStore';
import { generateUUID } from '../utils/idGenerator';

interface PlanState {
    plans: Plan[];
    confirmations: PlanConfirmation[];
    addPlan: (plan: Omit<Plan, 'id'>) => Promise<void>;
    updatePlan: (id: string, updates: Partial<Plan>) => void;
    addConfirmation: (confirmation: PlanConfirmation) => void;
    getConfirmationsByPlanId: (planId: string) => PlanConfirmation[];
    isOwner: (planId: string) => boolean;
}

export const usePlanStore = create<PlanState>()(
    persist(
        (set, get) => ({
            plans: mockPlans,
            confirmations: mockConfirmations,

            addPlan: async (plan: Omit<Plan, 'id'>) => { 
                const id = await generateUUID();
                set((state) => ({
                    plans: [...state.plans, { ...plan, id }],
                }));
            },

            updatePlan: (id, update) => set((state) => ({
                plans: state.plans.map((p) => (p.id === id ? { ...p, ...update } : p))
            })),

            addConfirmation: (confirmation) => {
                const current = get().confirmations;
                const index = current.findIndex((c) =>
                    c.planId === confirmation.planId &&
                    c.userId === confirmation.userId
                );

                if (index !== -1) {
                    current[index] = { ...current[index], ...confirmation }
                } else {
                    current.push(confirmation);
                }
                set({ confirmations: current })
            },

            getConfirmationsByPlanId: (planId) => get().confirmations.filter((c) => c.planId === planId),

            isOwner: (planId) => {
                const user = useUserStore.getState().user;
                const plan = get().plans.find((p) => p.id === planId);
                return plan?.owner === user?.code;
            }

        }),
        {
            name: 'plan-storage',
            //Creo que luego lo podemos mover a SQLite o a la DB q usemos
            storage: createJSONStorage(() => AsyncStorage, {
                reviver: (key, value) => {
                    if (key === 'plans' && Array.isArray(value)) {
                        return value.map((plan: any) => ({
                            ...plan,
                            date: new Date(plan.date),
                        }));
                    }
                    if (key === 'confirmations' && Array.isArray(value)) {
                        return value;
                    }
                    return value;
                }
            }),
        }
    )
);
