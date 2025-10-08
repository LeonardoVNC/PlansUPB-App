import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, PostState } from '../interfaces/post.interfaces';
import { mockPosts } from '../data/posts.mock';

export const usePostStore = create<PostState>()(
    persist(
        (set, get) => ({
            posts: mockPosts,

            addPost: (post: Post) => {
                set((state) => ({
                    posts: [post, ...state.posts]
                }));
            },

            updatePost: (postId: string, updates: Partial<Post>) => {
                set((state) => ({
                    posts: state.posts.map((post) =>
                        post.id === postId ? { ...post, ...updates } : post
                    )
                }));
            },

            removePost: (postId: string) => {
                set((state) => ({
                    posts: state.posts.filter((post) => post.id !== postId)
                }));
            },

            toggleLike: (postId: string, userId: string) => {
                set((state) => ({
                    posts: state.posts.map((post) => {
                        if (post.id === postId) {
                            const hasLiked = post.likes.includes(userId);
                            return {
                                ...post,
                                likes: hasLiked
                                    ? post.likes.filter(id => id !== userId)
                                    : [...post.likes, userId]
                            };
                        }
                        return post;
                    })
                }));
            },

            getPostsByAuthor: (authorId: string) => {
                return get().posts.filter((post) => post.author === authorId);
            },

            getPostsByCategory: (category: string) => {
                return get().posts.filter((post) => post.category === category);
            },

            getPostById: (postId: string) => {
                return get().posts.find((post) => post.id === postId);
            }
        }),
        {
            name: 'post-storage',
            storage: createJSONStorage(() => AsyncStorage, {
                reviver: (key: string, value: any) => {
                    if (key === 'posts' && Array.isArray(value)) {
                        return value.map((post: any) => ({
                            ...post,
                            createdAt: new Date(post.createdAt),
                        }));
                    }
                    return value;
                }
            }),
            partialize: (state: PostState) => ({
                posts: state.posts,
            }),
        }
    )
);
