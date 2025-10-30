import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { Plan } from "@interfaces/plans.interfaces";

const PLANS_COLLECTION = 'plans';

//Para Crear datos
export const createPlan = async (plan: Omit<Plan, "id">) => {
    const planRef = doc(collection(db, PLANS_COLLECTION));
    await setDoc(planRef, {
        ...plan,
        id: planRef.id,
        status: plan.status || 'draft',
        createdAt: new Date()
    });
    return planRef.id;
};

//Para Leer datos
export const getPlanById = async (id: string) => {
    const snapshot = await getDoc(doc(db, PLANS_COLLECTION, id));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
        ...data,
        id: snapshot.id,
        date: data.date?.toDate()
    } as Plan;
};

export const getAllPlans = async () => {
    const snapshot = await getDocs(collection(db, PLANS_COLLECTION));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: data.date?.toDate(),
        } as Plan;
    });
};

export const getPlansByOwner = async (ownerCode: string) => {
    const q = query(collection(db, PLANS_COLLECTION), where("ownerCode", "==", ownerCode));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: data.date?.toDate(),
        } as Plan;
    });
};

//Para Actualizar datos
export const updatePlan = async (id: string, updates: Partial<Plan>) => {
    const planRef = doc(db, PLANS_COLLECTION, id);
    await updateDoc(planRef, {
        ...updates,
        updatedAt: new Date()
    });
};

//Para Eliminar datos
export const deletePlan = async (id: string) => {
    await deleteDoc(doc(db, PLANS_COLLECTION, id));
};