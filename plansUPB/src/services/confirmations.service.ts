import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { PlanConfirmation } from "@interfaces/plans.interfaces";

const CONFIRMATIONS_COLLECTION = 'plan_confirmations';

//Para Crear datos
export const addConfirmation = async (confirmation: PlanConfirmation) => {
    const confirmationRef = doc(collection(db, CONFIRMATIONS_COLLECTION));
    await setDoc(confirmationRef, {
        ...confirmation,
        id: confirmationRef.id,
        createdAt: new Date()
    });
};

//Para Actualizar datos
export const updateConfirmation = async (planId: string, userCode: string, updates: Partial<PlanConfirmation>) => {
    const q = query(
        collection(db, CONFIRMATIONS_COLLECTION), 
        where("planId", "==", planId),
        where("userCode", "==", userCode)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        await updateDoc(snapshot.docs[0].ref, updates);
    }
};

export const removeConfirmation = async (planId: string, userCode: string) => {
    const q = query(
        collection(db, CONFIRMATIONS_COLLECTION),
        where("planId", "==", planId),
        where("userCode", "==", userCode)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        await deleteDoc(snapshot.docs[0].ref);
    }
};