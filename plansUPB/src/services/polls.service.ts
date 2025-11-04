import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { Poll } from "@interfaces/vote.interfaces";

const POLLS_COLLECTION = 'polls';

const normalizePollData = (data: any, id: string): Poll => {
    return {
        id,
        planId: data.planId,
        createdBy: data.createdBy,
        question: data.question || '',
        description: data.description,
        options: Array.isArray(data.options) ? data.options.map((opt: any) => ({
            id: opt?.id || '',
            text: opt?.text || '',
            votes: typeof opt?.votes === 'number' ? opt.votes : 0
        })) : [],
        allowMultiple: Boolean(data.allowMultiple),
        createdAt: data.createdAt?.toDate() || new Date(),
        closesAt: data.closesAt?.toDate(),
        votes: Array.isArray(data.votes) ? data.votes.filter((v: any) => v && v.userId && v.optionId) : [],
        closeCriteria: data.closeCriteria || 'none',
        quorumCount: data.quorumCount,
        tiebreakMethod: data.tiebreakMethod || 'oldest_first',
        isOpen: data.isOpen !== undefined ? Boolean(data.isOpen) : true,
    };
};

//Para Crear datos
export const createPoll = async (poll: Omit<Poll, "id">) => {
    const pollRef = doc(collection(db, POLLS_COLLECTION));
    
    // Filtrar campos undefined para Firestore
    const dataToSave = Object.entries({
        ...poll,
        id: pollRef.id,
        votes: poll.votes || [],
        isOpen: poll.isOpen !== undefined ? poll.isOpen : true,
        createdAt: new Date()
    }).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
    
    await setDoc(pollRef, dataToSave);
    return pollRef.id;
};

//Para Leer datos
export const getPollById = async (id: string) => {
    const snapshot = await getDoc(doc(db, POLLS_COLLECTION, id));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return normalizePollData(data, snapshot.id);
};

export const getAllPolls = async () => {
    const snapshot = await getDocs(collection(db, POLLS_COLLECTION));
    return snapshot.docs.map(doc => normalizePollData(doc.data(), doc.id));
};

export const getPollsByPlanId = async (planId: string) => {
    const q = query(collection(db, POLLS_COLLECTION), where("planId", "==", planId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => normalizePollData(doc.data(), doc.id));
};

//Para Actualizar datos
export const updatePoll = async (id: string, updates: Partial<Poll>) => {
    const pollRef = doc(db, POLLS_COLLECTION, id);
    
    const dataToUpdate = Object.entries({
        ...updates,
        updatedAt: new Date()
    }).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                acc[key] = value.filter(item => item !== null && item !== undefined);
            } else {
                acc[key] = value;
            }
        }
        return acc;
    }, {} as any);
    
    console.log('Actualizando poll en Firestore:', { id, dataToUpdate });
    
    try {
        await updateDoc(pollRef, dataToUpdate);
        console.log('Poll actualizada exitosamente en Firestore');
    } catch (error) {
        console.error('Error al actualizar poll en Firestore:', error);
        throw error;
    }
};

//Para Eliminar datos
export const deletePoll = async (id: string) => {
    await deleteDoc(doc(db, POLLS_COLLECTION, id));
};
