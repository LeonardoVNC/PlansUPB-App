import { create } from 'zustand';
import { Poll } from '../interfaces/vote.interfaces';

interface PollStoreState {
    polls: Poll[];
    setPolls: (polls: Poll[] | ((current: Poll[]) => Poll[])) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export const usePollStore = create<PollStoreState>()(
    (set) => ({
        polls: [],
        setPolls: (polls) => set((state) => ({ 
            polls: typeof polls === 'function' ? polls(state.polls) : polls 
        })),
        
        loading: false,
        setLoading: (value) => set({ loading: value }),
    })
);
