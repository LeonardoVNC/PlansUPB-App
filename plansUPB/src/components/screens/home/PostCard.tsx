import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Card, Text, Icon } from '@ui-kitten/components';
import { Post } from '@interfaces/post.interfaces';
import { usePosts } from '@hooks/usePosts';
import { useThemeColors } from '@hooks/useThemeColors';
import { formatFullDateHour } from '@utils/formatDate';

export default function PostCard({ post }: { post: Post }) {
    const { colors } = useThemeColors();
    const { likePost, hasUserLiked } = usePosts();
    const [expanded, setExpanded] = useState(false);
    const [imageLoading, setImageLoading] = useState(!!post.imageUrl);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageLoading(!!post.imageUrl);
        setImageError(false);
    }, [post.id, post.imageUrl]);

    const isLiked = hasUserLiked(post);
    const likesCount = post.likes.length;

    const handleLike = () => {
        likePost(post.id);
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            'General': 'message-circle',
            'Académico': 'book',
            'Deportes': 'activity',
            'Cultura': 'star',
            'Tecnología': 'monitor',
            'Entretenimiento': 'film',
            'Anuncios': 'bell',
            'Otros': 'grid'
        };
        return icons[category] || 'message-circle';
    };

    const shouldTruncate = post.content.length > 200;
    const displayContent = expanded || !shouldTruncate 
        ? post.content 
        : post.content.substring(0, 200) + '...';

    return (
        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Icon
                            name="person"
                            pack="eva"
                            fill={colors.primary}
                            style={{ width: 20, height: 20, marginRight: 6 }}
                        />
                        <Text category="s1" style={{ color: colors.text, fontWeight: 'bold' }}>
                            {post.authorName}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            name={getCategoryIcon(post.category)}
                            pack="eva"
                            fill={colors.subtitle}
                            style={{ width: 16, height: 16, marginRight: 4 }}
                        />
                        <Text category="c1" style={{ color: colors.subtitle }}>
                            {post.category}
                        </Text>
                        <Text category="c1" style={{ color: colors.subtitle, marginLeft: 8 }}>
                            • {formatFullDateHour(post.createdAt)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Content */}
            <Text category="p1" style={{ color: colors.text, marginBottom: 12 }}>
                {displayContent}
            </Text>

            {shouldTruncate && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)} style={{ marginBottom: 12 }}>
                    <Text category="c1" style={{ color: colors.primary, fontWeight: 'bold' }}>
                        {expanded ? 'Ver menos' : 'Ver más'}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Image */}
            {post.imageUrl && !imageError && (
                <View style={{ position: 'relative', marginBottom: 12 }}>
                    {imageLoading && (
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.border,
                            borderRadius: 8,
                            height: 200,
                            zIndex: 1
                        }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text category="c1" style={{ color: colors.subtitle, marginTop: 8 }}>
                                Cargando imagen...
                            </Text>
                        </View>
                    )}
                    <Image
                        source={{ 
                            uri: post.imageUrl,
                            cache: 'force-cache'
                        }}
                        style={{ 
                            width: '100%', 
                            height: 200, 
                            borderRadius: 8,
                            backgroundColor: colors.border
                        }}
                        resizeMode="cover"
                        onLoadStart={() => {
                            setImageLoading(true);
                        }}
                        onLoad={() => {
                            setImageLoading(false);
                        }}
                        onError={(error) => {
                            setImageLoading(false);
                            setImageError(true);
                        }}
                    />
                </View>
            )}
            
            {post.imageUrl && imageError && (
                <View style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 8,
                    backgroundColor: colors.border,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <Icon
                        name="image-outline"
                        pack="eva"
                        fill={colors.subtitle}
                        style={{ width: 48, height: 48, marginBottom: 8 }}
                    />
                    <Text category="c1" style={{ color: colors.subtitle }}>
                        No se pudo cargar la imagen
                    </Text>
                </View>
            )}

            {/* Footer */}
            <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: colors.border
            }}>
                <TouchableOpacity 
                    onPress={handleLike}
                    style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center',
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        backgroundColor: isLiked ? colors.primary + '20' : 'transparent'
                    }}
                    activeOpacity={0.7}
                >
                    <Icon
                        name={isLiked ? 'heart' : 'heart-outline'}
                        pack="eva"
                        fill={isLiked ? colors.danger : colors.subtitle}
                        style={{ width: 24, height: 24, marginRight: 6 }}
                    />
                    <Text 
                        category="s1" 
                        style={{ 
                            color: isLiked ? colors.danger : colors.subtitle,
                            fontWeight: isLiked ? 'bold' : 'normal'
                        }}
                    >
                        {likesCount}
                    </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                        name="eye"
                        pack="eva"
                        fill={colors.subtitle}
                        style={{ width: 20, height: 20, marginRight: 4 }}
                    />
                    <Text category="c1" style={{ color: colors.subtitle }}>
                        {post.author}
                    </Text>
                </View>
            </View>
        </Card>
    );
}
