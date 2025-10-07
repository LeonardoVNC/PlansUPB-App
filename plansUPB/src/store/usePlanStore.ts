import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plan, PlanConfirmation } from '../interfaces/plans.interfaces';
import { mockPlans, mockConfirmations } from '../data/plans.mock';

interface PlanState {
    plans: Plan[];
    confirmations: PlanConfirmation[];

    addPlan: (plan: Plan) => void;
    addConfirmation: (confirmation: PlanConfirmation) => void;

    updatePlan: (id: string, updates: Partial<Plan>) => void;
    updateConfirmation: (planId: string, userId: string, update: Partial<PlanConfirmation>) => void;
}

export const usePlanStore = create<PlanState>()(
    persist(
        (set, get) => ({
            plans: mockPlans,
            confirmations: mockConfirmations,

            addPlan: async (plan: Plan) => {
                set((state) => ({
                    plans: [...state.plans, { ...plan }],
                }));
            },
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

            updatePlan: (id, update) => set((state) => ({
                plans: state.plans.map((p) => (p.id === id ? { ...p, ...update } : p))
            })),
            updateConfirmation: (planId, userId, update) => set((state) => ({
                confirmations: state.confirmations.map((c) => (
                    c.planId === planId && c.userId === userId ? { ...c, ...update } : c
                ))
            }))
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
