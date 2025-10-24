export interface User {
    uid: string;
    code: string;
    name: string;
    username: string;
    bio?: string;
    email: string;
    isActive: boolean;
    role: 'Admin' | 'User';
    career: string;
    school: string; // DTI, CSJ, etc
    faculty: string; // FIA, FACED
    photoUrl?: string;
}