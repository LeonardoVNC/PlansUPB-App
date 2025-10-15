import React, { useState } from 'react';
import { View } from 'react-native';
import ScreenTemplate from '@common_components/ScreenTemplate';
import PostList from './components/PostList';
import PostFilters from './components/PostFilters';
import CreatePostModal from './components/CreatePostModal';
import FloatingButton from '@common_components/FloatingButton';
import { usePosts } from '../../../../src/hooks/usePosts';
import { usePostFilters } from '../../../../src/hooks/usePostFilters';
import { useUserStore } from '../../../../src/store/useUserStore';

export default function HomeScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const { posts, createPost } = usePosts();
    const { user } = useUserStore();
    
    const {
        searchQuery,
        selectedCategory,
        filteredPosts,
        hasActiveFilters,
        setSearchQuery,
        setSelectedCategory,
        clearFilters,
        totalPosts,
        filteredCount
    } = usePostFilters({ posts });

    const handleCreatePost = (post: any) => {
        createPost(post);
    };

    return (
        <ScreenTemplate omitScroll>
            <View style={{ flex: 1 }}>
                <PostFilters
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    onSearchChange={setSearchQuery}
                    onCategoryChange={setSelectedCategory}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                    totalPosts={totalPosts}
                    filteredCount={filteredCount}
                />
                
                <View style={{ flex: 1 }}>
                    <PostList 
                        posts={filteredPosts} 
                        isFiltered={hasActiveFilters}
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
                userCode={user?.code || ''}
                userName={user?.name || 'Usuario'}
            />
        </ScreenTemplate>
    );
}
