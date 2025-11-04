import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { Post } from "@interfaces/post.interfaces";

const POSTS_COLLECTION = 'posts';

//Para Crear datos
export const createPost = async (post: Omit<Post, "id">) => {
    const postRef = doc(collection(db, POSTS_COLLECTION));
    
    const dataToSave = Object.entries({
        ...post,
        id: postRef.id,
        likes: post.likes || [],
        createdAt: new Date()
    }).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
    
    await setDoc(postRef, dataToSave);
    return postRef.id;
};

//Para Leer datos
export const getPostById = async (id: string) => {
    const snapshot = await getDoc(doc(db, POSTS_COLLECTION, id));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt?.toDate()
    } as Post;
};

export const getAllPosts = async () => {
    const snapshot = await getDocs(collection(db, POSTS_COLLECTION));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
        } as Post;
    });
};

export const getPostsByAuthor = async (authorCode: string) => {
    const q = query(collection(db, POSTS_COLLECTION), where("author", "==", authorCode));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
        } as Post;
    });
};

export const getPostsByCategory = async (category: string) => {
    const q = query(collection(db, POSTS_COLLECTION), where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
        } as Post;
    });
};

//Para Actualizar datos
export const updatePost = async (id: string, updates: Partial<Post>) => {
    const postRef = doc(db, POSTS_COLLECTION, id);
    
    const dataToUpdate = Object.entries({
        ...updates,
        updatedAt: new Date()
    }).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
    
    await updateDoc(postRef, dataToUpdate);
};

//Para Eliminar datos
export const deletePost = async (id: string) => {
    await deleteDoc(doc(db, POSTS_COLLECTION, id));
};
