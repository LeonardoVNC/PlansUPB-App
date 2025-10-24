import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useUserStore } from "@store/useUserStore";
import { getUserByUid } from "@services/userService";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { login: loginStore, logout: logoutStore } = useUserStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u ?? null);
      
      if (u) {
        try {
          const userProfile = await getUserByUid(u.uid);
          if (userProfile) {
            loginStore(userProfile);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        logoutStore();
      }
      
      setLoading(false);
    });
    return unsub;
  }, [loginStore, logoutStore]);

  const logout = async () => {
    await signOut(auth);
    logoutStore();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
