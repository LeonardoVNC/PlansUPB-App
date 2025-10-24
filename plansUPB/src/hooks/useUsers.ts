import { useState, useEffect } from 'react';
import { User } from '@interfaces/user.interfaces';
import { useUserStore } from '@store/useUserStore';
import { getAllUsers } from '../services/userService';

export const useUsers = () => {
    const { user: currentUser } = useUserStore();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const users = await getAllUsers();
                setAllUsers(users);
                
                if (currentUser) {
                    const filtered = users.filter((u: User) => u.code !== currentUser.code);
                    setAvailableUsers(filtered);
                } else {
                    setAvailableUsers(users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser]);

    return {
        allUsers,
        availableUsers,
        loading,
    };
};
