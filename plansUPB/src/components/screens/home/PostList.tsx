import React from 'react';
import { FlatList, View, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';
import { Post } from '@interfaces/post.interfaces';
import { useThemeColors } from '@hooks/useThemeColors';
import PostCard from '@screen_components/home/PostCard';

interface PostListProps {
    posts: Post[];
    isFiltered?: boolean;
    onScroll?: (scrollY: number) => void;
}

export default function PostList({ posts, isFiltered = false, onScroll }: PostListProps) {
    const { colors } = useThemeColors();

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        if (onScroll) {
            onScroll(scrollY);
        }
    };

    if (posts.length === 0) {
        return (
            <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center',
            }}>
                <Icon
                    name={isFiltered ? "search-outline" : "edit-outline"}
                    pack="eva"
                    fill={colors.subtitle}
                    style={{ width: 48, height: 48, marginBottom: 16 }}
                />
                <Text category="h6" style={{ color: colors.subtitle, textAlign: 'center' }}>
                    {isFiltered ? "No se encontraron publicaciones" : "No hay publicaciones aún"}
                </Text>
                <Text category="p2" style={{ color: colors.subtitle, textAlign: 'center', marginTop: 8 }}>
                    {isFiltered 
                        ? "Intenta con otros términos de búsqueda o categoría" 
                        : "¡Sé el primero en publicar algo!"
                    }
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
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ 
                paddingBottom: 80,
                paddingHorizontal: 12,
            }}
        />
    );
}
