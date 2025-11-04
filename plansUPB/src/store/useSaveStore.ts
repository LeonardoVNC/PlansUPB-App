import { create } from 'zustand';
import { PlanSave } from '../interfaces/plans.interfaces';

interface SaveStoreState {
    saves: PlanSave[];
    setSaves: (saves: PlanSave[]) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export const useSaveStore = create<SaveStoreState>()(
    (set) => ({
        saves: [],
        setSaves: (saves) => set({ saves }),
        
        loading: false,
        setLoading: (value) => set({ loading: value }),
    })
);
