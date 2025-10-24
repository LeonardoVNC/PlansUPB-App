import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plan, PlanConfirmation, PlanSave } from '../interfaces/plans.interfaces';
import { Poll } from '../interfaces/vote.interfaces';
import { mockPlans, mockConfirmations } from '../data/plans.mock';

interface PlanState {
    plans: Plan[];
    confirmations: PlanConfirmation[];
    saves: PlanSave[];
    polls: Poll[];

    addPlan: (plan: Plan) => void;
    addConfirmation: (confirmation: PlanConfirmation) => void;
    addSave: (planSave: PlanSave) => void;
    addPoll: (poll: Poll) => void;
    
    updatePlan: (id: string, updates: Partial<Plan>) => void;
    updateConfirmation: (planId: string, userId: string, update: Partial<PlanConfirmation>) => void;
    updatePoll: (pollId: string, updates: Partial<Poll>) => void;
    
    getPollByPlanId: (planId: string) => Poll | undefined;
}

export const usePlanStore = create<PlanState>()(
    persist(
        (set, get) => ({
            plans: mockPlans,
            confirmations: mockConfirmations,
            saves: [],
            polls: [],

            addPlan: async (plan: Plan) => {
                set((state) => ({
                    plans: [...state.plans, { ...plan }],
                }));
            },
            addConfirmation: (confirmation) => {
                const current = get().confirmations;
                const index = current.findIndex((c) =>
                    c.planId === confirmation.planId &&
                    c.userCode === confirmation.userCode
                );

                if (index !== -1) {
                    current[index] = { ...current[index], ...confirmation }
                } else {
                    current.push(confirmation);
                }
                set({ confirmations: current })
            },
            addSave: (planSave) => {
                set((state) => ({
                    saves: [...state.saves, {...planSave}]
                }))
            },
            addPoll: (poll) => {
                set((state) => ({
                    polls: [...state.polls, poll],
                }));
                if (poll.planId) {
                    set((state) => ({
                        plans: state.plans.map((p) =>
                            p.id === poll.planId ? { ...p, pollId: poll.id } : p
                        ),
                    }));
                }
            },

            updatePlan: (id, update) => set((state) => ({
                plans: state.plans.map((p) => (p.id === id ? { ...p, ...update } : p))
            })),
            updateConfirmation: (planId, userId, update) => set((state) => ({
                confirmations: state.confirmations.map((c) => (
                    c.planId === planId && c.userCode === userId ? { ...c, ...update } : c
                ))
            })),
            updatePoll: (pollId, update) => set((state) => ({
                polls: state.polls.map((p) => (p.id === pollId ? { ...p, ...update } : p))
            })),
            
            getPollByPlanId: (planId) => {
                return get().polls.find((poll) => poll.planId === planId);
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
                    if (key === 'polls' && Array.isArray(value)) {
                        return value.map((poll: any) => ({
                            ...poll,
                            createdAt: new Date(poll.createdAt),
                            closesAt: poll.closesAt ? new Date(poll.closesAt) : undefined,
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
