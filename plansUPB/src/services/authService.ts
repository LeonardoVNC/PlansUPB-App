import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";


export const emailSignUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const emailSignIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

export const logout = async () => {
  await signOut(auth);
}
