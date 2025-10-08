import React from 'react';
import { FlatList, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import PostCard from './PostCard';
import { Post } from '../../../../../src/interfaces/post.interfaces';
import { useThemeColors } from '../../../../../src/hooks/useThemeColors';

interface PostListProps {
    posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
    const { colors } = useThemeColors();

    if (posts.length === 0) {
        return (
            <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center',
                paddingVertical: 40
            }}>
                <Text category="h6" style={{ color: colors.subtitle, textAlign: 'center' }}>
                    No hay publicaciones aún
                </Text>
                <Text category="p2" style={{ color: colors.subtitle, textAlign: 'center', marginTop: 8 }}>
                    ¡Sé el primero en publicar algo!
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard post={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
        />
    );
}
