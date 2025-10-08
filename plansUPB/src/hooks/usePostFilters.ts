import { useState, useMemo } from 'react';
import { Post, PostCategory } from '../interfaces/post.interfaces';

export interface UsePostFiltersProps {
    posts: Post[];
}

export const usePostFilters = ({ posts }: UsePostFiltersProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'Todas'>('Todas');

    const filteredPosts = useMemo(() => {
        let filtered = posts;

        if (selectedCategory !== 'Todas') {
            filtered = filtered.filter(post => post.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(post => 
                post.content.toLowerCase().includes(query) ||
                post.authorName.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [posts, searchQuery, selectedCategory]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('Todas');
    };

    const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'Todas';

    return {
        searchQuery,
        selectedCategory,
        filteredPosts,
        hasActiveFilters,
        setSearchQuery,
        setSelectedCategory,
        clearFilters,
        totalPosts: posts.length,
        filteredCount: filteredPosts.length
    };
};