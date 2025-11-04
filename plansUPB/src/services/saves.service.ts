import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { PlanSave, Plan } from "@interfaces/plans.interfaces";
import { getPlanById } from './plans.service';

const SAVES_COLLECTION = 'plan_saves';

//Para Crear datos
export const savePlan = async (save: PlanSave) => {
    const saveRef = doc(collection(db, SAVES_COLLECTION));
    
    const dataToSave = Object.entries({
        ...save,
        id: saveRef.id,
        savedAt: new Date()
    }).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
    
    await setDoc(saveRef, dataToSave);
};

//Para leer datos
export const getSavesByUser = async (userCode: string) => {
    const q = query(collection(db, SAVES_COLLECTION), where("userCode", "==", userCode));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        ...doc.data(),
    } as PlanSave))
}

//Para actualizar datos
export const unsavePlan = async (planId: string, userCode: string) => {
    const q = query(
        collection(db, SAVES_COLLECTION),
        where("planId", "==", planId),
        where("userCode", "==", userCode)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        await deleteDoc(snapshot.docs[0].ref);
    }
};