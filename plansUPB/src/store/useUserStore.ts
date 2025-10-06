import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../interfaces/user.interfaces';

type UserStore = {
    user: User | null;
    logged: boolean;
    login: (user: User) => void;
    logout: () => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            logged: false,
            login: (user: User) => set({ user, logged: true }),
            logout: () => set({ user: null, logged: false }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ user: state.user, logged: state.logged }),
        }
    )
);
