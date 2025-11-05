import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import ScreenTemplate from '@common_components/ScreenTemplate';
import FloatingButton from '@common_components/FloatingButton';
import { usePosts } from '@hooks/usePosts';
import { usePostFilters } from '@hooks/usePostFilters';
import PostList from '@screen_components/home/PostList';
import PostFilters from '@screen_components/home/PostFilters';
import CreatePostModal from '@screen_components/home/CreatePostModal';
import { useUserStore } from '@store/useUserStore';
import { usePostStore } from '@store/usePostStore';

export default function HomeScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const { loading, setLoading } = usePostStore();
    const { posts, createPost, fetchAllPosts } = usePosts();
    const { user } = useUserStore();

    const fetchPosts = async () => {
        setLoading(true);
        await fetchAllPosts();
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);
    
    const {
        searchQuery,
        selectedCategories,
        filteredPosts,
        hasActiveFilters,
        setSearchQuery,
        toggleCategory,
        clearFilters,
        totalPosts,
        filteredCount
    } = usePostFilters({ posts });

    const handleCreatePost = (post: any) => {
        createPost(post);
    };

    return (
        <ScreenTemplate 
            omitScroll
            loading={loading}
            loadingMessage='Cargando publicaciones'
        >
            <View style={{ flex: 1 }}>
                <PostFilters
                    searchQuery={searchQuery}
                    selectedCategories={selectedCategories}
                    onSearchChange={setSearchQuery}
                    onToggleCategory={toggleCategory}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                    totalPosts={totalPosts}
                    filteredCount={filteredCount}
                    isVisible={filtersVisible}
                />
                
                <View style={{ flex: 1 }}>
                    <PostList 
                        posts={filteredPosts} 
                        isFiltered={hasActiveFilters}
                        onScroll={(scrollY) => {
                            if (scrollY > 50 && filtersVisible) {
                                setFiltersVisible(false);
                            } else if (scrollY <= 50 && !filtersVisible) {
                                setFiltersVisible(true);
                            }
                        }}
                    />
                </View>
            </View>

            <FloatingButton 
                onPress={() => setModalVisible(true)} 
                iconName="plus" 
            />

            <CreatePostModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCreatePost={handleCreatePost}
            />
        </ScreenTemplate>
    );
}
