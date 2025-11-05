import { useState, useMemo } from 'react';
import { Post, PostCategory } from '../interfaces/post.interfaces';

export interface UsePostFiltersProps {
    posts: Post[];
}

export const usePostFilters = ({ posts }: UsePostFiltersProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<PostCategory[]>([]);

    const toggleCategory = (category: PostCategory) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else if (prev.length < 2) {
                return [...prev, category];
            }
            return prev;
        });
    };

    const filteredPosts = useMemo(() => {
        let filtered = posts;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(post => selectedCategories.includes(post.category as PostCategory));
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(post => 
                post.content.toLowerCase().includes(query) ||
                post.authorName.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [posts, searchQuery, selectedCategories]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
    };

    const hasActiveFilters = searchQuery.trim() !== '' || selectedCategories.length > 0;

    return {
        searchQuery,
        selectedCategories,
        filteredPosts,
        hasActiveFilters,
        setSearchQuery,
        toggleCategory,
        clearFilters,
        totalPosts: posts.length,
        filteredCount: filteredPosts.length
    };
};