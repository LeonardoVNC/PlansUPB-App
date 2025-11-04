import { usePostStore } from '../store/usePostStore';
import { useUserStore } from '../store/useUserStore';
import { Post } from '../interfaces/post.interfaces';
import * as postService from '@services/posts.service';

export const usePosts = () => {
    const { posts, setPosts } = usePostStore();
    const { user } = useUserStore();

    const fetchAllPosts = async () => {
        const allPosts = await postService.getAllPosts();
        if (!allPosts) return;
        setPosts(allPosts);
    };

    const fetchPostsByAuthor = async (authorCode: string) => {
        const authorPosts = await postService.getPostsByAuthor(authorCode);
        return authorPosts || [];
    };

    const fetchPostsByCategory = async (category: string) => {
        const categoryPosts = await postService.getPostsByCategory(category);
        return categoryPosts || [];
    };

    const createPost = async (post: Omit<Post, "id">) => {
        const newPostId = await postService.createPost(post);
        await fetchAllPosts(); 
        return newPostId;
    };

    const updatePostData = async (postId: string, updates: Partial<Post>) => {
        await postService.updatePost(postId, updates);
        await fetchAllPosts(); 
    };

    const deletePost = async (postId: string) => {
        await postService.deletePost(postId);
        await fetchAllPosts(); 
    };

    const likePost = async (postId: string) => {
        if (!user?.code) return;
        
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        const hasLiked = post.likes.includes(user.code);
        const updatedLikes = hasLiked 
            ? post.likes.filter(id => id !== user.code)
            : [...post.likes, user.code];

        await postService.updatePost(postId, { likes: updatedLikes });
        await fetchAllPosts(); 
    };

    const hasUserLiked = (post: Post): boolean => {
        if (!user?.code) return false;
        return post.likes.includes(user.code);
    };

    const sortedPosts = [...posts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
        fetchAllPosts,
        fetchPostsByAuthor,
        fetchPostsByCategory,
        posts: sortedPosts,
        createPost,
        updatePost: updatePostData,
        deletePost,
        likePost,
        hasUserLiked,
    };
};
