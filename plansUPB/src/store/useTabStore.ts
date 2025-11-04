import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TabName =
  | 'home'
  | 'plans_general'
  | 'plans_self'
  | 'plans_invs'
  | 'plans_fav'
  | 'maps';

const DEFAULT_ORDER: TabName[] = [
  'home',
  'plans_general',
  'plans_self',
  'plans_invs',
  'plans_fav',
  'maps',
];

interface TabStore {
  order: TabName[];
  hidden: Partial<Record<TabName, boolean>>;
  setOrder: (newOrder: TabName[]) => void;
  resetOrder: () => void;
  setHidden: (tab: TabName, hidden: boolean) => void;
  toggleHidden: (tab: TabName) => void;
  resetHidden: () => void;
}

export const useTabStore = create<TabStore>()(
  persist(
    (set) => ({
      order: DEFAULT_ORDER,
      hidden: {},
      setOrder: (newOrder) => set({ order: newOrder.filter(Boolean) as TabName[] }),
      resetOrder: () => set({ order: DEFAULT_ORDER }),
      setHidden: (tab, isHidden) => set((state) => ({ hidden: { ...state.hidden, [tab]: isHidden } })),
      toggleHidden: (tab) => set((state) => ({ hidden: { ...state.hidden, [tab]: !state.hidden[tab] } })),
      resetHidden: () => set({ hidden: {} }),
    }),
    {
      name: 'tab-preferences',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ order: state.order, hidden: state.hidden }),
    }
  )
);


