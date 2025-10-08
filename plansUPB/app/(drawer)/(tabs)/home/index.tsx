import React, { useState } from 'react';
import { View } from 'react-native';
import ScreenTemplate from '../../../../src/components/ScreenTemplate';
import PostList from './components/PostList';
import CreatePostModal from './components/CreatePostModal';
import FloatingButton from '../../../../src/components/FloatingButton';
import { usePosts } from '../../../../src/hooks/usePosts';
import { useUserStore } from '../../../../src/store/useUserStore';

export default function HomeScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const { posts, createPost } = usePosts();
    const { user } = useUserStore();

    const handleCreatePost = (post: any) => {
        createPost(post);
    };

    return (
        <ScreenTemplate title='Publicaciones' subtitle='Comparte con la comunidad UPB'>
            <View style={{ flex: 1, marginTop: 8 }}>
                <PostList posts={posts} />
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
