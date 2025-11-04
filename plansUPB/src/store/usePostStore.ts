import { create } from 'zustand';
import { Post } from '../interfaces/post.interfaces';

interface PostStoreState {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export const usePostStore = create<PostStoreState>()(
    (set) => ({
        posts: [],
        setPosts: (posts) => set({ posts }),
        
        loading: false,
        setLoading: (value) => set({ loading: value }),
    })
);
