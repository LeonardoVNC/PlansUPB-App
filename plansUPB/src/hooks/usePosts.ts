import { usePostStore } from '../store/usePostStore';
import { useUserStore } from '../store/useUserStore';
import { Post } from '../interfaces/post.interfaces';

export const usePosts = () => {
    const { posts, addPost, updatePost, removePost, toggleLike, getPostsByAuthor, getPostsByCategory } = usePostStore();
    const { user } = useUserStore();

    const createPost = (post: Post) => {
        addPost(post);
    };

    const deletePost = (postId: string) => {
        removePost(postId);
    };

    const likePost = (postId: string) => {
        if (!user?.code) return;
        toggleLike(postId, user.code);
    };

    const hasUserLiked = (post: Post): boolean => {
        if (!user?.code) return false;
        return post.likes.includes(user.code);
    };

    const getUserPosts = () => {
        if (!user?.code) return [];
        return getPostsByAuthor(user.code);
    };

    const getPostsByUser = (userId: string) => {
        return getPostsByAuthor(userId);
    };

    const filterByCategory = (category: string) => {
        return getPostsByCategory(category);
    };

    const sortedPosts = [...posts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
        posts: sortedPosts,
        createPost,
        updatePost,
        deletePost,
        likePost,
        hasUserLiked,
        getUserPosts,
        getPostsByUser,
        filterByCategory
    };
};
