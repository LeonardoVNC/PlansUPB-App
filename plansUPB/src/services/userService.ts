import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { UserProfile } from "@interfaces/user.interfaces";
import { db } from "../config/firebase";

const USER_DOCUMENT = 'users';

export const createUser = (user: UserProfile) => {
    return addDoc(collection(db, USER_DOCUMENT), user);
};

export const createUserByUid = (user: Partial<UserProfile>) => {
    if (!user.uid) {
        throw new Error("UID is required");
    }
    
    const userData: Record<string, any> = {
        uid: user.uid,
        code: user.code!,
        name: user.name!,
        username: user.username!,
        email: user.email!,
        isActive: user.isActive!,
        role: user.role!,
        career: user.career!,
        school: user.school!,
        faculty: user.faculty!,
    };
    
    if (user.bio) userData.bio = user.bio;
    if (user.photoUrl) userData.photoUrl = user.photoUrl;
    
    return setDoc(doc(db, USER_DOCUMENT, user.uid), userData);
};

export const updateUserByUid = (uid: string, user: Partial<UserProfile>) => {
    return setDoc(doc(db, USER_DOCUMENT, uid), user, { merge: true });
};

export const updateUserPhoto = (uid: string, photoUrl: string) => {
    return updateUserByUid(uid, { photoUrl });
};

export const getUserByUid = async (uid: string) => {
    const snapshot = await getDoc(doc(db, USER_DOCUMENT, uid));
    if (!snapshot.exists()) {
        return null;
    }
    return snapshot.data() as UserProfile;
};
