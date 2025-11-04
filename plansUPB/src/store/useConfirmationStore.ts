import { create } from 'zustand';
import { Plan, PlanConfirmation } from '../interfaces/plans.interfaces';

interface ConfirmationStoreState {
    confirmations: PlanConfirmation[];
    setConfirmations: (confirmations: PlanConfirmation[]) => void;
    invitedPlans: Plan[];
    setInvitedPlans: (plans: Plan[]) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export const useConfirmationStore = create<ConfirmationStoreState>()(
    (set) => ({
        confirmations: [],
        setConfirmations: (confirmations) => set({ confirmations }),
        
        invitedPlans: [],
        setInvitedPlans: (plans) => set({ invitedPlans: plans }),
        
        loading: false,
        setLoading: (value) => set({ loading: value }),
    })
);
