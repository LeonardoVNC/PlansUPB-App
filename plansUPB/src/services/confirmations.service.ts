import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { PlanConfirmation } from "@interfaces/plans.interfaces";

const CONFIRMATIONS_COLLECTION = 'plan_confirmations';

//Para Crear datos
export const addConfirmation = async (confirmation: PlanConfirmation) => {
    const existingQuery = query(
        collection(db, CONFIRMATIONS_COLLECTION),
        where("planId", "==", confirmation.planId),
        where("userCode", "==", confirmation.userCode)
    );
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
        console.log('Ya existe una confirmación para este plan y usuario');
        return;
    }
    
    const confirmationRef = doc(collection(db, CONFIRMATIONS_COLLECTION));
    
    const dataToSave = Object.entries({
        ...confirmation,
        id: confirmationRef.id,
        createdAt: new Date()
    }).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
    
    await setDoc(confirmationRef, dataToSave);
};

//Para Leer datos
export const getConfirmationsByUser = async (userCode: string) => {
    const q = query(collection(db, CONFIRMATIONS_COLLECTION), where("userCode", "==", userCode));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        ...doc.data(),
    } as PlanConfirmation));
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
        const dataToUpdate = Object.entries(updates).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {} as any);
        
        await updateDoc(snapshot.docs[0].ref, dataToUpdate);
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