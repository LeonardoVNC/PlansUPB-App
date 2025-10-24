import { useState } from "react";
import { emailSignIn, emailSignUp, resetPassword, logout } from "../services/authService";
import { createUserByUid } from "../services/userService";
import { UserProfile } from "@interfaces/user.interfaces";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await emailSignIn(email.trim(), password);
      return user;
    } catch (e: any) {
      const errorMessage = e?.message ?? "No se pudo iniciar sesión.";
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: Omit<UserProfile, 'uid' | 'password'>, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const credential = await emailSignUp(userData.email, password);
      
      await createUserByUid({
        uid: credential.user.uid,
        code: userData.code,
        name: userData.name,
        username: userData.username,
        bio: userData.bio,
        email: credential.user.email ?? userData.email,
        isActive: true,
        role: userData.role || 'User',
        career: userData.career,
        school: userData.school,
        faculty: userData.faculty,
        photoUrl: userData.photoUrl
      });
      
      return credential.user;
    } catch (e: any) {
      const errorMessage = e?.message ?? "No se pudo crear la cuenta.";
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email.trim());
    } catch (e: any) {
      const errorMessage = e?.message ?? "No pudimos enviar el correo de recuperación.";
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
    } catch (e: any) {
      const errorMessage = e?.message ?? "No se pudo cerrar sesión.";
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    sendPasswordReset,
    signOut,
    loading,
    error,
  };
};
